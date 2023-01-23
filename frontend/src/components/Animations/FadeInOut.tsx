import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

export interface FadeInOut {
  children: ReactNode;
  className?: string;
}

export const FadeInOut = ({ children, className }: FadeInOut) => {
  return (
    <AnimatePresence>
      <motion.div
        transition={{ duration: 0.2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
