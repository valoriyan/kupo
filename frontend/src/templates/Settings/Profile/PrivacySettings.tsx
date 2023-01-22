import { useId } from "@radix-ui/react-id";
import { ProfilePrivacySetting } from "#/api";
import { Grid } from "#/components/Layout";
import { MainTitle } from "#/components/Typography";
import { Toggle } from "#/components/Toggle";
import { Label, SectionWrapper } from "./shared";

export interface PrivacySettingsProps {
  privacySetting: ProfilePrivacySetting;
  setPrivacySetting: (newValue: ProfilePrivacySetting) => void;
}

export const PrivacySettings = (props: PrivacySettingsProps) => {
  const privacySettingId = useId();

  return (
    <SectionWrapper>
      <MainTitle as="h2">Privacy</MainTitle>
      <Grid
        css={{
          gridTemplateColumns: "auto minmax(0, 1fr)",
          gridTemplateRows: "auto",
          columnGap: "$5",
          rowGap: "$5",
          alignItems: "center",
          "> input": { justifySelf: "end" },
        }}
      >
        <Label as="label" htmlFor={privacySettingId}>
          Public Profile
        </Label>
        <Toggle
          id={privacySettingId}
          toggled={props.privacySetting === ProfilePrivacySetting.Public}
          setToggled={(value) =>
            props.setPrivacySetting(
              value ? ProfilePrivacySetting.Public : ProfilePrivacySetting.Private,
            )
          }
          data-cy="profile-privacy-toggle"
        />
      </Grid>
    </SectionWrapper>
  );
};
