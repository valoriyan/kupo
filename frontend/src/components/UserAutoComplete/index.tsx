import * as RadixPopover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { styled } from "#/styling";
import { useAutoCompleteUsername } from "#/api/queries/users/useAutoCompleteUsername";
import { Avatar } from "../Avatar";
import { Flex } from "../Layout";
import { Spinner } from "../Spinner";
import { Body, bodyStyles } from "../Typography";
import { MATCH_USER } from "../WithTags";

export interface UserAutoCompleteProps {
  text: string;
  setText: (text: string) => void;
  children: ReactNode;
  requirePrefix?: boolean;
  side?: "bottom" | "left" | "right" | "top";
}

export const UserAutoComplete = ({
  text,
  setText,
  children,
  requirePrefix = true,
  side = "bottom",
}: UserAutoCompleteProps) => {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const parsedUsernames = Array.from(
    text.matchAll(new RegExp(requirePrefix ? MATCH_USER : /@?\w+/, "g")),
  ).map((match) => match[0]);

  const usernameToAutoComplete =
    parsedUsernames[parsedUsernames.length - 1]?.replaceAll("@", "") ?? "";

  const { data, isLoading, isError } = useAutoCompleteUsername({
    searchString: usernameToAutoComplete,
    limit: 10,
  });

  const users = data?.results;

  useEffect(() => {
    setOpen(!!text && !!usernameToAutoComplete && text.endsWith(usernameToAutoComplete));
  }, [text, usernameToAutoComplete]);

  const selectUser = (selectedUsername: string) => {
    setText(
      text.replace(new RegExp(usernameToAutoComplete + "$"), selectedUsername) + " ",
    );
    setOpen(false);
  };

  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen} modal={false}>
      <RadixPopover.Anchor
        asChild
        ref={anchorRef}
        onKeyDown={(e) => {
          if (e.code === "ArrowDown" && open) {
            // TODO: Move focus to the first menu option
          }
        }}
      >
        {children}
      </RadixPopover.Anchor>
      <AnimatePresence initial={false}>
        {open ? (
          <Content
            align="start"
            side={side}
            forceMount
            onOpenAutoFocus={(e) => {
              e.preventDefault();
            }}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              anchorRef.current?.focus();
            }}
          >
            <ContentBody
              transition={{ duration: 0.25 }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0.5 }}
            >
              {isError && !isLoading ? (
                <Body css={{ p: "$6" }}>Failed to fetch users</Body>
              ) : isLoading ? (
                <Flex css={{ px: "$10", py: "$7" }}>
                  <Spinner size="sm" />
                </Flex>
              ) : !users?.length ? (
                <Body css={{ p: "$6" }}>No users found</Body>
              ) : (
                users.map((user) => (
                  <SuggestedUser
                    key={user.userId}
                    onClick={() => selectUser(user.username)}
                  >
                    <Avatar
                      size="$7"
                      src={user.profilePictureTemporaryUrl}
                      alt={`@${user.username}'s profile picture`}
                    />
                    {user.username}
                  </SuggestedUser>
                ))
              )}
            </ContentBody>
          </Content>
        ) : null}
      </AnimatePresence>
    </RadixPopover.Root>
  );
};

const Content = styled(RadixPopover.Content, {
  zIndex: "$dropdown",
});

const ContentBody = styled(motion.div, bodyStyles, {
  bg: "$background1",
  border: "solid $borderWidths$1 $border",
  borderRadius: "$1",
  py: "$2",
  transformOrigin: "var(--radix-popover-content-transform-origin)",
});

const SuggestedUser = styled(Flex, bodyStyles, {
  display: "flex",
  px: "$5",
  py: "$3",
  gap: "$4",
  alignItems: "center",
  color: "$primary",
  fontWeight: "$bold",
  cursor: "pointer",
  outline: "none",
  "&:focus, &:hover, &:active": {
    bg: "$background2",
  },
});
