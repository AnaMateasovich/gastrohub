"use client";
import { OrderType } from "../../types/order.type";
import {
  BookText,
  Calendar,
  MapPin,
  Motorbike,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import Button from "../../(main)/components/Button";
import LinkComponent from "../../(main)/components/LinkComponent";
import {
  confirmOrderMessage,
  getWhatsappLink,
  readyMessage,
} from "@/src/utils/whatssapp";
import { useState } from "react";
import { updateStatusOrder } from "../../services/orders.service";
import BackButton from "../../(main)/components/BackButton";
import StatusOrder from "./StatusOrder";
import { OrderStatus } from "../../types/orderStatus.type";

type OrderProps = {
  order: OrderType;
};

const Order = ({ order }: OrderProps) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);

  const date = new Date(order.createdAt).toLocaleDateString();

  const total = order.orderItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const deliveryFee = Number(order.deliveryFee) || 0;
  const discount = Number(order.discount) || 0;
  const finalTotal = total + deliveryFee - discount;
  const deliveryMethod = order.deliveryFee && order.deliveryFee > 0 ? "Envio a domicilio" : "Retira";

  const statusLabels: Record<string, string> = {
    PREPARING: "En preparación",
    READY: "Listo",
    PICKEDUP: "Retirado",
    CANCELLED: "Cancelado",
    SHIPPED: "Enviado",
  };

  const getButtonText = (): string => {
    const next = getNextStatus();
    if (!next) return "No hay acciones disponibles";
    return `Marcar como ${statusLabels[next].toLowerCase()}`;
  };

  const getNextStatus = (): OrderStatus | null => {
    if (currentStatus === "PENDING") return "PREPARING";
    if (currentStatus === "PREPARING") return "READY";
    if (currentStatus === "READY") return deliveryFee > 0 ? "SHIPPED" : "PICKEDUP";
    return null;
  };

  console.log(deliveryFee)

  const messageConfirm = confirmOrderMessage(order.user?.name);
  const whatsappConfirmLink = getWhatsappLink(
    order.user?.phone || order.phone,
    messageConfirm,
  );

  const messageReady = confirmOrderMessage(order.user?.name);
  const whatsappReadyLink = readyMessage(order.user?.phone || "");

  const handleChangeStatus = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    const confirm = window.confirm(
      `Estas seguro que quieres cambiar el estado a ${statusLabels[newStatus]}`,
    );
    if (confirm) {
      try {
        await updateStatusOrder(orderId, newStatus);
        setCurrentStatus(newStatus);
      } catch (error) {
        console.error(error);
        alert("Hubo un error al actualizar el estado");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <BackButton />
          <h4 className="font-bold text-xl">Pedido #{order.id}</h4>
        </div>
        <StatusOrder status={currentStatus} />
      </div>
      {/* informacion del cliente  */}
      <section className="rounded-2xl border border-gray-100 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
        <header className="flex gap-2 pt-3 px-2 pb-1 border-b border-gray-200 rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.08)]">
          <User size={25} className="text-gray-600" />
          <h5 className="font-bold mb-1 shadow-[]">Información del cliente</h5>
        </header>
        <div className="bg-white/80 py-2 px-3 space-y-3 rounded-xl">
          <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
            <User size={27} className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Nombre:</p>
              <p className="font-semibold">
                {order.user?.name || order.customerName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
            <Phone size={27} className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Celular:</p>
              <p className="font-semibold">
                +{order.user?.phone || order.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={27} className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Dirección:</p>
              <p className="font-semibold">
                {order.user?.address || order.address}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/** RESUMEN DEL PEDIDO */}
      <header className="flex gap-2 mt-4 ml-2 mb-2">
        <BookText size={20} className="text-gray-600" />
        <h5 className="font-bold">Resumen del pedido</h5>
      </header>
      <section className="bg-white/80 py-2 px-3 space-y-3 rounded-xl shadow-md">
        <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
          <Calendar size={27} className="text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Fecha:</p>
            <p className="font-semibold">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 pb-2">
          <Motorbike size={27} className="text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Entrega:</p>
            <p className="font-semibold">{deliveryMethod}</p>
          </div>
        </div>
      </section>
      {/** PRODUCTOS */}
      <section>
        <header className="flex gap-2 mt-4 ml-2 mb-2">
          <h5 className="font-bold">Productos ({order.orderItems.length})</h5>
        </header>
        <div className="bg-white/80 py-2 px-3 space-y-3 rounded-xl shadow-md">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 pb-2 border-b border-gray-200 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-2 ">
                <div className="relative w-15 h-15">
                  <Image
                    src={item.product.src}
                    fill
                    sizes="100px"
                    alt={item.product.name}
                    className="rounded-md object-cover "
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-gray-600">x{item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">
                ${item.product.price * item.quantity}
              </p>
            </div>
          ))}
        </div>
        {/* TOTAL */}
        <div className="bg-white/80 flex flex-col py-2 px-4 space-y-1 border-b border-gray-200 mt-2 rounded-xl shadow-md">
          <div className="flex justify-between w-full">
            <p>Subtotal</p>
            <p className="font-bold">${total}</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Envio</p>
            <p>${order.deliveryFee}</p>
          </div>
          <div className="flex justify-between space-y-1 border-b border-gray-200 text-gray-600">
            <p>Discount</p>
            <p>${order.discount}</p>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <p>Total</p>
            <p className="text-[var(--color-primary-dark)]">${finalTotal}</p>
          </div>
        </div>
      </section>
      {/*NOTAS*/}
      <section className="bg-white/80 py-3 px-4 rounded-xl mt-3">
        <p className="font-bold">Notas</p>
        <p>{order.note}</p>
      </section>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          text={getButtonText()}
          type="button"
          onClick={() => {
            const next = getNextStatus();
            if (next) handleChangeStatus(order.id, next);
          }}
          fontSize="text-lg"
        />
        {order.status === "PENDING" && (
          <LinkComponent
            href={whatsappConfirmLink}
            className="rounded-xl"
            bgColor="bg-none"
          >
            <Button
              text="Confirmar por WhatsApp"
              type="button"
              fontSize="text-lg"
              bgColor="bg-green-600"
            />
          </LinkComponent>
        )}
        {order.status === "PREPARING" && (
          <LinkComponent href={whatsappReadyLink} target="_blank" bgColor="bg-none">
            <Button
              text="Avisar listo por WhatsApp"
              type="button"
              fontSize="text-lg"
              bgColor="bg-green-600"
            />
          </LinkComponent>
        )}
        {order.status !== "CANCELLED" && (
          <Button
            text="Cancelar"
            type="button"
            onClick={() => handleChangeStatus(order.id, "CANCELLED")}
            bgColor="bg-gray-300"
            textColor="text-gray-900"
            fontSize="text-lg"
          />
        )}
      </div>
    </div>
  );
};

export default Order;
