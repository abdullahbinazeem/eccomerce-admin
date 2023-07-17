"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type SizeColumn = {
  id: string;
  order: number | null;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "order",
    header: ({ column }) => {
      /* eslint-disable */
      const [sorted, setSorted] = useState(false);
      useEffect(() => {
        column.toggleSorting(column.getIsSorted() === "asc");
      }, []);
      /* eslint-enable */

      return (
        <Button
          className="text-center"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
            setSorted(!sorted);
          }}
        >
          Order (
          <span className="text-xs">
            {sorted ? "top to bottom" : "bottom to top"}
          </span>
          )
          <ArrowUpDown className="ml-2 h-4 w-4 " />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4">
        #<span className="text-md font-bold">{row.original.order}</span>
      </div>
    ),
  },
  {
    accessorKey: "value",
    header: "Value",
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
