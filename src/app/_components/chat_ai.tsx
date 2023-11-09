"use client";

import { useState } from "react";
import { match, P } from "ts-pattern";
import { api } from "@/trpc/react";
import {
  ThreadMessage,
  ThreadMessagesPage,
} from "openai/resources/beta/threads/messages";
import { Code, FileBarChart2 } from "lucide-react";

type MessageMeta = null;

interface Message {
  message: string;
  sender: "user" | "bot";
  meta: MessageMeta;
}

function ChatElement({ message }: { message: ThreadMessage }) {
  return (
    <div className="inline-flex w-full items-center space-x-5 text-[35px] text-gray-500 hover:text-gray-700">
      <Code />
      <span>{message.message}</span>
    </div>
  );
}

function onDataReturn(data: ThreadMessagesPage) {}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const { mutate, status } = api.wanderlust.ask.useMutation({
    onSuccess: (data) => {
      setMessages([]);
    },
  });

  const fake_message: Message = {
    message: "Hello",
    sender: "user",
    meta: null,
  };

  // when hit enter send message
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      mutate({ text: prompt });
      setPrompt("");
    }
  });

  return (
    <div className="border-1 flex h-[650px] w-[650px] flex-col items-center justify-center overflow-y-auto border-gray-300 text-[30px]">
      <ChatElement message={fake_message} />
      <input
        value={prompt}
        type="text"
        className="w-full text-gray-700 outline-none"
        placeholder="Start Typing or share a file"
        disabled={status === "loading"}
      />
    </div>
  );
}
