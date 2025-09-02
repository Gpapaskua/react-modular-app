import { useCallback, useMemo } from "react";
import { columns } from "./columns";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import type { IParameter } from "./types";
import DataTable from "@/components/ui/data-table";

interface IParamsTable {
  data: IParameter[];
  onUpdateParam: (rowValue: unknown, columnId: string, value: unknown) => void;
  onAddNewParam: () => void;
}

export default function ParamsTable({
  data,
  onUpdateParam,
  onAddNewParam,
}: IParamsTable) {
  const options = useMemo(
    () => ({
      meta: {
        updateParamValue: onUpdateParam,
      },
    }),
    [onUpdateParam]
  );
  console.log({ data })
  const renderFooter = useCallback(
    () => (
      <TableFooter>
        <TableRow>
          <TableCell colSpan={columns.length}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Additional Effluent Parameters
              </span>
              <button
                onClick={onAddNewParam}
                className="flex cursor-pointer items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors rounded-md p-2 -m-2"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    ),
    [onAddNewParam]
  );
  return (
    <div className="p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg border bg-white shadow-sm">
          <DataTable
            data={data}
            // @ts-expect-error issue with columns typing
            columns={columns}
            options={options}
            renderFooter={renderFooter}
          />
        </div>
      </div>
    </div>
  );
}
