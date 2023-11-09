"use client";

import { useState, useEffect } from "react";
import { match, P } from "ts-pattern";
// import { FunctionTools, mark_locations } from "@/lib/utils";
import { type RouterOutputs } from "@/server/api/root";
import { api } from "@/trpc/react";
import type {
  ThreadMessage,
  ThreadMessagesPage,
  MessageContentText,
} from "openai/resources/beta/threads/messages";
import { ChevronRight, Code, FileBarChart2 } from "lucide-react";
import { MarkerLocation } from "@/lib/types";

interface Message {
  message: string;
  sender: "user" | "assistant";
  meta: unknown;
}

function ChatElement({ message }: { message: Message }) {
  return (
    <div className="inline-flex w-full items-start space-x-5 text-[30px] text-gray-500 hover:text-gray-700" >
      { message.sender === "assistant" ? <Code style={{paddingTop: 10}} size={40}/> : <ChevronRight style={{paddingTop: 10}} size={40}/>}
      <span>{message.message}</span>
    </div>
  );
}

export default function ChatBox({
  addMarker,
}: {
  addMarker: (marker: MarkerLocation[]) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const addMessage = (message: Message) => {
    setMessages([...messages, message]);
  };
  const { mutate: callbackOnAssistant } = api.wanderlust.callback.useMutation({
    onSuccess: (data) => {
      if (data.messages?.data) {
        
      setMessages(
          data.messages.data.reverse().slice(messages.length).map((newMessage) => ({
            message:
              "text" in newMessage.content[0]
                ? newMessage.content[0].text.value
                : "",
            sender: newMessage.role,
            meta: newMessage?.metadata,
          }),
      ));
        }
      // onDataReturn(data);
    },
  });
  const onDataReturn = (data: RouterOutputs["wanderlust"]["ask"]) => {
    switch (data.type) {
      case "action": {
        data.action?.required_action?.submit_tool_outputs?.tool_calls.forEach(
          (tool_call) => {
            switch (tool_call.function.name) {
              case "mark_location":
                {
                  //TODO: type this
                  const params = JSON.parse(tool_call.function.arguments);
                  console.log("add marker: ", params)
                  if (params.locations.length == 1) {
                    addMarker([{
                      lat: params.locations[0].lat,
                      lng: params.locations[0].lng,
                      description: params.locations[0].description,
                      center: true,
                    }]);
                  } else {
                    addMarker(params.locations.map((location: MarkerLocation) => (
                      {
                        lat: location.lat,
                        lng: location.lng,
                        description: location.description,
                        center: false,
                      })));
                  }
                }
                break;
            }
          },
        );
        callbackOnAssistant({
          run_id: data.action!.id,
          run_res:
            data.action!.required_action.submit_tool_outputs.tool_calls.map(
              (tool_call) => ({
                tool_call_id: tool_call.id,
                message: JSON.stringify({ info: "success" }),
              }),
            ),
        });
        break;
      }
      case "message": {
        if (data.messages?.data) {
        setMessages(
            data.messages.data.reverse().slice(messages.length).map((newMessage) => ({
              message:
                "text" in newMessage.content[0]
                  ? newMessage.content[0].text.value
                  : "",
              sender: newMessage.role,
              meta: newMessage?.metadata,
            }),
        ));
        }
      }
    }
  };
  const { mutate: askAssistant, status: askStatus } =
    api.wanderlust.ask.useMutation({
      onSuccess: (data) => {
        onDataReturn(data);
      },
    });

  const fake_message: Message = {
    message: "Hello, I'm Wanderlust. How can I help you?",
    sender: "assistant",
    meta: null,
  };

  // when hit enter send message
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        askAssistant({ text: prompt });
        addMessage({
          message: prompt,
          sender: "user",
          meta: null,
        });
        setPrompt("");
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [prompt]);

  return (
    <div className="border-1 flex h-[650px] w-[650px] flex-col items-center justify-center overflow-y-auto border-gray-300 text-[30px]">
      {messages.length == 0 && <ChatElement message={fake_message} />}
      {messages.map((message, index) => (
        <ChatElement key={index} message={message} />
      ))}
      <div className="inline-flex w-full items-start space-x-5 text-[30px] text-gray-500 hover:text-gray-700">
      <ChevronRight className="pt-[10px]" size={40}/>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        type="text"
        className="w-full text-gray-700 outline-none"
        placeholder="Start Typing or share a file"
        disabled={askStatus === "loading"}
      />
      </div>
    </div>
  );
}
