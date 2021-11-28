import { useMutation } from "react-query";
import Router from "next/router";
import { useFormState } from "#/templates/AddContent/FormContext";
import { Api } from "../..";

export const useCreatePost = () => {
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
          Router.push("/");
        }
      },
    },
  );
};
