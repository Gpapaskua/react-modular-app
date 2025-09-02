import { useCallback, useMemo } from "react";
import { columns } from "./columns";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import type { IParameter } from "./types";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

interface IParamsTable {
  groupId: string;
  data: IParameter[];
  onUpdateParam: (params: {
    groupId: string;
    parameter: unknown;
    columnId: string;
    columnValue: unknown;
  }) => void;
  onAddNewParam: (groupId: string) => void;
}

export default function ParamsTable({
  groupId,
  data,
  onUpdateParam,
  onAddNewParam,
}: IParamsTable) {
  const options = useMemo(
    () => ({
      meta: {
        updateParamValue: (
          parameter: unknown,
          columnId: string,
          columnValue: unknown
        ) =>
          onUpdateParam({
            groupId,
            parameter,
            columnId,
            columnValue,
          }),
      },
    }),
    [onUpdateParam, groupId]
  );
  const renderFooter = useCallback(
    () => (
      <TableFooter>
        <TableRow>
          <TableCell colSpan={columns.length}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Additional Effluent Parameters
              </span>
              <Button
                variant='outline'
                onClick={() => onAddNewParam(groupId)}
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    ),
    [onAddNewParam, groupId]
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
