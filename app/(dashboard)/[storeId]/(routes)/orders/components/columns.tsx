"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Delete, Trash, X } from "lucide-react";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => {
      return (
        <div className="flex item-center">
          <Button
            className="text-center"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Is Paid
            <ArrowUpDown className="ml-2 h-4 w-4 " />
          </Button>
          <Button
            className="text-center"
            variant="ghost"
            onClick={() => column.clearSorting()}
          >
            <Trash size={20} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div
        className={cn(
          "py-2 text-center rounded-lg",
          row.original.isPaid ? "bg-green-200" : "bg-red-200"
        )}
      >
        <p className="text-md font-bold">
          {row.original.isPaid ? "True" : "False"}
        </p>
      </div>
    ),
  },
];
