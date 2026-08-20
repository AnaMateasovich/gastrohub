"use client";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { adminCreateOrderSchema } from "@/src/lib/validations/order.schema";
import {
  Bike,
  Minus,
  Plus,
  ShoppingBag,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import Input from "../../../(main)/components/Input";
import { getProducts } from "@/src/lib/products";
import { ProductType } from "../../../types/product.type";
import { UserType } from "../../../types/user.type";
import useDebounce from "../../../hooks/useDebounce";
import { createOrder } from "@/src/lib/actions/orders.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

type OrderFormType = z.infer<typeof adminCreateOrderSchema>;

const FormCreateOrder = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [productsList, setProducts] = useState<ProductType[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<UserType[]>([]);
  const [onSubmiting, setOnSubmiting] = useState<boolean>(false);

  const router = useRouter();

  const debouncedSearch = useDebounce(search, 400);

  const {
    register,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
  } = useForm<OrderFormType>({
    resolver: zodResolver(adminCreateOrderSchema),
    mode: "onChange",
    defaultValues: { orderItems: [], wantsDelivery: false },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "orderItems",
  });

  const orderItems = watch("orderItems");

  const total = orderItems.reduce((acc, item) => {
    const product = productsList.find((p) => p.id === item.productId);
    return acc + (product?.price ?? 0) * item.quantity;
  }, 0);

  const customerType = watch("customerType");
  const wantsDelivery = watch("wantsDelivery");

  const onSubmit = async (data: OrderFormType) => {
    try {
      setOnSubmiting(true);

      await createOrder({
        customerName: data.customerName,
        customerLastname: data.customerLastname,
        phone: data.phone,
        email: data.email,
        address: data.address,
        customerId:
          customerType === "existing" ? (data.customerId ?? null) : null,
        wantsDelivery: wantsDelivery,
        orderItems: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      toast.success("Pedido creado correctamente");
      router.push("/admin/pedidos");
      reset();
      setStep(1);
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al crear el pedido");
    } finally {
      setOnSubmiting(false);
    }
  };

  useEffect(() => {
    if (!debouncedSearch) return;

    const fetchClients = async () => {
      const res = await fetch(`/api/clients?email=${debouncedSearch}`);
      if (!res.ok) {
        console.error("Error:", res.status, await res.text()); // ver el error real
        return;
      }

      const customers = await res.json();
      setResults(customers);
    };
    fetchClients();
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setProducts(products);
    };

    fetchProducts();
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit, (errors) => {
})}>
      {step === 1 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500">
            ¿Cómo querés ingresar el cliente?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setValue("customerType", "anonymous");
                setValue("customerName", "Anónimo");
                setValue("customerLastname", "Anónimo");
                setValue("phone", "0000000000");
                setValue("email", "anonimo@anonimo.com");
                setValue("address", "Sin dirección");
                setValue("customerId", undefined);
                setValue("wantsDelivery", false); // venta anónima siempre es "retira"
              }}
              className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all
    ${customerType === "anonymous" ? "border-[var(--color-primary)] bg-[var(--color-natural-bg)]" : "border-gray-200 bg-white"}`}
            >
              <UserX
                size={28}
                className={
                  customerType === "anonymous"
                    ? "text-[var(--color-primary-dark)]"
                    : "text-gray-400"
                }
              />
              <span
                className={`font-medium ${customerType === "anonymous" ? "text-[var(--color-primary-dark)]" : "text-gray-700"}`}
              >
                Anónimo
              </span>
            </button>
            <button
              type="button"
              onClick={() => setValue("customerType", "new")}
              className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all
          ${
            customerType === "new"
              ? "border-[var(--color-primary)] bg-[var(--color-natural-bg)]"
              : "border-gray-200 bg-white"
          }`}
            >
              <UserPlus
                size={28}
                className={
                  customerType === "new"
                    ? "text-[var(--color-primary-dark)]"
                    : "text-gray-400"
                }
              />
              <span
                className={`font-medium ${customerType === "new" ? "text-[var(--color-primary-dark)]" : "text-gray-700"}`}
              >
                Nuevo cliente
              </span>
            </button>

            <button
              type="button"
              onClick={() => setValue("customerType", "existing")}
              className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all
          ${
            customerType === "existing"
              ? "border-[var(--color-primary)] bg-[var(--color-natural-bg)]"
              : "border-gray-200 bg-white"
          }`}
            >
              <Users
                size={28}
                className={
                  customerType === "existing"
                    ? "text-[var(--color-primary-dark)]"
                    : "text-gray-400"
                }
              />
              <span
                className={`font-medium ${customerType === "existing" ? "text-[var(--color-primary-dark)]" : "text-gray-700"}`}
              >
                Cliente existente
              </span>
            </button>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setStep(customerType === "anonymous" ? 3 : 2)}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
      {step === 2 && customerType === "new" && (
        <div>
          <h2 className="mb-2">Ingresar un nuevo cliente</h2>
          <div className="flex flex-col gap-2 mb-3">
            <Input
              type="text"
              placeholder="Nombre del cliente"
              name="customerName"
              register={register}
              error={errors.customerName?.message}
            />
            <Input
              type="text"
              placeholder="Apellido del cliente"
              name="customerLastname"
              register={register}
              error={errors.customerLastname?.message}
            />
            <Input
              type="text"
              placeholder="Email del cliente"
              name="email"
              register={register}
              error={errors.email?.message}
            />
            <Input
              type="text"
              placeholder="Teléfono del cliente"
              name="phone"
              register={register}
              error={errors.phone?.message}
            />
            <Input
              type="text"
              placeholder="Dirección del cliente"
              name="address"
              register={register}
              error={errors.address?.message}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setValue("wantsDelivery", false)}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${
                    !wantsDelivery
                      ? "border-[var(--color-primary)] bg-[var(--color-natural-bg)]"
                      : "border-gray-200 bg-white"
                  }`}
            >
              <ShoppingBag size={20} />
              Retira
            </button>

            <button
              type="button"
              onClick={() => setValue("wantsDelivery", true)}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${
                    wantsDelivery
                      ? "border-[var(--color-primary)] bg-[var(--color-natural-bg)]"
                      : "border-gray-200 bg-white"
                  }`}
            >
              <Bike size={20} />
              Envío
            </button>
          </div>

          <div className="flex justify-between items-center mt-2">
            <div className="flex mt-2">
              <button type="button" onClick={() => setStep(1)}>
                ← Anterior
              </button>
            </div>
            <div className="flex mt-2">
              <button type="button" onClick={() => setStep(3)}>
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && customerType === "existing" && (
        <div className="flex flex-col gap-3">
          <h2 className="mb-1">Buscar cliente existente</h2>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--color-primary)] focus:outline-none transition-all text-sm"
            />
          </div>

          {results.length > 0 && (
            <div className="flex flex-col gap-1 border border-gray-200 rounded-xl overflow-hidden">
              {results.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setValue("customerId", c.id);
                    setValue("customerName", c.name);
                    setValue("customerLastname", c.lastname);
                    setValue("email", c.email);
                    setValue("phone", c.phone);
                    setValue("address", c.address);
                    setResults([]);
                  }}
                  className="flex flex-col items-start px-4 py-3 hover:bg-[var(--color-natural-bg)] transition-all text-left border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium text-sm">
                    {c.name} {c.lastname}
                  </span>
                  <span className="text-xs text-gray-500">{c.email}</span>
                </button>
              ))}
            </div>
          )}

          {watch("customerId") && (
            <div className="p-4 rounded-xl border-2 border-[var(--color-primary)] bg-[var(--color-natural-bg)]">
              <p className="font-medium text-[var(--color-primary-dark)]">
                {watch("customerName")} {watch("customerLastname")}
              </p>
              <p className="text-sm text-gray-500 mt-1">{watch("email")}</p>
              <p className="text-sm text-gray-500">{watch("phone")}</p>
              <p className="text-sm text-gray-500">{watch("address")}</p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setValue("wantsDelivery", false)}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${
                    !wantsDelivery
                      ? "border-[var(--color-primary)] bg-[var(--color-natural-bg)]"
                      : "border-gray-200 bg-white"
                  }`}
            >
              <ShoppingBag size={20} />
              Retira
            </button>

            <button
              type="button"
              onClick={() => setValue("wantsDelivery", true)}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${
                    wantsDelivery
                      ? "border-[var(--color-primary)] bg-[var(--color-natural-bg)]"
                      : "border-gray-200 bg-white"
                  }`}
            >
              <Bike size={20} />
              Envío
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <button type="button" onClick={() => setStep(1)}>
              ← Anterior
            </button>
            <button type="button" onClick={() => setStep(3)}>
              Siguiente →
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col gap-3">
          {productsList.map((product) => {
            const index = fields.findIndex((f) => f.productId === product.id);
            const inCart = index !== -1;
            const quantity = inCart ? watch(`orderItems.${index}.quantity`) : 0;

            return (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-200"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">${product.price}</p>
                </div>

                {inCart ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (quantity <= 1) remove(index);
                        else
                          update(index, {
                            productId: product.id,
                            quantity: quantity - 1,
                          });
                      }}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-6 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        update(index, {
                          productId: product.id,
                          quantity: quantity + 1,
                        })
                      }
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      append({ productId: product.id, quantity: 1 })
                    }
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
            );
          })}
          <div className="flex justify-between font-semibold text-base px-1">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={() => setStep(customerType === "anonymous" ? 1 : 2)}
            >
              ← Anterior
            </button>
            <button
              className="bg-[var(--color-primary)] py-2 px-4 text-white rounded"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando pedido..." : "Crear pedido"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default FormCreateOrder;
