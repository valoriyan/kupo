import { MouseEventHandler } from "react";
import {
  ChevronDownRIcon,
  ChevronUpRIcon,
  PlayButtonOIcon,
  TrashIcon,
} from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { css, styled } from "#/styling";
import { Media } from "../FormContext";

export interface PreviewImageProps {
  media: Media;
  id?: string;
  onClick?: () => void;
  overlayText?: string;
  actions?: {
    moveUp: () => void;
    moveDown: () => void;
    delete: () => void;
  };
}

export const PreviewImage = (props: PreviewImageProps) => {
  const actionHandler =
    (action: () => void): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      e.stopPropagation();
      action();
    };

  return (
    <Wrapper id={props.id} as={props.onClick ? "button" : "div"} onClick={props.onClick}>
      {props.media.file.type.includes("image") ? (
        <Image src={props.media.src} alt="Preview Image" />
      ) : (
        <Video controls={!!props.id}>
          <source src={props.media.src} type={props.media.file.type} />
        </Video>
      )}
      {(props.overlayText || (props.media.file.type.includes("video") && !props.id)) && (
        <Overlay>{props.overlayText || <PlayButtonOIcon />}</Overlay>
      )}
      {props.actions && (
        <ActionsBanner>
          <Flex css={{ gap: "$3" }}>
            <IconButton onClick={actionHandler(props.actions.moveUp)}>
              <ChevronUpRIcon />
            </IconButton>
            <IconButton onClick={actionHandler(props.actions.moveDown)}>
              <ChevronDownRIcon />
            </IconButton>
          </Flex>
          <IconButton onClick={actionHandler(props.actions.delete)}>
            <TrashIcon />
          </IconButton>
        </ActionsBanner>
      )}
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  position: "relative",
  size: "100%",
  flexShrink: 0,
});

const mediaStyles = css({
  position: "absolute",
  top: 0,
  left: 0,
  size: "100%",
  objectFit: "cover",
});

const Image = styled("img", mediaStyles);

const Video = styled("video", mediaStyles);

const Overlay = styled("div", {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "$bold",
  fontSize: "$3",
  color: "$accentText",
  textShadow: "$4",
  backgroundColor: "$mediaOverlay",
});

const ActionsBanner = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "space-between",
  p: "$2",
  gap: "$3",
  bg: "$heavyOverlay",
  color: "$accentText",
  svg: { flexShrink: 0 },
});

const IconButton = styled("button", { lineHeight: 0 });
