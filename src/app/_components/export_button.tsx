"use client";
import { Content } from "@/lib/types";
import { ArrowUpFromLine } from "lucide-react";

export function exportToFile(content: Content) {
  const title = "# Travel Plan\n\n";

  const locationString = content.locations
    .filter((location) => location.description !== "You are here")
    .map((location) => {
      return (
        "|" +
        `(Lat: ${location.lat}, Lng: ${location.lng})` +
        "|" +
        location.description +
        "|" +
        location.property +
        "|"
      );
    })
    .join("\n");

  // markdown table
  const tableString =
    "\n\n| Location | Description | Property |\n| --- | --- | --- |\n" +
    locationString +
    "\n\n";

  const messageString = content.messages
    .map((message) => {
      if (message.sender === "user") {
        return `## You: ${message.message}`;
      }
      return `Assistant: ${message.message}`;
    })
    .join("\n\n");

  const markdownString = title + tableString + messageString;

  const blob = new Blob([markdownString], { type: "text/plain;charset=utf-8" });

  return blob;
}

export default function ExportButton({ content }: { content: Content }) {
  const exportMessages = () => {
    try {
      const blob = exportToFile(content);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "messages.md"; // Set the file name for the download.
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("An error occurred while exporting the file", error);
    } finally {
      // Cleanup: remove the link from the DOM
      link?.parentNode?.removeChild(link);
    }
  };
  // const exportMessages = () => {
  //   console.log(11)
  // }
  return (
    <button
      onClick={exportMessages}
      className="right-0 top-0 m-2 rounded-xl border-2 p-2 hover:bg-gray-200"
    >
      <ArrowUpFromLine size={20} />
    </button>
  );
}
