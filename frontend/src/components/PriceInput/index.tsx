import { useRef } from "react";
import { styled } from "#/styling";
import { Flex } from "../Layout";
import { Body } from "../Typography";

export interface PriceInputProps {
  price: number;
  setPrice: (price: number) => void;
}

export const PriceInput = ({ price, setPrice }: PriceInputProps) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const value = ref.current?.value;
  const charCount = value
    ? value.includes(".")
      ? value.length + 1
      : value.length + 2
    : 5;

  return (
    <Flex css={{ alignItems: "center", gap: "$4" }}>
      <Body>$</Body>
      <Input
        ref={ref}
        type="number"
        placeholder="0.00"
        value={price || undefined}
        onChange={(e) => {
          const value = e.currentTarget.valueAsNumber;
          setPrice(Number.isNaN(value) || value < 0 ? 0 : Math.round(value * 100) / 100);
        }}
        onBlur={() => {
          if (ref.current) {
            ref.current.value = price.toFixed(2);
            setPrice(price);
          }
        }}
        css={{ width: charCount + "ch" }}
      />
    </Flex>
  );
};

const Input = styled("input", {
  minWidth: "5ch",
  bg: "transparent",
  border: "none",
  fontSize: "$3",
  textAlign: "right",

  "&::placeholder": {
    color: "$secondaryText",
  },
});
