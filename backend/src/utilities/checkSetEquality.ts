export function areSetsEqual<T>(firstSet: Set<T>, secondSet: Set<T>) {
  if (firstSet.size !== secondSet.size) return false;
  for (const firstSetItem of firstSet) if (!secondSet.has(firstSetItem)) return false;
  return true;
}
