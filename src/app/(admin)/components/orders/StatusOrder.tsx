type StatusOrderProps = {
  status: "PENDING" | "PREPARING" | "READY" | "SHIPPED" | "CANCELLED" | "PICKEDUP" ;
};

const StatusOrder = ({ status }: StatusOrderProps) => {
  const statusOrder:Record<StatusOrderProps["status"], string> = {
    PENDING: "Pendiente",
    PREPARING: "En preparación",
    READY: "Listo",
    PICKEDUP: "Retirado",
    SHIPPED: "Enviado",
    CANCELLED: "Cancelado"
  }
  const statusColor = {
  PENDING: "bg-yellow-300/70 text-yellow-800",
  PREPARING: "bg-blue-300/70 text-blue-800",
  READY: "bg-green-300/70 text-green-800",
  PICKEDUP: "bg-gray-300/70 text-gray-800",
  SHIPPED: "bg-purple-300/70 text-purple-800",
  CANCELLED: "bg-red-300/70 text-red-800"
};
  return <p className={`px-3 text-sm py-1 rounded-sm font-semibold truncate ${statusColor[status]}`}>{statusOrder[status]}</p>;
};

export default StatusOrder;
