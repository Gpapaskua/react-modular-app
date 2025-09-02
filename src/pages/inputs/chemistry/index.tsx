import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useCallback, useState } from "react";
import ParamsTable from "./params-table";
import EditDescriptionDialog from "./edit-description-dialog";
import EditNameDialog from "./edit-name-dialog";
import type { IGroup, IParameter } from "./types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getChemistryData, updateGroupParam } from "./api";
import AddParameterDialog from "./add-parameter-dialog";
import { useSidebar } from "@/components/ui/sidebar";

interface IGroupToEdit {
  type: "name" | "description" | "new-param";
  group: IGroup;
}
export default function ChemistryPage() {
  const [groupToEdit, setGroupToEdit] = useState<IGroupToEdit | null>(null);
  const { toggleSidebar } = useSidebar();

  const client = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["useChemistryData"],
    queryFn: getChemistryData,
  });

  const { mutate: updateParam } = useMutation({
    mutationFn: updateGroupParam,
    onSuccess: () => {
      client.refetchQueries({
        queryKey: ["useChemistryData"],
      });
    },
  });

  const handleOpenNewParamDialog = useCallback(
    (group: IGroup) => () => {
      setGroupToEdit({ group, type: "new-param" });
    },
    []
  );

  const handleUpdateParamValue = useCallback(
    (groupId: string) =>
      (column: unknown, paramKey: string, value: unknown) => {
        updateParam({
          groupId,
          paramId: (column as IParameter).id,
          payload: {
            [paramKey]: value,
          },
        });
      },
    [updateParam]
  );

  return (
    <>
      <div className="flex sm:hidden">
        <Button onClick={toggleSidebar}>Units</Button>
      </div>
      <Accordion type="multiple" className="w-full space-y-4">
        {data.map((group) => (
          <AccordionItem
            value={group.id}
            key={group.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <AccordionTrigger className="p-4 hover:no-underline">
              <div className="flex-grow text-left space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-base text-gray-900">
                    {group.name}
                  </h2>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGroupToEdit({
                        type: "name",
                        group,
                      });
                    }}
                    variant="secondary"
                    className="h-7 w-7 cursor-pointer text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    aria-label={`Edit ${group.name}`}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500 italic font-normal">
                    {group.description}
                  </p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGroupToEdit({
                        type: "description",
                        group,
                      });
                    }}
                    variant="secondary"
                    className="h-7 w-7 cursor-pointer text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    aria-label={`Edit description for ${group.name}`}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="border-t border-gray-200 pt-4">
                <ParamsTable
                  data={group.parameters}
                  onAddNewParam={handleOpenNewParamDialog(group)}
                  onUpdateParam={handleUpdateParamValue(group.id)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {!!groupToEdit && (
        <>
          <EditDescriptionDialog
            open={groupToEdit?.type === "description"}
            description={groupToEdit?.group?.description ?? ""}
            groupId={groupToEdit.group.id}
            onClose={() => setGroupToEdit(null)}
          />
          <EditNameDialog
            open={groupToEdit?.type === "name"}
            name={groupToEdit?.group?.name ?? ""}
            groupId={groupToEdit.group.id}
            onClose={() => setGroupToEdit(null)}
          />
          <AddParameterDialog
            onClose={() => setGroupToEdit(null)}
            open={groupToEdit?.type === "new-param"}
            groupId={groupToEdit.group.id}
          />
        </>
      )}
    </>
  );
}
