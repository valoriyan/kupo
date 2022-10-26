import { useState } from "react";
import { useCreateCommunityPage } from "#/api/mutations/community/createCommunityPage";
import { NewCommunityForm } from "./NewCommunityForm";

export const NewCommunityPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [pfpUrl, setPfpUrl] = useState<string>();
  const [pfpFile, setPfpFile] = useState<File>();

  const [backgroundImgUrl, setBackgroundImgUrl] = useState<string>();
  const [backgroundImgFile, setBackgroundImgFile] = useState<File>();

  const [rulesList, setRulesList] = useState<string[]>([]);
  const [linksList, setLinksList] = useState<string[]>([]);

  const { mutateAsync: createCommunityPage, isLoading } = useCreateCommunityPage();
  const canSubmit = !!name;

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
      submitLabel="Create Now"
      isSubmitDisabled={!canSubmit || isLoading}
      onSubmit={() =>
        createCommunityPage({
          publishingChannelName: name,
          publishingChannelDescription: description,
          profilePicture: pfpFile,
          backgroundImage: backgroundImgFile,
          externalUrl1: linksList[0],
          externalUrl2: linksList[1],
          externalUrl3: linksList[2],
          externalUrl4: linksList[3],
          externalUrl5: linksList[4],
          publishingChannelRule1: rulesList[0],
          publishingChannelRule2: rulesList[1],
          publishingChannelRule3: rulesList[2],
          publishingChannelRule4: rulesList[3],
          publishingChannelRule5: rulesList[4],
        })
      }
      isSubmitting={isLoading}
    />
  );
};
