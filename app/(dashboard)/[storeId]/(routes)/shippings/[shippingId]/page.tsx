import prismadb from "@/lib/prismadb";
import { ShippingForm } from "./components/shipping-form";

const ShippingPage = async ({ params }: { params: { shippingId: string } }) => {
  const shipping = await prismadb.shipping.findUnique({
    where: {
      id: params.shippingId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ShippingForm initialData={shipping} />
      </div>
    </div>
  );
};

export default ShippingPage;
