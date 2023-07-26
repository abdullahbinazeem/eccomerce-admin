import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { formatter } from "@/lib/utils";
import { GalleryClient } from "./components/client";

const ShippingsPage = async ({ params }: { params: { storeId: string } }) => {
  const gallery = await prismadb.gallery.findFirst({
    where: {
      storeId: params.storeId,
    },
    include: {
      images: true,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <GalleryClient data={gallery} images={gallery?.images} />
      </div>
    </div>
  );
};

export default ShippingsPage;
