export const getExternalLink = (link: string) => {
  return link.startsWith("http://") || link.startsWith("https://")
    ? link
    : `https://${link}`;
};
