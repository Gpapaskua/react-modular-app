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
import { Textarea } from "@/components/ui/textarea";
import { DialogTitle, type DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useUpdateChemistryGroup from "./useUpdateChemistryGroup";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props extends DialogProps {
  description: string;
  onClose: () => void;
  groupId: string;
}

const EditDescriptionDialog = ({
  groupId,
  onClose,
  description: initialDescription,
  ...rest
}: Props) => {
  const client = useQueryClient();
  const { mutate: updateGroup, isPending } = useUpdateChemistryGroup();

  const form = useForm<{ description: string }>({
    defaultValues: {
      description: initialDescription,
    },
    resolver: zodResolver(
      z.object({
        description: z.string().trim().min(1, "Description is required"),
      })
    ),
  });

  const onSave = ({ description }: { description: string }) => {
    updateGroup(
      {
        groupId,
        payload: {
          description,
        },
      },
      {
        onSuccess() {
          toast("Description has been updated");
          client.refetchQueries({ queryKey: ["useChemistryData"] });
          onClose();
        },
      }
    );
  };

  return (
    <Dialog onOpenChange={onClose} {...rest}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Description</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type description" {...field} />
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDescriptionDialog;
