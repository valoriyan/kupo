import { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { RenderablePublishingChannel } from "#/api";
import { useUpdateCommunityBackgroundImage } from "#/api/mutations/community/updateCommunityBackgroundImage";
import { useUpdateCommunityProfilePicture } from "#/api/mutations/community/updateCommunityProfilePicture";
import { useUpdateCommunityPage } from "#/api/mutations/community/updatedCommunityPage";
import { CacheKeys } from "#/contexts/queryClient";
import { NewCommunityForm } from "#/templates/AddContent/NewCommunityPage/NewCommunityForm";
import { goToCommunityPage } from "#/templates/CommunityPage";
import { isSuccessfulStatus } from "#/utils/isSuccessfulStatus";
import { useFormField } from "#/utils/useFormField";

export interface CommunityProps {
  community: RenderablePublishingChannel;
}

export const Community = ({ community }: CommunityProps) => {
  const queryClient = useQueryClient();

  const [name, setName, isNameTouched, setIsNameTouched] = useFormField(community.name);
  const [description, setDescription, isDescriptionTouched, setIsDescriptionTouched] =
    useFormField(community.description ?? "");
  const [pfpUrl, setPfpUrl, isPfpUrlTouched, setIsPfpUrlTouched] = useFormField(
    community.profilePictureTemporaryUrl,
  );
  const [
    backgroundImgUrl,
    setBackgroundImgUrl,
    isBackgroundImgUrlTouched,
    setIsBackgroundImgUrlTouched,
  ] = useFormField(community.backgroundImageTemporaryUrl);
  const [rulesList, setRulesList, isRulesListTouched, setIsRulesListTouched] =
    useFormField(community.publishingChannelRules ?? []);
  const [linksList, setLinksList, isLinksListTouched, setIsLinksListTouched] =
    useFormField(community.externalUrls ?? []);

  const [pfpFile, setPfpFile] = useState<File>();
  const [backgroundImgFile, setBackgroundImgFile] = useState<File>();

  const [isCommunityUpdating, setIsCommunityUpdating] = useState(false);

  const isAnyTouched =
    isNameTouched ||
    isDescriptionTouched ||
    isPfpUrlTouched ||
    isBackgroundImgUrlTouched ||
    isRulesListTouched ||
    isLinksListTouched;

  const { mutateAsync: updateCommunityProfilePicture } =
    useUpdateCommunityProfilePicture();
  const { mutateAsync: updateCommunityBackgroundImage } =
    useUpdateCommunityBackgroundImage();
  const { mutateAsync: updateCommunity } = useUpdateCommunityPage();

  const saveCommunitySettings = async () => {
    setIsCommunityUpdating(true);
    const promises = [];

    if (isPfpUrlTouched && pfpFile) {
      promises.push(
        updateCommunityProfilePicture({
          id: community.publishingChannelId,
          file: pfpFile,
        }),
      );
    }
    if (isBackgroundImgUrlTouched && backgroundImgFile) {
      promises.push(
        updateCommunityBackgroundImage({
          id: community.publishingChannelId,
          file: backgroundImgFile,
        }),
      );
    }
    if (
      isNameTouched ||
      isDescriptionTouched ||
      isRulesListTouched ||
      isLinksListTouched
    ) {
      promises.push(
        updateCommunity({
          id: community.publishingChannelId,
          name,
          description,
          rulesList,
          linksList,
        }),
      );
    }

    try {
      const result = await Promise.all(promises);
      const success = result.every((res) => isSuccessfulStatus(res.status));

      if (success) {
        setIsNameTouched(false);
        setIsDescriptionTouched(false);
        setIsPfpUrlTouched(false);
        setIsBackgroundImgUrlTouched(false);
        setIsRulesListTouched(false);
        setIsLinksListTouched(false);
        queryClient.removeQueries([CacheKeys.CommunityByName, community.name]);
        toast.success("Community updated successfully");
        goToCommunityPage(community.name);
      } else {
        setIsCommunityUpdating(false);
        toast.error("Failed to update community");
      }
    } catch {
      setIsCommunityUpdating(false);
      toast.error("Failed to update community");
    }
  };

  return (
    <NewCommunityForm
      name={name}
      setName={setName}
      description={description}
      setDescription={setDescription}
      pfpUrl={pfpUrl}
      setPfpUrl={setPfpUrl}
      setPfpFile={setPfpFile}
      backgroundImgUrl={backgroundImgUrl}
      setBackgroundImgUrl={setBackgroundImgUrl}
      setBackgroundImgFile={setBackgroundImgFile}
      rulesList={rulesList}
      setRulesList={setRulesList}
      linksList={linksList}
      setLinksList={setLinksList}
      submitLabel="Save Settings"
      isSubmitDisabled={!isAnyTouched || isCommunityUpdating}
      onSubmit={saveCommunitySettings}
      isSubmitting={isCommunityUpdating}
    />
  );
};