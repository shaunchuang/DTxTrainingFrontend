"use client";

import DashboardLayout from "../components/layout/DashboardLayout";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSmile, faPaperclip, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

interface Message {
  id: number;
  sender: string;
  senderType: "patient" | "doctor" | "therapist";
  content: string;
  timestamp: string;
  isMe: boolean;
}

export default function Chatroom() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "王醫師",
      senderType: "doctor",
      content: "您好！今天的訓練感覺如何？有什麼問題需要討論的嗎？",
      timestamp: "2024-12-28 14:30",
      isMe: false
    },
    {
      id: 2,
      sender: "我",
      senderType: "patient",
      content: "醫師您好，今天的認知訓練比較困難，有些題目我需要思考很久才能回答。",
      timestamp: "2024-12-28 14:35",
      isMe: true
    },
    {
      id: 3,
      sender: "李治療師",
      senderType: "therapist",
      content: "這是正常的，認知訓練需要循序漸進。建議您可以從簡單的開始，逐步增加難度。",
      timestamp: "2024-12-28 14:40",
      isMe: false
    },
    {
      id: 4,
      sender: "我",
      senderType: "patient",
      content: "謝謝治療師的建議！我會按照您說的方式來練習。還有一個問題，語言訓練的發音練習有沒有推薦的方法？",
      timestamp: "2024-12-28 14:45",
      isMe: true
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "我",
        senderType: "patient",
        content: newMessage,
        timestamp: new Date().toLocaleString("zh-TW", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        }),
        isMe: true
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSenderColor = (senderType: string) => {
    switch (senderType) {
      case "doctor":
        return "bg-blue-100 text-blue-800";
      case "therapist":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout pageTitle="提問與回覆">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex flex-col">
          {/* 聊天室標題 */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  醫療團隊溝通室
                </h2>
                <p className="text-sm text-gray-600">
                  與您的醫師和治療師即時溝通
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  ● 在線
                </span>
                <button className="p-2 hover:bg-gray-100 rounded-md">
                  <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* 訊息區域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.isMe ? "order-2" : "order-1"}`}>
                  {!message.isMe && (
                    <div className="flex items-center mb-1">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSenderColor(message.senderType)}`}>
                        {message.sender}
                      </span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.isMe
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${message.isMe ? "text-right" : "text-left"}`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 輸入區域 */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="輸入您的問題或想法..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                  <FontAwesomeIcon icon={faPaperclip} className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                  <FontAwesomeIcon icon={faSmile} className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 快速問題區域 */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">常見問題</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "今天的訓練難度如何調整？",
              "訓練時間安排有什麼建議？",
              "如何提高訓練效果？",
              "訓練中遇到困難怎麼辦？",
              "什麼時候需要休息？",
              "如何追蹤進度變化？"
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => setNewMessage(question)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
