import Order from "../../../components/Order";
import { fetchOrderById } from "@/src/app/services/orders.service";

type PageProps = {
  params: Promise<{id:string}>
};

const OrderDetails = async ({ params }: PageProps) => {
  const {id} = await params;
  const order = await fetchOrderById(id)
  
  return (
    <section className="px-2">
      
      <Order order={order} />
    </section>
  );
};

export default OrderDetails;
