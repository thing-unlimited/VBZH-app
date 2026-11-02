import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Minimize2,
  Maximize2,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';
import { Property } from '../types/rental';

interface ChatMessage {
  id: string;
  sender: 'host' | 'user';
  text: string;
  timestamp: string;
}

interface ChatBoxProps {
  property: Property;
  onOpenBooking?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'host',
    text: "Hello! Welcome to Tulip Studio at Chic's Beach (4709 Tulip Dr, Virginia Beach). I'm Yulin Liao, your host. How can I help you today? Ask me anything about our two queen beds, 460 Mbps nomad Wi-Fi, check-in, or walking to the beach!",
    timestamp: 'Just now',
  },
];

const SUGGESTED_QUESTIONS = [
  '🕒 Check-in & Checkout times',
  '🔑 Keypad door lock instructions',
  '📶 Wi-Fi password & speed test',
  '🏖 How to walk to Chic\'s Beach?',
  '🚗 Is free parking available?',
  '🛏 Are there two queen beds?',
  '☕ Kitchen & coffee setup',
  '📞 Host Yulin Liao phone number',
];

export const ChatBox: React.FC<ChatBoxProps> = ({ property, onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('tulip_chatbox_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_MESSAGES;
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem('tulip_chatbox_messages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsMinimized(false);
      setUnreadCount(0);
    };
    window.addEventListener('open-chatbox', handleOpenChat);
    return () => window.removeEventListener('open-chatbox', handleOpenChat);
  }, []);

  // Knowledge base matcher for instant reliable answers
  const generateKnowledgeAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('chinese') || q.includes('中文') || q.includes('你好') || q.includes('房东') || q.includes('电话') || q.includes('在哪') || q.includes('入住')) {
      if (q.includes('电话') || q.includes('联系') || q.includes('phone')) {
        return `房东 Yulin Liao 的直接联系电话是：(757) 735-1024。如有紧急情况或特殊需求，欢迎随时致电或发短信！`;
      }
      if (q.includes('海滩') || q.includes('beach') || q.includes('多远')) {
        return `从 4709 Tulip Dr 出发，步行仅需 5 分钟（约 0.25 英里）即可抵达著名的 Chic's Beach（切萨皮克湾）。这里风浪平缓，沙质细腻，傍晚还能欣赏到绝美日落和海豚！`;
      }
      if (q.includes('wifi') || q.includes('网络') || q.includes('网速') || q.includes('密码')) {
        return `我们配备了 460+ Mbps 超高速光纤无线网络，并提供专业实木办公桌、人体工学椅与 4K 外接显示器，非常适合远程办公与数字游民（Digital Nomads）。Wi-Fi 密码将在确认预订后与入住门锁密码一并发送给您。`;
      }
      if (q.includes('床') || q.includes('queen') || q.includes('睡') || q.includes('住几人')) {
        return `Tulip Studio 配备了两张高品质舒适 Queen 大床，均采用高级混合床垫与亲肤床品，最多可容纳 4 位房客入住，非常适合家庭或朋友同行。每晚基础价格仅 $98。`;
      }
      if (q.includes('入住') || q.includes('退房') || q.includes('check')) {
        return `【入住时间】下午 3:00 开始；【退房时间】上午 11:00。采用智能电子密码锁自助入住，入住前我们会发送专属 6 位开门 PIN 码，无须钥匙，安全便捷！`;
      }
      if (q.includes('停车') || q.includes('parking') || q.includes('车位')) {
        return `是的！工作室门前提供免费专属私家车位（Driveway Parking），房客可免费停放车辆，无需街边找车位。`;
      }
      return `您好！欢迎入住 4709 Tulip Dr 的 Tulip Studio。这里距离 Chic's Beach 仅 5 分钟步行路程，配备两张舒适 Queen 床、460 Mbps 光纤办公区与独立厨房卫浴。房东 Yulin Liao 电话：(757) 735-1024。请问还有什么能为您效劳？`;
    }

    // English queries
    if (q.includes('check-in') || q.includes('check in') || q.includes('checkout') || q.includes('check out') || q.includes('hours') || q.includes('time')) {
      return `🕒 **Check-In & Check-Out Times:**\n• **Check-in:** Anytime after 3:00 PM\n• **Check-out:** By 11:00 AM\n\nWe provide seamless 24/7 self check-in via a digital keypad on the front door. You'll receive your unique 6-digit access PIN before arrival!`;
    }

    if (q.includes('keypad') || q.includes('lock') || q.includes('door') || q.includes('code') || q.includes('access')) {
      return `🔑 **Smart Keypad Access:**\nTo unlock, touch the keypad to activate, enter your 6-digit door PIN, and press the Check/Lock icon. The deadbolt will unlock automatically. To lock upon leaving, simply press the lock icon on the keypad.`;
    }

    if (q.includes('wifi') || q.includes('wi-fi') || q.includes('internet') || q.includes('speed') || q.includes('password') || q.includes('nomad')) {
      return `📶 **High-Speed Fiber Wi-Fi:**\nWe have blazing-fast **460+ Mbps download / 380+ Mbps upload** fiber mesh internet. The studio also features a dedicated solid wood desk, ergonomic chair, and 4K external monitor link. Network details and password will be provided in your check-in pass.`;
    }

    if (q.includes('beach') || q.includes('chic') || q.includes('distance') || q.includes('ocean') || q.includes('bay') || q.includes('walk')) {
      return `🏖 **Chic's Beach Proximity:**\n4709 Tulip Dr is just a **5-minute stroll (approx. 0.25 miles)** to Chic's Beach on the Chesapeake Bay. Unlike the crowded oceanfront boardwalk, Chic's Beach features calm gentle waters, scenic sand dunes, spectacular sunsets, and frequent dolphin sightings!`;
    }

    if (q.includes('parking') || q.includes('car') || q.includes('driveway')) {
      return `🚗 **Free Parking:**\nYes! Free dedicated off-street driveway parking is available directly in front of the studio suite. You can pull straight in without any street parking hassles.`;
    }

    if (q.includes('bed') || q.includes('sleep') || q.includes('guests') || q.includes('queen') || q.includes('people')) {
      return `🛏 **Sleeping Accommodations:**\nThe studio is outfitted with **two plush queen beds** featuring premium hybrid mattresses, hypoallergenic pillows, and crisp coastal linens. The studio comfortably accommodates up to 4 guests. Nightly base rate is $98/night.`;
    }

    if (q.includes('kitchen') || q.includes('cook') || q.includes('coffee') || q.includes('refrigerator') || q.includes('stove')) {
      return `☕ **Private Kitchen Amenities:**\nYes, you have your own private full kitchen! It includes an electric range, oven, microwave, full-size refrigerator/freezer, cookware, dishware, and a Chemex pour-over coffee station with local roasted coffee beans.`;
    }

    if (q.includes('bathroom') || q.includes('shower') || q.includes('towel') || q.includes('soap')) {
      return `🚿 **Private Bathroom:**\nIncludes a sparkling clean walk-in glass shower with white subway tiles, plush Turkish cotton bath towels, a hair dryer, and organic botanical shampoo, conditioner, and body wash.`;
    }

    if (q.includes('phone') || q.includes('number') || q.includes('contact') || q.includes('call') || q.includes('yulin') || q.includes('host')) {
      return `📞 **Host Contact Information:**\nHost **Yulin Liao** is available directly at **(757) 735-1024** (call or text). You can also email liaoyulin0@gmail.com for non-urgent inquiries.`;
    }

    if (q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('how much') || q.includes('$')) {
      return `💵 **Pricing & Rates:**\nThe standard rate is **$98 per night**, with a $45 cleaning fee and standard Virginia Beach local hospitality tax. There are no surprise hidden fees!`;
    }

    if (q.includes('pet') || q.includes('dog') || q.includes('cat')) {
      return `🐾 **Pet Policy:**\nQuiet, well-behaved pets may be considered with prior host approval and a small pet fee. Please message or call Yulin Liao at (757) 735-1024 before booking if traveling with pets!`;
    }

    if (q.includes('food') || q.includes('restaurant') || q.includes('eat') || q.includes('drink') || q.includes('brewery')) {
      return `🍽 **Local Dining Recommendations within 5-10 min:**\n• **Green Flash Cafe** (3 min walk) - Great breakfast and acai bowls\n• **HK on the Bay** (8 min walk) - Fresh local seafood, craft cocktails & burgers\n• **Pleasure House Brewing** (4 min drive) - Local neighborhood brewery\n• **First Landing State Park** (7 min drive) - Nature trails and beaches`;
    }

    // Default polite comprehensive response
    return `Thank you for asking! Tulip Studio at 4709 Tulip Dr is a cozy 1-bedroom studio in Virginia Beach, just 5 minutes from Chic's Beach. It includes two queen beds ($98/night), private kitchen, 460 Mbps nomad Wi-Fi, full bathroom, and free driveway parking. \n\nFor immediate host assistance, call or text Yulin Liao at (757) 735-1024. Would you like help with dates or booking?`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate natural response latency
    setTimeout(() => {
      const answer = generateKnowledgeAnswer(text);
      const hostMsg: ChatMessage = {
        id: `host-${Date.now()}`,
        sender: 'host',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, hostMsg]);
      setIsTyping(false);

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 700);
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem('tulip_chatbox_messages');
  };

  const handleToggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setUnreadCount(0);
        setIsMinimized(false);
      }
      return next;
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end print:hidden">
      {/* Floating Chat Trigger Button when closed */}
      {!isOpen && (
        <div className="relative group">
          <button
            onClick={handleToggleOpen}
            className="flex items-center gap-2.5 px-4 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/20"
            title="Open Chatbox with Host & Concierge"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-amber-800 animate-pulse" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                <span>Chat with Host Yulin</span>
                <span className="text-[10px] bg-amber-950/60 px-1.5 py-0.2 rounded font-normal">
                  Online
                </span>
              </div>
              <div className="text-[10px] text-amber-200 leading-tight">
                24/7 Guest Concierge
              </div>
            </div>
          </button>

          {/* Unread badge if any */}
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -left-1.5 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </div>
      )}

      {/* Active Chatbox Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col transition-all duration-300 w-[92vw] sm:w-[380px] ${
            isMinimized ? 'h-[64px]' : 'h-[530px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between shrink-0 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-900 font-bold text-sm shadow-inner">
                  YL
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-stone-900" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Yulin Liao</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> Superhost
                  </span>
                </div>
                <div className="text-[10px] text-stone-300 flex items-center gap-1">
                  <span>4709 Tulip Dr · Typically replies in seconds</span>
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1 text-stone-300">
              <a
                href="tel:7577351024"
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                title="Call Host: (757) 735-1024"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </a>
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title={isMinimized ? 'Expand Chatbox' : 'Minimize Chatbox'}
              >
                {isMinimized ? (
                  <Maximize2 className="w-3.5 h-3.5" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={handleToggleOpen}
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Close Chatbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          {!isMinimized && (
            <div className="bg-amber-50/90 px-3 py-1.5 border-b border-amber-200/60 text-[11px] text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-1 truncate">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Call or Text: <strong className="font-semibold">(757) 735-1024</strong></span>
              </span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-[10px] text-amber-800/70 hover:text-rose-700 underline shrink-0 cursor-pointer"
                title="Clear conversation"
              >
                Clear
              </button>
            </div>
          )}

          {/* Messages Scroll Area */}
          {!isMinimized && (
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-stone-50/60 text-xs">
              {messages.map((m) => {
                const isHost = m.sender === 'host';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isHost ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-end gap-1.5 max-w-[85%]">
                      {isHost && (
                        <div className="w-6 h-6 rounded-full bg-amber-800 text-white text-[10px] flex items-center justify-center font-bold shrink-0 mb-1">
                          YL
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                          isHost
                            ? 'bg-white text-stone-800 rounded-bl-xs border border-stone-200 shadow-2xs'
                            : 'bg-amber-800 text-white rounded-br-xs shadow-2xs'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                    <span className="text-[9px] text-stone-400 mt-1 px-1">
                      {m.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-amber-800 text-white text-[10px] flex items-center justify-center font-bold">
                    YL
                  </div>
                  <div className="p-2.5 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-amber-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-amber-700 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Suggested Quick Prompt Chips */}
          {!isMinimized && (
            <div className="p-2 bg-white border-t border-stone-100 flex gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 hover:border-amber-300 rounded-full text-stone-700 shrink-0 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Footer */}
          {!isMinimized && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder="Ask Yulin (check-in, Wi-Fi, beach, beds...)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-800 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
