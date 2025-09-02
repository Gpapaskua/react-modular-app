import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createColumnHelper } from "@tanstack/react-table";
import { useState, type KeyboardEvent } from "react";
import { determineAlarmStatus } from "./utils";
import type { IParameter } from "./types";

const columnHelper = createColumnHelper<IParameter>();

const EditableParameterInput = ({
  rawValue,
  onValueChange,
}: {
  rawValue: number;
  onValueChange: (val: number) => void;
}) => {
  const [displayValue, setDisplayValue] = useState(rawValue.toFixed(2));

  const handleBlur = () => {
    let numericValue = parseFloat(displayValue);
    if (isNaN(numericValue) || numericValue < 0) numericValue = 0;
    onValueChange(numericValue);
    setDisplayValue(numericValue.toFixed(2));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") event.currentTarget.blur();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Input
            type="number"
            value={displayValue}
            onChange={(e) => setDisplayValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="h-8 w-32"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Raw Value: {rawValue}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const columns = [
  columnHelper.accessor("name", {
    header: "Parameter",
    cell: (info) => <div className="font-medium">{info.getValue()}</div>,
  }),
  columnHelper.accessor("value", {
    header: () => <div className="">Value</div>,
    cell: ({ getValue, table, row, column }) => (
      <EditableParameterInput
        rawValue={getValue()}
        onValueChange={(val) =>
          table.options.meta?.updateParamValue(row.original, column.id, val)
        }
      />
    ),
  }),
  columnHelper.accessor("units", {
    header: "Units",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.display({
    id: "alarm",
    header: "Alarm",
    cell: () => {
      const { colorClass, status } = determineAlarmStatus();
      return <span className={`font-semibold ${colorClass}`}>{status}</span>;
    },
  }),
];
