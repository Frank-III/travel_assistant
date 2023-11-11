"use client";
import { MarkerLocationWithCenter, Message } from "@/lib/types";
import { useRef, useState, useEffect } from "react";
import { match, P } from "ts-pattern";
// import { FunctionTools, mark_locations } from "@/lib/utils";
import { type RouterOutputs } from "@/server/api/root";
import { api } from "@/trpc/react";
import type {
  ThreadMessage,
  ThreadMessagesPage,
  MessageContentText,
} from "openai/resources/beta/threads/messages";
import { ChevronRight, Code } from "lucide-react";
import { MarkerLocation } from "@/lib/types";

function ChatElement({ message }: { message: Message }) {
  return (
    <div className="inline-flex w-full items-start space-x-5 text-[30px] text-gray-500 hover:text-gray-700">
      {message.sender === "assistant" ? (
        <Code style={{ paddingTop: 10 }} size={40} />
      ) : (
        <ChevronRight style={{ paddingTop: 10 }} size={40} />
      )}
      <span>{message.message}</span>
    </div>
  );
}

export default function ChatBox({
  addMarker,
  addMessages,
  messages,
}: {
  addMarker: (marker: MarkerLocationWithCenter[]) => void;
  addMessages: (messages: Message[]) => void;
  messages: Message[];
}) {
  const [prompt, setPrompt] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: callbackOnAssistant } = api.wanderlust.callback.useMutation({
    onSuccess: (data) => {
      if (data.messages?.data) {
        addMessages(
          data.messages.data
            .reverse()
            .slice(messages.length)
            .map((newMessage) => ({
              message:
                "text" in newMessage.content[0]
                  ? newMessage.content[0].text.value
                  : "",
              sender: newMessage.role,
              meta: newMessage?.metadata,
            })),
        );
      }
    },
  });
  const onDataReturn = (data: RouterOutputs["wanderlust"]["ask"]) => {
    switch (data.type) {
      case "action": {
        data.action?.required_action?.submit_tool_outputs?.tool_calls.forEach(
          (tool_call) => {
            switch (tool_call.function.name) {
              case "mark_location": {
                //TODO: type this
                const params = JSON.parse(tool_call.function.arguments);
                console.log("add marker: ", params);
                addMarker(
                  params.locations.map(
                    (location: MarkerLocationWithCenter) => location,
                    // {
                    //   lat: location.lat,
                    //   lng: location.lng,
                    //   description: location.description,
                    //   property: location.property,
                    // }
                  ),
                );
                break;
              }
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
          addMessages(
            data.messages.data
              .reverse()
              .slice(messages.length)
              .map((newMessage) => ({
                message:
                  "text" in newMessage.content[0]
                    ? newMessage.content[0].text.value
                    : "",
                sender: "assistant",
                meta: newMessage?.metadata,
              })),
          );
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

  // scroll to input
  // useEffect(() => {
  //   inputRef.current?.scrollIntoView();
  // }, [messages]);

  // when hit enter send message
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        askAssistant({ text: prompt });
        addMessages([
          {
            message: prompt,
            sender: "user",
            meta: null,
          },
        ]);
        setPrompt("");
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [prompt]);

  return (
    // <div className="p-2 border-1 flex h-[650px] w-[650px] flex-col items-center justify-center overflow-y-auto border-gray-300 text-[30px] text-wrap">
    // <div className="flex flex-col h-[650px] w-[650px] border-gray-300">
    //   {/* {messages.length == 0 && <ChatElement message={fake_message} />}
    //   {messages.map((message, index) => (
    //     <ChatElement key={index} message={message} />
    //   ))} */}
    //   <div className="flex flex-col p-2 overflow-y-auto text-[30px]">
    //     {messages.length === 0 && <ChatElement message={fake_message} />}
    //     {messages.map((message, index) => (
    //       <ChatElement key={index} message={message} />
    //     ))}
    //   </div>
    //   <div className="flex p-2 space-x-5 border-t border-gray-300 text-[30px] text-gray-500 hover:text-gray-700">
    //   {/* <div className="inline-flex w-full items-start space-x-5 text-[30px] text-gray-500 hover:text-gray-700"> */}
    //     <ChevronRight className="pt-[10px]" size={40} />
    //     <input
    //       value={prompt}
    //       onChange={(e) => setPrompt(e.target.value)}
    //       type="text"
    //       ref = {inputRef}
    //       className="w-full text-gray-700 outline-none"
    //       placeholder="Start Typing or share a file"
    //       disabled={askStatus === "loading"}
    //     />
    //   </div>
    // </div>
    <div
      className={`flex h-[650px] w-[650px] flex-col ${
        messages.length === 0 ? "justify-center" : "justify-end"
      } border-gray-300`}
    >
      {/* Conditionally render messages container if there are messages */}

      {messages.length == 0 && <ChatElement message={fake_message} />}
      {messages.length > 0 && (
        <div className="overflow-y-auto text-[30px]">
          {messages.map((message, index) => (
            <ChatElement key={index} message={message} />
          ))}
        </div>
      )}

      {/* Input and button */}
      <div className="flex items-center space-x-5 border-t border-gray-300 py-2 text-[30px] text-gray-500 hover:text-gray-700">
        <ChevronRight size={35} />
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          ref={inputRef}
          className="flex-1 text-gray-700 outline-none"
          placeholder="Start Typing or share a file"
          disabled={askStatus === "loading"}
        />
      </div>
    </div>
  );
}
