"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, MessageSquare } from "lucide-react";
import { socket } from "@/lib/socket";
import Image from "next/image";

interface Message {
  message: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  timestamp: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserImage?: string;
}

export default function ChatSidebar({
  isOpen,
  onClose,
  roomId,
  currentUserId,
  currentUserName,
  currentUserImage,
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && roomId) {
      socket.emit("join_room", roomId);
    }
  }, [isOpen, roomId]);

  useEffect(() => {
    const handleMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !roomId) return;

    const messageData = {
      roomId,
      message: inputValue.trim(),
      senderId: currentUserId,
      senderName: currentUserName,
      senderImage: currentUserImage,
    };

    socket.emit("send_message", messageData);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[350px] bg-white dark:bg-zinc-900 shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-white" />
                <h3 className="font-bold uppercase tracking-wider text-sm">
                  Battle Chat
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/50"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">
                    No messages yet
                  </p>
                  <p className="text-[10px]">Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`flex items-end gap-2 max-w-[85%] ${isMe ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 relative">
                          {msg.senderImage ? (
                            <Image
                              src={msg.senderImage}
                              alt={msg.senderName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-500">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-sm ${
                            isMe
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-700 rounded-tl-none shadow-sm"
                          }`}
                        >
                          {!isMe && (
                            <p className="text-[10px] font-black text-blue-500 uppercase mb-1">
                              {msg.senderName}
                            </p>
                          )}
                          <p className="leading-relaxed">{msg.message}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 ${isMe ? "mr-10" : "ml-10"}`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-zinc-900 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
