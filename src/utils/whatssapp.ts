export const getWhatsappLink = (phone: string, message: string) => {
  const cleanPhone = phone.replace(/\D/g, ""); // solo números
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const confirmOrderMessage = (name?: string) => {
  return `Hola ${name ?? ""} \nSoy de Sabores Naturales.\n\nRecibimos tu pedido y queremos confirmar si todo está correcto para comenzar a prepararlo \n\n¿Confirmás que podemos avanzar con tu pedido?\n\n¡Gracias! `;
};

export const readyMessage = (name?: string) => {
  return `Hola ${name ?? ""} \n\nTu pedido ya está listo \n\nPodés pasar a retirarlo cuando quieras o ya va en camino \n\n¡Gracias por elegirnos! `;
};