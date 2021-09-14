import { MouseEventHandler } from "react";
import { ChevronDownR, ChevronUpR, Trash } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { styled } from "#/styling";

export interface PreviewImageProps {
  src: string;
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
      <Image src={props.src} alt="Preview Image" />
      {props.overlayText && <Overlay>{props.overlayText}</Overlay>}
      {props.actions && (
        <ActionsBanner>
          <Flex css={{ gap: "$3" }}>
            <IconButton onClick={actionHandler(props.actions.moveUp)}>
              <ChevronUpR />
            </IconButton>
            <IconButton onClick={actionHandler(props.actions.moveDown)}>
              <ChevronDownR />
            </IconButton>
          </Flex>
          <IconButton onClick={actionHandler(props.actions.delete)}>
            <Trash />
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

const Image = styled("img", {
  position: "absolute",
  top: 0,
  left: 0,
  size: "100%",
  objectFit: "cover",
});

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
