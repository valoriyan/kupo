import { useId } from "@radix-ui/react-id";
import { ProfilePrivacySetting } from "#/api";
import { Grid, Stack } from "#/components/Layout";
import { MainTitle } from "#/components/Typography";
import { Toggle } from "#/components/Toggle";

export interface PrivacySettingsProps {
  privacySetting: ProfilePrivacySetting;
  setPrivacySetting: (newValue: ProfilePrivacySetting) => void;
}

export const PrivacySettings = (props: PrivacySettingsProps) => {
  const privacySettingId = useId();

  return (
    <Stack css={{ gap: "$6", p: "$6" }}>
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
        <label htmlFor={privacySettingId}>Public Profile</label>
        <Toggle
          id={privacySettingId}
          toggled={props.privacySetting === ProfilePrivacySetting.Public}
          setToggled={(value) =>
            props.setPrivacySetting(
              value ? ProfilePrivacySetting.Public : ProfilePrivacySetting.Private,
            )
          }
        />
      </Grid>
    </Stack>
  );
};
