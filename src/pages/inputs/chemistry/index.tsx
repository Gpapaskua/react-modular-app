import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useCallback, useReducer } from "react";
import ParamsTable from "./params-table";
import EditDescriptionDialog from "./edit-description-dialog";
import EditNameDialog from "./edit-name-dialog";
import type { IParameter } from "./types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getChemistryData, updateGroupParam } from "./api";
import AddParameterDialog from "./add-parameter-dialog";
import { useSidebar } from "@/components/ui/sidebar";
import { initialState, reducer } from "./reducer";

export default function ChemistryPage() {
  const [modalState, dispatch] = useReducer(reducer, initialState);
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

  const handleOpenNewParamDialog = useCallback((groupId: string) => {
    dispatch({ type: "OPEN_ADD_PARAMETER_MODAL", groupId });
  }, []);

  const handleUpdateParamValue = useCallback(
    ({
      groupId,
      parameter,
      columnId,
      columnValue,
    }: {
      groupId: string;
      parameter: unknown;
      columnId: string;
      columnValue: unknown;
    }) => {
      updateParam({
        groupId,
        paramId: (parameter as IParameter).id,
        payload: {
          [columnId]: columnValue,
        },
      });
    },
    [updateParam]
  );

  return (
    <>
      <div className="flex md:hidden">
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
                      dispatch({
                        type: "OPEN_EDIT_NAME_MODAL",
                        groupId: group.id,
                        name: group.name,
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
                      dispatch({
                        type: "OPEN_EDIT_DESCRIPTION_MODAL",
                        groupId: group.id,
                        description: group.description,
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
                  groupId={group.id}
                  data={group.parameters}
                  onAddNewParam={handleOpenNewParamDialog}
                  onUpdateParam={handleUpdateParamValue}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <EditDescriptionDialog
        key={`description-${modalState.editDescriptionModal.groupId}`}
        open={modalState.editDescriptionModal.isOpen}
        description={modalState.editDescriptionModal.description}
        groupId={modalState.editDescriptionModal.groupId}
        onClose={() => dispatch({ type: "CLOSE_EDIT_DESCRIPTION_MODAL" })}
      />
      <EditNameDialog
        key={`name-${modalState.editNameModal.groupId}`}
        open={modalState.editNameModal.isOpen}
        name={modalState.editNameModal.name}
        groupId={modalState.editNameModal.groupId}
        onClose={() => dispatch({ type: "CLOSE_EDIT_NAME_MODAL" })}
      />
      <AddParameterDialog
        key={`param-${modalState.addParameterModal.groupId}`}
        onClose={() => dispatch({ type: "CLOSE_ADD_PARAMETER_MODAL" })}
        open={modalState.addParameterModal.isOpen}
        groupId={modalState.addParameterModal.groupId}
      />
    </>
  );
}
