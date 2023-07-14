import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ShippingClient } from "./components/client";
import { ShippingColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ShippingsPage = async ({ params }: { params: { storeId: string } }) => {
  const shippings = await prismadb.shipping.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedShippings: ShippingColumn[] = shippings.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price.toNumber()),
    weight: item.width?.toNumber(),
    length: item.length?.toNumber(),
    height: item.height?.toNumber(),
    width: item.width?.toNumber(),
    isFixed: item.isFixed,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ShippingClient data={formattedShippings} />
      </div>
    </div>
  );
};

export default ShippingsPage;
