import { useState } from "react";
import { styled } from "#/styling";
import { IconButton } from "../Button";
import { InfoIcon, MathPlusIcon, TrashIcon } from "../Icons";
import { Input } from "../Input";
import { Flex, Stack } from "../Layout";
import { Body } from "../Typography";
import { Tooltip } from "../Tooltip";

export interface ListCreatorProps {
  list: string[];
  onChange: (list: string[]) => void;
  tooltipText: string;
  limit?: number;
}

export const ListCreator = ({ list, onChange, tooltipText, limit }: ListCreatorProps) => {
  const [newItem, setNewItem] = useState("");

  const disabled = !!limit && list.length >= limit;

  const addNewItemToList = () => {
    if (!newItem) return;
    onChange([...list, newItem]);
    setNewItem("");
  };

  const removeIndexFromList = (index: number) => {
    onChange(list.filter((_, i) => i !== index));
  };

  return (
    <Stack css={{ gap: "$4" }}>
      {!!list.length && (
        <Stack css={{ gap: "$3" }}>
          {list.map((item, i) => (
            <Row key={item}>
              <RowNumber>{i + 1}.</RowNumber>
              {item.includes("http") ? (
                <Body
                  as="a"
                  href={item}
                  target="_blank"
                  rel="noopener noreferrer"
                  css={{ flex: 1 }}
                >
                  {item}
                </Body>
              ) : (
                <Body css={{ flex: 1 }}>{item}</Body>
              )}
              <IconButton
                css={{ color: "$failure" }}
                onClick={() => removeIndexFromList(i)}
              >
                <TrashIcon />
              </IconButton>
            </Row>
          ))}
        </Stack>
      )}
      <Row>
        <Tooltip content={tooltipText}>
          <Flex css={{ color: "$secondaryText" }}>
            <InfoIcon />
          </Flex>
        </Tooltip>
        <Input
          css={{ flex: 1 }}
          disabled={disabled}
          value={newItem}
          onChange={(e) => setNewItem(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addNewItemToList();
          }}
        />
        <IconButton disabled={disabled || !newItem} onClick={addNewItemToList}>
          <MathPlusIcon />
        </IconButton>
      </Row>
    </Stack>
  );
};

const Row = styled(Flex, { gap: "$3", alignItems: "center" });

const RowNumber = styled(Body, {
  size: "$6",
  color: "$secondaryText",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
