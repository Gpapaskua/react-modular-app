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
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateChemistryGroup from "./useUpdateChemistryGroup";
import { toast } from "sonner";

interface Props extends DialogProps {
  name: string;
  groupId: string;
  onClose: () => void;
}

export default function EditNameDialog({
  name: initialName,
  groupId,
  onClose,
  ...rest
}: Props) {
  const client = useQueryClient();
  const { mutate: updateGroup, isPending } = useUpdateChemistryGroup();

  const form = useForm<{ name: string }>({
    defaultValues: {
      name: initialName,
    },
    resolver: zodResolver(
      z.object({
        name: z.string().trim().min(1, 'Name is required'),
      })
    ),
  });

  const onSave = ({ name }: { name: string }) => {
    updateGroup(
      {
        groupId,
        payload: {
          name,
        },
      },
      {
        onSuccess() {
          toast("Name has been changed");
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type name" {...field} />
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
}
