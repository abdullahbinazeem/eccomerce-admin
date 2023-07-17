"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Size } from "@prisma/client";
import { useEffect, useState } from "react";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  size: Size;
  category: string;
  color: string;
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
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
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
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-2">
        <p className="text-md font-medium">{row.original.size.name} </p>
        <p className="text-xs truncate font-light max-w-[200px] text-neutral-500">
          ({row.original.size.value})
        </p>
      </div>
    ),
  },
  {
    accessorKey: "shipping",
    header: "Shipping",
    cell: ({ row }) => (
      <div className="max-w-[200px]">{row.original.shipping}</div>
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2 text-xs">
        {row.original.color}
        <div
          className="h-4 w-4 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      /* eslint-disable */
      const header = () => {
        useEffect(() => {
          column.toggleSorting(column.getIsSorted() === "desc");
        }, []);
        /* eslint-enable */

        return <p>Date</p>;
      };
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
