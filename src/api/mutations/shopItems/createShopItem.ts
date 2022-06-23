import Router from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { useCurrentUserId } from "#/contexts/auth";
import { useFormState } from "#/templates/AddContent/FormContext";
import { Api } from "../..";
import { resetShopItemFeeds } from "./utilities";

export const useCreateShopItem = () => {
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();
  const formState = useFormState();

  return useMutation(
    async () => {
      return await Api.createShopItem(
        formState.mediaFiles.map((media) => media.file),
        formState.caption,
        JSON.stringify(formState.hashTags),
        formState.title,
        formState.price.toString(),
        formState.publicationDate?.valueOf().toString() || Date.now().toString(),
        JSON.stringify(formState.collaboratorUsers.map((user) => user.userId)),
        formState.expirationDate?.valueOf().toString(),
      );
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          resetShopItemFeeds({
            queryClient,
            authorUserId: userId,
          });
          Router.push("/feed");
        }
      },
    },
  );
};
