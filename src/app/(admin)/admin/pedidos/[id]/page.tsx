import { getOrderById } from "@/src/lib/orders";
import Order from "../../../components/orders/Order";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

const OrderDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const order = await getOrderById(Number(id));

  return (
    <section className="px-2 mb-4">
      <Order order={order} />
    </section>
  );
};

export const page = ({ params }: PageProps) => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderDetails params={params} />
    </Suspense>
  );
};

export default page;
