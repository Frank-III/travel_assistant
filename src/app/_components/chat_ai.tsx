"use client";

import { useState } from "react";
import { match, P } from "ts-pattern";
import { api } from "@/trpc/react";
import { Code, FileBarChart2 } from "lucide-react";

type MessageMeta = null;

interface Message {
  message: String;
  sender: "user" | "bot";
  meta: MessageMeta;
}

function ChatElement({ message }: { message: Message }) {
  return (
    <div className="inline-flex w-full items-center space-x-5 text-[35px] text-gray-500 hover:text-gray-700">
      <Code />
      <span>{message.message}</span>
    </div>
  );
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { mutate, status } = api.wanderlust.ask.useMutation();

  const fake_message: Message = {
    message: "Hello",
    sender: "user",
    meta: null,
  };
  return (
    <div className="border-1 flex h-[650px] w-[650px] flex-col items-center justify-center overflow-y-auto border-gray-300 text-[30px]">
      <ChatElement message={fake_message} />
      <input
        type="text"
        className="w-full text-gray-700 outline-none"
        placeholder="Start Typing or share a file"
      />
    </div>
  );
}
