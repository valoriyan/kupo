import { css } from "#/styling";

export const truncateByWidth = (width: string) =>
  css({
    width,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverlow: "ellipsis",
  });

export const truncateByLines = (lines: number) =>
  css({
    display: "-webkit-box",
    "-webkit-line-clamp": lines,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    "text-overflow": "ellipsis",
  });
