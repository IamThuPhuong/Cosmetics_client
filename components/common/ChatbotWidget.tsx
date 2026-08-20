"use client";

import { useState } from "react";
import { Sparkles, MessageCircle, X, Send, Bot, User } from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  recommendationLink?: string;
  recommendationLabel?: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "Xin chào bạn! Mình là AI Trợ Lý Sắc Đẹp của LuxeBeauty 🌸. Mình có thể giúp bạn chọn tone màu son phù hợp với sắc tố da, tư vấn sản phẩm chăm sóc da hoặc giải đáp chính sách mua hàng!",
    },
  ]);

  const quickQuestions = [
    "💄 Da ngăm / tone ấm nên đánh màu gì?",
    "💋 Son kem lì nào lâu trôi không khô môi?",
    "🚚 Đơn hàng bao nhiêu được Freeship?",
    "🔄 Chính sách đổi trả hàng như thế nào?",
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");

    // Simulate AI response based on questions
    setTimeout(() => {
      let botResponse: ChatMessage;

      const lower = text.toLowerCase();
      if (lower.includes("da ngăm") || lower.includes("tone ấm") || lower.includes("màu gì")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Đối với làn da tone ấm hoặc hơi ngăm, bạn nên ưu tiên các màu son có sắc đất ấm áp như: Đỏ Đất (#Chili), Cam Cháy (#Taupe) hoặc Đỏ Gạch (#Marrakesh). Tránh các màu hồng cánh sen hoặc nude bợt nhé!",
          recommendationLink: "/products?keyword=Đỏ+Đất",
          recommendationLabel: "Xem các màu son Đỏ Đất & Cam Cháy ✨",
        };
      } else if (lower.includes("lâu trôi") || lower.includes("kem lì") || lower.includes("khô môi")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Dòng Son Kem Lì Velvet Lip Tint của Romand và 3CE sở hữu công nghệ phủ bột nhung mịn màng, chứa dầu bơ hữu cơ giúp giữ màu suốt 8 tiếng mà không hề gây nứt nẻ hay lộ vân môi!",
          recommendationLink: "/products?categoryId=2",
          recommendationLabel: "Xem bộ sưu tập Son Kem Lì Velvet 💄",
        };
      } else if (lower.includes("freeship") || lower.includes("vận chuyển") || lower.includes("ship")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "LuxeBeauty MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC cho mọi đơn hàng từ 500.000đ trở lên. Với đơn hàng dưới 500k, phí ship đồng giá ưu đãi là 30.000đ bạn nhé!",
        };
      } else if (lower.includes("đổi trả") || lower.includes("chính sách")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Cửa hàng hỗ trợ đổi trả miễn phí trong 7 ngày nếu sản phẩm lỗi từ nhà sản xuất hoặc bị hư hỏng trong quá trình vận chuyển. Bạn chỉ cần giữ lại hộp và hóa đơn (hoặc mã đơn hàng) để được hỗ trợ nhanh nhất!",
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: `Cảm ơn bạn đã hỏi về "${text}". Để được tư vấn chi tiết hơn về bảng màu và thông số son, bạn có thể xem danh mục sản phẩm hoặc để lại số điện thoại để chuyên viên tư vấn gọi lại nhé!`,
          recommendationLink: "/products",
          recommendationLabel: "Khám phá tất cả sản phẩm 🌸",
        };
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-3 rounded-full shadow-lg shadow-rose-300/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
          aria-label="Mở trợ lý AI"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-wide hidden sm:inline">
            AI Tư Vấn Màu Son
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-rose-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  AI Beauty Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                </h3>
                <p className="text-[11px] text-rose-100">Tư vấn sắc đẹp & màu son 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-rose-50/20 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-tr-xs"
                      : "bg-white text-gray-800 shadow-xs border border-rose-100/80 rounded-tl-xs"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.recommendationLink && (
                    <div className="mt-2.5 pt-2 border-t border-rose-100">
                      <Link
                        href={msg.recommendationLink}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
                      >
                        {msg.recommendationLabel || "Xem sản phẩm"} →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions Pills */}
          <div className="px-3 py-2 bg-white border-t border-rose-100/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200/50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-rose-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi tư vấn màu son..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-rose-600 transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
