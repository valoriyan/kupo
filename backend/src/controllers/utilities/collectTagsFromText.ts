export function collectTagsFromText({ text }: { text: string }): string[] {
  const collectedTags: string[] = [];

  const regex = /\B@(\w+)/gm;

  // Alternative syntax using RegExp constructor
  // const regex = new RegExp('\\B@\\w+', 'gm')

  let m;

  while ((m = regex.exec(text)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (groupIndex === 1) {
        collectedTags.push(match);
      }
    });
  }

  return collectedTags;
}
