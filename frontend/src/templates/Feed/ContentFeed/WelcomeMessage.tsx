import Link from "next/link";
import { FadeInOut } from "#/components/Animations/FadeInOut";
import { Button } from "#/components/Button";
import { Stack } from "#/components/Layout";
import { MainTitle, Body } from "#/components/Typography";
import { styled } from "#/styling";

export const WelcomeMessage = () => {
  return (
    <Wrapper>
      <Content>
        <MainTitle css={{ textAlign: "center" }}>Welcome to Kupo!</MainTitle>
        <Body css={{ color: "$secondaryText", textAlign: "center", mb: "$4" }}>
          Find communities and users to follow to populate your following feed.
        </Body>
        <Link href="/discover" passHref>
          <Button as="a" round>
            Let&apos;s go!
          </Button>
        </Link>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled(FadeInOut, {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const Content = styled(Stack, {
  gap: "$4",
  p: "$7",
  maxWidth: "350px",
  alignItems: "center",
});
