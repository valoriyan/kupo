import { addDecorator } from "@storybook/react";
import { ThemeProvider } from "../src/styling/ThemeProvider";
import { globalStyles } from "../src/styling/globalStyles";

addDecorator((Story) => {
  globalStyles();
  return (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  );
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
