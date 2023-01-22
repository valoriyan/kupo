import { useId } from "@radix-ui/react-id";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { FileDescriptor } from "#/api";
import { useUploadFile } from "#/api/mutations/fileUpload/uploadFile";
import { Avatar } from "#/components/Avatar";
import { HiddenInput } from "#/components/HiddenInput";
import { PenIcon } from "#/components/Icons";
import { Input } from "#/components/Input";
import { Box, Grid, Stack } from "#/components/Layout";
import { Spinner } from "#/components/Spinner";
import { TextArea } from "#/components/TextArea";
import { MainTitle } from "#/components/Typography";
import { css, styled } from "#/styling";
import { Label, SectionWrapper } from "./shared";

export interface ProfileSettingsProps {
  profilePictureUrl: string | undefined;
  setProfilePictureUrl: (newValue: string | undefined) => void;
  setProfilePictureFile: Dispatch<SetStateAction<FileDescriptor | undefined>>;
  backgroundImageUrl: string | undefined;
  setBackgroundImageUrl: (newValue: string | undefined) => void;
  setBackgroundImageFile: Dispatch<SetStateAction<FileDescriptor | undefined>>;
  username: string;
  setUsername: (newValue: string) => void;
  bio: string | undefined;
  setBio: (newValue: string | undefined) => void;
  website: string | undefined;
  setWebsite: (newValue: string | undefined) => void;
}

export const ProfileSettings = (props: ProfileSettingsProps) => {
  const usernameId = useId();
  const bioId = useId();
  const websiteId = useId();

  const { mutateAsync: uploadFile } = useUploadFile();
  const [isUploadingPfp, setIsUploadingPfp] = useState(false);
  const [isUploadingBackgroundImg, setIsUploadingBackgroundImg] = useState(false);

  const onChange = async (e: ChangeEvent<HTMLInputElement>, type: "pfp" | "bg") => {
    const { files } = e.currentTarget;
    if (!files?.length) return;

    for (const file of files) {
      const src = URL.createObjectURL(file);
      const mimeType = file.type;
      if (type === "pfp") {
        props.setProfilePictureUrl(src);
        setIsUploadingPfp(true);
        try {
          const { blobFileKey } = await uploadFile({ file, mimeType });
          props.setProfilePictureFile({ blobFileKey, mimeType });
          setIsUploadingPfp(false);
        } catch {
          props.setProfilePictureUrl("");
          setIsUploadingPfp(false);
        }
      } else if (type === "bg") {
        props.setBackgroundImageUrl(src);
        setIsUploadingBackgroundImg(true);
        try {
          const { blobFileKey } = await uploadFile({ file, mimeType });
          props.setBackgroundImageFile({ blobFileKey, mimeType });
          setIsUploadingBackgroundImg(false);
        } catch {
          props.setBackgroundImageUrl("");
          setIsUploadingBackgroundImg(false);
        }
      }
    }
  };

  const input = (type: "pfp" | "bg") => (
    <HiddenInput
      type="file"
      accept="image/png, image/jpeg"
      multiple
      onChange={(e) => onChange(e, type)}
    />
  );

  return (
    <SectionWrapper>
      <MainTitle as="h2">Your Profile</MainTitle>
      <Grid
        css={{
          gridTemplateColumns: "auto minmax(0, 1fr)",
          columnGap: "$6",
        }}
      >
        <Stack css={{ alignItems: "center", gap: "$4" }}>
          <Label>Profile Picture</Label>
          <EditMedia>
            <Box css={{ filter: `brightness(${isUploadingPfp ? 0.4 : 0.8})` }}>
              <Avatar
                src={props.profilePictureUrl}
                alt="Current Profile Picture"
                size="$11"
              />
            </Box>
            {isUploadingPfp ? <LoadingSpinner size="md" /> : <EditIcon />}
            {input("pfp")}
          </EditMedia>
        </Stack>
        <Stack css={{ alignItems: "center", gap: "$3" }}>
          <Label css={{ alignSelf: "start" }}>Background Image</Label>
          <EditMedia>
            <Box
              css={{
                size: "100%",
                filter: `brightness(${isUploadingBackgroundImg ? 0.4 : 0.8})`,
              }}
            >
              <BackgroundImage src={props.backgroundImageUrl} />
            </Box>
            {isUploadingBackgroundImg ? <LoadingSpinner size="md" /> : <EditIcon />}
            {input("bg")}
          </EditMedia>
        </Stack>
      </Grid>
      <Grid
        css={{
          gridTemplateColumns: "auto minmax(0, 1fr)",
          gridTemplateRows: "auto auto auto",
          columnGap: "$5",
          rowGap: "$5",
        }}
      >
        <Label as="label" htmlFor={usernameId}>
          Username
        </Label>
        <Input
          id={usernameId}
          value={props.username}
          onChange={(e) => props.setUsername(e.currentTarget.value.toLocaleLowerCase())}
        />
        <Label as="label" htmlFor={bioId}>
          Profile Bio
        </Label>
        <TextArea
          id={bioId}
          rows={3}
          value={props.bio || ""}
          onChange={(e) => props.setBio(e.currentTarget.value)}
        />
        <Label as="label" htmlFor={websiteId}>
          Website
        </Label>
        <Input
          id={websiteId}
          value={props.website || ""}
          onChange={(e) => props.setWebsite(e.currentTarget.value)}
        />
      </Grid>
    </SectionWrapper>
  );
};

const BackgroundImage = (props: { src?: string }) => {
  return props.src ? (
    <BgImg alt="Current Background Image" src={props.src} />
  ) : (
    <BgImgFallback role="img" aria-label="Current Background Image Fallback" />
  );
};

const BgImg = styled("img", {
  size: "100%",
  maxHeight: "$11",
  objectFit: "cover",
});

const BgImgFallback = styled("div", {
  size: "100%",
  maxHeight: "$11",
  bg: "$border",
});

const EditMedia = styled("label", {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  size: "100%",
  color: "$accentText",
  cursor: "pointer",
});

const centered = css({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

const EditIcon = styled(PenIcon, centered);

const LoadingSpinner = styled(Spinner, centered);
