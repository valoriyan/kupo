import { useMutation, useQueryClient } from "react-query";
import { Api, RenderablePublishingChannel } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useUpdateCommunityPage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      id,
      name,
      description,
      rulesList,
      linksList,
    }: {
      id: string;
      name: string;
      description: string;
      rulesList?: string[];
      linksList?: string[];
    }) => {
      return await Api.updatePublishingChannel({
        publishingChannelId: id,
        publishingChannelName: name,
        publishingChannelDescription: description,
        updatedPublishingChannelRules: rulesList,
        updatedExternalUrls: linksList,
      });
    },
    {
      onSuccess: (data, variables) => {
        if (!!data.data.success) {
          const cacheKey = [CacheKeys.CommunityByName];
          const cachedData: RenderablePublishingChannel | undefined =
            queryClient.getQueryData(cacheKey);

          if (cachedData) {
            queryClient.setQueryData<RenderablePublishingChannel>(cacheKey, {
              ...cachedData,
              name: variables.name,
              description: variables.description,
              publishingChannelRules: variables.rulesList ?? [],
              externalUrls: variables.linksList ?? [],
            });
          }
        }
      },
    },
  );
};
