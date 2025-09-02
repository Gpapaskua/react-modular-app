import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogTitle, type DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PARAMETER_OPTIONS } from "@/lib/constants";
import { addNewParamToGroup } from "./api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface Props extends DialogProps {
  groupId: string;
  onClose: () => void;
}

const AddParameterDialog = ({ onClose, groupId, ...rest }: Props) => {
  const client = useQueryClient();
  const { mutate: addNewParam, isPending } = useMutation({
    mutationFn: addNewParamToGroup,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["useChemistryData"],
      });
      onClose();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message ?? "Something went wrong");
      }
    },
  });
  const form = useForm<{ param: string }>({
    defaultValues: {
      param: "",
    },
    resolver: zodResolver(
      z.object({
        param: z.string().trim().min(1, 'Parameter is required'),
      })
    ),
  });

  const onSave = ({ param }: { param: string }) => {
    console.log('SUBMITED')
    addNewParam({
      groupId,
      paramId: param,
    });
  };

  return (
    <Dialog onOpenChange={onClose} {...rest}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Parameter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
            <FormField
              control={form.control}
              name="param"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parameter</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a parameter" />
                      </SelectTrigger>
                      <SelectContent>
                        {PARAMETER_OPTIONS.map((group) => (
                          <SelectGroup key={group.label}>
                            <SelectLabel>{group.label}</SelectLabel>
                            {group.options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                className="bg-gray-800 text-white hover:bg-gray-700 px-4 py-2"
                disabled={isPending}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddParameterDialog;
