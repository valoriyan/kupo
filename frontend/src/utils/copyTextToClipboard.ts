import { toast } from "react-toastify";
import { isServer } from "./isServer";

export async function copyTextToClipboard(text: string, textName: string) {
  if (isServer()) return;

  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text, textName);
    return;
  }

  try {
    navigator.clipboard.writeText(text);
    toast.success(`${textName} copied successfully`);
  } catch (error) {
    console.error("Could not copy text: ", error);
  }
}

function fallbackCopyTextToClipboard(text: string, textName: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) toast.success(`${textName} copied successfully`);
    if (!successful) console.error("Could not copy text");
  } catch (error) {
    console.error("Could not copy text: ", error);
  }

  document.body.removeChild(textArea);
}
