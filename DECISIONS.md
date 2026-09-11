## Optimización de performance en registro de organización

**Fecha:** 2026-09-01
**Contexto:** Al hacer load testing con k6 sobre `registerOrganization` 
(5 VUs, 20s), el tiempo de respuesta promedio rondaba los 600-700ms — 
alto para un flow que debería resolverse en menos de 250ms.

### Problema 1: envío de email bloqueando la respuesta

El welcome email se enviaba con Resend usando `await` dentro del mismo 
flujo síncrono que la transacción de Prisma. Esto significa que el 
usuario esperaba a que Resend confirmara el envío antes de recibir 
respuesta, agregando latencia de red externa al tiempo percibido.

**Decisión:** usar `after()` (API estable de Next.js 15+, importada de 
`next/server`) para desacoplar el envío del email del ciclo de 
request/response. El callback pasado a `after()` corre después de que 
la respuesta ya fue enviada al cliente, pero el runtime garantiza que 
se ejecute hasta terminar (a diferencia de un simple fire-and-forget 
sin await, que en entornos serverless puede cortarse si el proceso 
termina antes).

**Alternativas consideradas:**
- Fire-and-forget sin `after()`: descartado por riesgo de que el 
  runtime mate el proceso antes de que Resend confirme el envío.
- Queue/job en background (ej. BullMQ): descartado por over-engineering 
  para el volumen actual de registros.

### Problema 2: bcryptjs saturando el event loop bajo concurrencia

Después de resolver el email, el tiempo de respuesta seguía siendo alto 
(~700ms) con 5 VUs concurrentes. Logs con timestamps por etapa mostraron 
que el salto de tiempo estaba en `bcrypt.hash()`, no en las queries a 
la DB (TiDB Cloud Serverless respondía en 100-150ms, normal para 
conexión remota).

`bcryptjs` es una implementación pura en JS sin bindings nativos, por 
lo que el hashing corre en el hilo principal de Node y bloquea el 
event loop. Bajo concurrencia, esto generaba cola: cada operación de 
hash competía por CPU con las demás, multiplicando la latencia 
percibida por request.

**Decisión:** migrar de `bcryptjs` a `bcrypt` (bindings nativos en 
C++), que delega el hashing al thread pool de libuv en vez del hilo 
principal.

**Resultado medido (mismo test de k6, 5 VUs / 20s):**

| Métrica          | Antes (bcryptjs) | Después (bcrypt) |
|------------------|------------------|-------------------|
| avg              | ~718ms           | ~224ms            |
| mediana          | ~713ms           | ~185ms            |
| p95              | ~764ms           | ~596ms*           |
| errores          | 0%               | 0%                |

*p95 sigue mostrando cola larga puntual, probablemente por reconexión 
a TiDB tras períodos idle — pendiente de investigar si escala la 
concurrencia.

### Aprendizaje

El diagnóstico por intuición ("debe ser la DB") hubiese llevado a 
optimizar en el lugar equivocado. Medir por etapa con timestamps 
(antes/después de cada await) fue lo que expuso el cuello de botella 
real. Como regla general: cualquier librería de hashing/crypto sin 
bindings nativos es sospechosa bajo carga concurrente en Node.