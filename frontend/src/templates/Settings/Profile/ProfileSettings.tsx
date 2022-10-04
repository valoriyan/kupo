import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useId } from "@radix-ui/react-id";
import { Grid, Stack } from "#/components/Layout";
import { Body, MainTitle } from "#/components/Typography";
import { Input } from "#/components/Input";
import { TextArea } from "#/components/TextArea";
import { Avatar } from "#/components/Avatar";
import { styled } from "#/styling";
import { PenIcon } from "#/components/Icons";
import { HiddenInput } from "#/components/HiddenInput";

export interface ProfileSettingsProps {
  profilePictureUrl: string | undefined;
  setProfilePictureUrl: (newValue: string | undefined) => void;
  setProfilePictureFile: Dispatch<SetStateAction<File | undefined>>;
  backgroundImageUrl: string | undefined;
  setBackgroundImageUrl: (newValue: string | undefined) => void;
  setBackgroundImageFile: Dispatch<SetStateAction<File | undefined>>;
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

  const onChange = (e: ChangeEvent<HTMLInputElement>, type: "pfp" | "bg") => {
    const { files } = e.currentTarget;
    if (!files?.length) return;

    for (const file of files) {
      const src = URL.createObjectURL(file);
      if (type === "pfp") {
        props.setProfilePictureUrl(src);
        props.setProfilePictureFile(file);
      } else if (type === "bg") {
        props.setBackgroundImageUrl(src);
        props.setBackgroundImageFile(file);
      }
    }
  };

  const input = (type: "pfp" | "bg") => (
    <HiddenInput
      type="file"
      accept="image/png, image/jpeg4"
      multiple
      onChange={(e) => onChange(e, type)}
    />
  );

  return (
    <Stack css={{ gap: "$6", p: "$6" }}>
      <MainTitle as="h2">Your Profile</MainTitle>
      <Grid
        css={{
          gridTemplateColumns: "auto minmax(0, 1fr)",
          columnGap: "$6",
        }}
      >
        <Stack css={{ alignItems: "center", gap: "$4" }}>
          <Body>Profile Picture</Body>
          <EditMedia>
            <Darken>
              <Avatar
                src={props.profilePictureUrl}
                alt="Current Profile Picture"
                size="$11"
              />
            </Darken>
            <EditIcon />
            {input("pfp")}
          </EditMedia>
        </Stack>
        <Stack css={{ alignItems: "center", gap: "$3" }}>
          <Body css={{ alignSelf: "start" }}>Background Image</Body>
          <EditMedia>
            <Darken css={{ size: "100%" }}>
              <BackgroundImage src={props.backgroundImageUrl} />
            </Darken>
            <EditIcon />
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
        <label htmlFor={usernameId}>Username</label>
        <Input
          id={usernameId}
          value={props.username}
          onChange={(e) => props.setUsername(e.currentTarget.value.toLocaleLowerCase())}
        />
        <label htmlFor={bioId}>Profile Bio</label>
        <TextArea
          id={bioId}
          rows={3}
          value={props.bio || ""}
          onChange={(e) => props.setBio(e.currentTarget.value)}
        />
        <label htmlFor={websiteId}>Website</label>
        <Input
          id={websiteId}
          value={props.website || ""}
          onChange={(e) => props.setWebsite(e.currentTarget.value)}
        />
      </Grid>
    </Stack>
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

const Darken = styled("div", {
  filter: "brightness(0.9)",
});

const EditIcon = styled(PenIcon, {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});
