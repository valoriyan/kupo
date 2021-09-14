/* eslint-disable */
declare module "@svgr/core" {
  import * as Prettier from "prettier";

  interface svgrConfig {
    dimensions?: boolean;
    expandProps?: "start" | "end" | "none";
    icon?: boolean;
    native?: boolean;
    typescript?: boolean;
    prettier?: boolean;
    prettierConfig?: Prettier.Options;
    memo?: boolean;
    ref?: boolean;
    replaceAttrValues?: Record<string, string>;
    svgProps?: Record<string, string>;
    svgo?: boolean;
    /** See full options: https://gist.github.com/pladaria/69321af86ce165c2c1fc1c718b098dd0 */
    svgoConfig?: object;
    template?: string | Function;
    titleProp?: boolean;
    runtimeConfig?: boolean;
    plugins?: string[];
  }

  interface svgrState {
    filePath?: string;
    componentName?: string;
  }

  function svgr(svgCode: string, config?: svgrConfig, state?: svgrState): Promise<string>;
  svgr.sync = (svgCode: string, config?: svgrConfig, state?: svgrState): string => {};

  export default svgr;
}
