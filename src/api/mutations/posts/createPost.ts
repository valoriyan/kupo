import Router from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { useCurrentUserId } from "#/contexts/auth";
import { useFormState } from "#/templates/AddContent/FormContext";
import { Api } from "../..";
import { resetPostFeeds } from "./utilities";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();
  const formState = useFormState();

  return useMutation(
    async () => {
      return await Api.createPost(
        formState.mediaFiles.map((media) => media.file),
        formState.caption,
        JSON.stringify(formState.hashTags),
        formState.publicationDate?.valueOf().toString(),
        formState.expirationDate?.valueOf().toString(),
      );
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          resetPostFeeds({
            queryClient,
            authorUserId: userId,
          });
          Router.push("/feed");
        }
      },
    },
  );
};
