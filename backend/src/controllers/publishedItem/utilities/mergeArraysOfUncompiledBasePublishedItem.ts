import { UnassembledBasePublishedItem } from "../models";

export function mergeArraysOfUncompiledBasePublishedItem({
  arrays,
}: {
  arrays: UnassembledBasePublishedItem[][];
}) {
  //////////////////////////////////////////////////
  // Handle Merge
  //////////////////////////////////////////////////

  const mergedArray: UnassembledBasePublishedItem[] = [];
  const setOfIncludedPublishedItemIds = new Set();

  arrays.forEach((array) => {
    array.forEach((element) => {
      const { id } = element;
      if (!setOfIncludedPublishedItemIds.has(id)) {
        setOfIncludedPublishedItemIds.add(id);
        mergedArray.push(element);
      }
    });
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return mergedArray;
}
