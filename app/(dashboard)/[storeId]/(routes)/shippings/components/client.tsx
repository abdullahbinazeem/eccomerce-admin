"use client";

import { ShippingColumn, columns } from "./columns";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ShippingClientProps {
  data: ShippingColumn[];
}

export const ShippingClient: React.FC<ShippingClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Shippings (${data.length})`}
          description="Manage shippings for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/shippings/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <p className="pb-10">
        Need help ?{" "}
        <a
          className="cursor-pointer text-blue-600 underline"
          href="https://www.youtube.com/watch?v=dwjJ5W_M5KE&list=PL8vgCIQkRxLzJnYIxWPNFkxVHlfVpuhlo&index=4"
          target="_blank"
        >
          Get help with this video tutorial
        </a>
      </p>
      <Heading title="API" description="API calls for shippings" />
      <Separator />
      <ApiList entityName="shippings" entityIdName="sizeId" />
    </>
  );
};
