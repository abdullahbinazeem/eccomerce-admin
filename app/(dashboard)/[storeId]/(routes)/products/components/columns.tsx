"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { useEffect, useState } from "react";
import { Color } from "@prisma/client";
import { cn } from "@/lib/utils";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  size: string;
  colors: Color[];
  category: string;
  shipping: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
  description?: string | null;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate ">{row.original.description}</div>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-2 flex-wrap grow-0 max-w-[100px]">
          <p
            className={cn(
              "text-xs p-2  font-semibold rounded-xl text-center grow-0",
              row.original.isFeatured ? "bg-green-200" : "bg-red-300"
            )}
          >
            {row.original.isFeatured ? "Featured" : "Not Featured"}
          </p>
          <p
            className={cn(
              "text-xs p-2  font-semibold  rounded-xl bg-neutral-500 text-center grow-0",
              !row.original.isArchived ? "bg-green-200" : "bg-red-300"
            )}
          >
            {row.original.isArchived ? "Archived" : "Showing"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },

  {
    accessorKey: "colors",
    header: "Colors",
    cell: ({ row }) => {
      return (
        <div className="flex gap-x-1 flex-wrap">
          {row.original.colors.map((color) => (
            <div
              key={color.id}
              className="h-5 w-5  rounded-full border"
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "shipping",
    header: "Shipping",
    cell: ({ row }) => {
      console.log(row.original.colors);

      return <div className="max-w-[200px]">{row.original.shipping}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      /* eslint-disable */
      useEffect(() => {
        column.toggleSorting(column.getIsSorted() === "desc");
      }, []);
      /* eslint-enable */

      return <p>Date</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
