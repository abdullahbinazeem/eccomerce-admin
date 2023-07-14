"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ShippingColumn = {
  id: string;
  name: string;
  price: string;
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
  isFixed: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ShippingColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isFixed",
    header: "Fixed Rates",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div>
        {row.original.isFixed ? (
          <div>{row.original.price}</div>
        ) : (
          <div>Calculated at Checkout</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "width",
    header: "Dimensions (L x W x H)",
    cell: ({ row }) => (
      <div>
        {row.original.isFixed ? (
          <div></div>
        ) : (
          <div className="flex gap-x-2 items-center">
            {row.original.length}" x {row.original.width}" x{" "}
            {row.original.height}"
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "weight",
    header: "Weight",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Edit",
  },
];
