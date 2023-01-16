import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPubSub, PubSubTopics } from "#/contexts/pubsub";
import { keyframes, prefersMotionSelector, styled } from "#/styling";
import { transitionInMilliseconds } from "#/utils/transitionInMilliseconds";

export * from "./helpers";

const [openModal, useOpenModalListener] = createPubSub("openModal");

export interface OpenModalProps extends Omit<ModalProps, "onRemoveModal"> {
  id: string;
}

export const ModalContainer = () => {
  const [modalMap, setModalMap] = useState<Record<string, OpenModalProps>>({});

  const removeModal = useCallback((modalId: string) => {
    setModalMap((prev) => {
      const next = { ...prev };
      delete next[modalId];
      return next;
    });
  }, []);

  const onOpenModal = useCallback((payload: PubSubTopics["openModal"]) => {
    setModalMap((prev) => {
      return { ...prev, [payload.id]: payload };
    });
  }, []);

  useOpenModalListener(onOpenModal);

  if (!Object.keys(modalMap).length) return null;

  return (
    <>
      {Object.values(modalMap).map(({ id, ...modalProps }) => {
        return <Modal key={id} onRemoveModal={() => removeModal(id)} {...modalProps} />;
      })}
    </>
  );
};

export { openModal };

interface ModalProps {
  onRemoveModal: () => void;
  children: (renderProps: { hide: () => void }) => ReactNode;
}

const Modal = (props: ModalProps) => {
  const lastFocusedElement = useRef(document.activeElement as HTMLElement | null);

  const [isOpen, setIsOpen] = useState(true);
  const hide = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) {
      // Wait for exit animation to finish before removing modal
      window.setTimeout(() => props.onRemoveModal(), transitionInMilliseconds("1"));
    }
  }, [isOpen, props]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            lastFocusedElement.current?.focus();
          }}
        >
          {props.children({ hide })}
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const scaleIn = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -50%) scale(0)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});
const scaleOut = keyframes({
  "0%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
  "100%": { opacity: 0, transform: "translate(-50%, -50%) scale(0)" },
});

const DialogContent = styled(Dialog.Content, {
  zIndex: "$dialog",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) scale(0)",
  [prefersMotionSelector]: {
    "&[data-state='open']": {
      animation: `${scaleIn} $1 ease forwards`,
    },
    "&[data-state='closed']": {
      animation: `${scaleOut} $1 ease`,
    },
  },
});

const fadeIn = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});
const fadeOut = keyframes({
  "0%": { opacity: 1 },
  "100%": { opacity: 0 },
});

const DialogOverlay = styled(Dialog.Overlay, {
  zIndex: "$dialog",
  bg: "$overlay",
  position: "fixed",
  inset: 0,
  [prefersMotionSelector]: {
    "&[data-state='open']": {
      animation: `${fadeIn} $2 ease`,
    },
    "&[data-state='closed']": {
      animation: `${fadeOut} $2 ease`,
    },
  },
});
