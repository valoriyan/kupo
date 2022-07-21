import { UncompiledBasePublishedItem } from "../models";

export function mergeArraysOfUncompiledBasePublishedItem({
  arrays,
}: {
  arrays: UncompiledBasePublishedItem[][];
}) {
  const mergedArray: UncompiledBasePublishedItem[] = [];
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

  return mergedArray;
}
