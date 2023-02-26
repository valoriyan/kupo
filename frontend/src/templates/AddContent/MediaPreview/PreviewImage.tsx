import { MouseEventHandler } from "react";
import { IconButton } from "#/components/Button";
import {
  ChevronDownOIcon,
  ChevronUpOIcon,
  PlayButtonOIcon,
  TrashIcon,
} from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { Spinner } from "#/components/Spinner";
import { css, styled } from "#/styling";
import { MediaDescriptor } from "../FormContext";

export interface PreviewImageProps {
  media: MediaDescriptor;
  id?: string;
  onClick?: () => void;
  overlayText?: string;
  actions?: {
    moveUp: () => void;
    moveDown: () => void;
    delete: () => void;
  };
  unBoundHeight?: boolean;
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
      {props.media.mimeType.includes("image") ? (
        <Image
          src={props.media.src}
          alt="Preview Image"
          css={props.unBoundHeight ? unBoundHeighMediaStyled : undefined}
        />
      ) : (
        <Video
          controls={!!props.id}
          css={props.unBoundHeight ? unBoundHeighMediaStyled : undefined}
        >
          <source src={props.media.src} type={props.media.mimeType} />
        </Video>
      )}
      {(props.overlayText || (props.media.mimeType.includes("video") && !props.id)) && (
        <Overlay>{props.overlayText || <PlayButtonOIcon />}</Overlay>
      )}
      {props.media.isLoading && (
        <LoadingOverlay>
          <Spinner size="md" />
        </LoadingOverlay>
      )}
      {props.actions && (
        <ActionsBanner>
          <Flex css={{ gap: "$3" }}>
            <IconButton onClick={actionHandler(props.actions.moveUp)}>
              <ChevronUpOIcon />
            </IconButton>
            <IconButton onClick={actionHandler(props.actions.moveDown)}>
              <ChevronDownOIcon />
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
  width: "100%",
  flexShrink: 0,
});

const mediaStyles = css({
  position: "absolute",
  top: 0,
  left: 0,
  size: "100%",
  objectFit: "cover",
});

const unBoundHeighMediaStyled = {
  height: "unset",
  position: "static",
  objectFit: "contain",
};

const Image = styled("img", mediaStyles);

const Video = styled("video", mediaStyles);

const absoluteFlex = css({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
});

const Overlay = styled("div", absoluteFlex, {
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "$bold",
  fontSize: "$3",
  color: "$accentText",
  textShadow: "$4",
  backgroundColor: "$mediaOverlay",
});

const ActionsBanner = styled("div", absoluteFlex, {
  bottom: "unset",
  justifyContent: "space-between",
  p: "$2",
  gap: "$3",
  bg: "$heavyOverlay",
  color: "$accentText",
  svg: { flexShrink: 0 },
});

const LoadingOverlay = styled("div", absoluteFlex, {
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "$overlay",
});
