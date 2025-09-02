import { useMutation } from "@tanstack/react-query";
import { updateChemistryGroup } from "./api";

const useUpdateChemistryGroup = () =>
  useMutation({
    mutationFn: updateChemistryGroup,
  });

export default useUpdateChemistryGroup;
