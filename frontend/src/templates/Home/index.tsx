import Link from "next/link";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { Avatar } from "#/components/Avatar";
import { BrandWithSlogan } from "#/components/BrandWithSlogan";
import { Button } from "#/components/Button";
import { Flex, Stack } from "#/components/Layout";
import { Body, Heading, MainTitle, Subtext } from "#/components/Typography";
import { MAX_APP_CONTENT_WIDTH } from "#/constants";
import { useIsAuthenticated } from "#/contexts/auth";
import { openLogOutModal } from "#/components/LogOutModal";

export const Home = () => {
  const isAuthenticatedState = useIsAuthenticated();
  const isAuthenticated = isAuthenticatedState === "unset" ? false : isAuthenticatedState;
  const { data: user } = useGetClientUserProfile(isAuthenticated);

  if (isAuthenticatedState === "unset") return null;

  return (
    <Stack css={{ alignItems: "center", minHeight: "100vh" }}>
      <Stack css={{ p: "$6", width: "100%", maxWidth: MAX_APP_CONTENT_WIDTH, gap: "$9" }}>
        <Heading css={{ alignSelf: "flex-end", button: { color: "$link" } }}>
          {isAuthenticated ? (
            <Flex
              as="button"
              onClick={() => openLogOutModal()}
              css={{ gap: "$3", alignItems: "center", height: "$6" }}
            >
              {user && (
                <Avatar
                  src={user.profilePictureTemporaryUrl}
                  alt="Your profile picture"
                  size="$6"
                />
              )}
              <Body>log out</Body>
            </Flex>
          ) : (
            <Link href="/login">log in</Link>
          )}
        </Heading>
        <BrandWithSlogan />
        <Stack css={{ gap: "$6" }}>
          <Body as="p">A social media platform made for creators by creators.</Body>
          <Body as="p">
            Leading social medias often threaten small and medium sized businesses by
            compromising information, or failing to help business owners reach their
            audience. We know the frustration and we&apos;re here to change it.
          </Body>
        </Stack>
        <Link href={isAuthenticated ? "/feed" : "/sign-up"} passHref>
          <Button as="a" size="lg">
            {isAuthenticated ? "View Your Feed" : "Create An Account"}
          </Button>
        </Link>
        <Stack css={{ gap: "$7" }}>
          <MainTitle css={{ textAlign: "center" }}>What we do differently</MainTitle>
          <Stack as="ul" css={{ gap: "$6", margin: 0, pl: "$5" }}>
            <li>
              <Body>Equal Opportunity</Body>
              <Subtext css={{ color: "$secondaryText", pl: "$4", mt: "$3" }}>
                Whether you have zero or a million followers, we give every post an
                opportunity to be seen so you can just focus on being the best you!
              </Subtext>
            </li>
            <li>
              <Body>Free Listing</Body>
              <Subtext css={{ color: "$secondaryText", pl: "$4", mt: "$3" }}>
                List your products for free! Get started without having to pay to feature
                your items. We only take 15% after you&apos;ve made your sale.
              </Subtext>
            </li>
            <li>
              <Body>Get Paid to Share</Body>
              <Subtext css={{ color: "$secondaryText", pl: "$4", mt: "$3" }}>
                Ever thought you should get paid for being someone&apos;s biggest
                supporter? Well, now you can! Get a 5% cut everytime you share
                someone&apos;s shop and someone makes a purchase from your post at no cost
                to the creator!
              </Subtext>
            </li>
            <li>
              <Body>No Shadowbans</Body>
              <Subtext css={{ color: "$secondaryText", pl: "$4", mt: "$3" }}>
                No more random or sneaky bans. We tell you exactly what content violates
                our community guidelines and follow procedures to keep our community safe.
              </Subtext>
            </li>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
