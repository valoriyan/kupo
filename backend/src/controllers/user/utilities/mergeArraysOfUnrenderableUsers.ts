import { UnrenderableUser } from "../models";

export function mergeArraysOfUnrenderableUsers({
  arrays,
}: {
  arrays: UnrenderableUser[][];
}) {
  const mergedArray: UnrenderableUser[] = [];
  const setOfIncludedPublishedItemIds = new Set();

  arrays.forEach((array) => {
    array.forEach((element) => {
      const { userId } = element;
      if (!setOfIncludedPublishedItemIds.has(userId)) {
        setOfIncludedPublishedItemIds.add(userId);
        mergedArray.push(element);
      }
    });
  });

  return mergedArray;
}
