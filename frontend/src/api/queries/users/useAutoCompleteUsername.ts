import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, AutoCompleteUsernameRequestBody, AutoCompleteUsernameSuccess } from "../..";

export const useAutoCompleteUsername = ({
  searchString,
  limit,
}: AutoCompleteUsernameRequestBody) => {
  return useQuery<AutoCompleteUsernameSuccess, Error>(
    [CacheKeys.AutoCompleteUsername, searchString, limit],
    async () => {
      const res = await Api.autoCompleteUsername({ searchString, limit });

      if (res.data.success) return res.data.success;
      throw new Error(
        (res.data.error.reason as string) ?? "Failed to find matching users",
      );
    },
    { enabled: !!searchString },
  );
};
