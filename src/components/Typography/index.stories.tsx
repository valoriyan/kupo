import { Story } from "@storybook/react";
import React, { PropsWithChildren } from "react";
import { Slogan, MainTitle, Heading, Body, Subtext } from ".";
import { Stack } from "../Layout";

export default {
  title: "Components/Typography",
};

export const Template: Story<PropsWithChildren<unknown>> = (args) => (
  <Stack css={{ gap: "$5" }}>
    <Slogan>Slogan - {args.children}</Slogan>
    <MainTitle>Main Title - {args.children}</MainTitle>
    <Heading>Heading - {args.children}</Heading>
    <Body>Body - {args.children}</Body>
    <Subtext>Subtext - {args.children}</Subtext>
  </Stack>
);
Template.args = {
  children: "The quick brown fox jumped over the lazy dog.",
};
