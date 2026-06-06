import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { TypewriterText } from './TypewriterText';
import { Product } from '../types';
import { SmetikSparkLogo } from './SmetikSparkLogo';

interface SmetikAssistantProps {
  onClose: () => void;
  onSelectProductById: (productId: string) => void;
  allProducts: Product[];
  currentScreen: string;
  currentProduct?: {
    brand: string;
    name: string;
    category: string;
    description: string;
  } | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const getFormattedTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Map the user questions beautifully to the suggestion chips
const CHIP_DETAILS = [
  { label: 'Skincare', query: 'Recommend Smetik skincare formulations and care routines' },
  { label: 'Makeup', query: 'Tell me about the satin velvet hydrating makeup collections' },
  { label: 'Hair Care', query: 'What organic hair therapy products do you recommend?' },
  { label: 'Trending Products', query: 'What are the top trending luxury formulations right now?' },
  { label: 'How to Order', query: 'How do I place my beauty order directly via WhatsApp?' }
];

// Dynamically generate personalized thinking status steps matching the user's specific prompt
const generateDynamicStatuses = (text: string, products: Product[]) => {
  const query = text.toLowerCase().trim();
  
  // Find key entities in the prompt
  // 1. Check if they mentioned a specific product from our list
  const mentionedProduct = products.find(p => 
    query.includes(p.name.toLowerCase()) || 
    query.includes(p.brand.toLowerCase())
  );
  
  // 2. Check if a specific category or issue is mentioned
  let mainSubject = "Beauty Concern";
  if (query.includes("skin") || query.includes("serum") || query.includes("moisturizer") || query.includes("acne") || query.includes("dry") || query.includes("oily") || query.includes("peel") || query.includes("toner") || query.includes("cleanser") || query.includes("face")) {
    mainSubject = "Skin Care Routine";
  } else if (query.includes("makeup") || query.includes("lipstick") || query.includes("shades") || query.includes("lip") || query.includes("powder") || query.includes("foundation") || query.includes("velvet") || query.includes("color")) {
    mainSubject = "Makeup Preference";
  } else if (query.includes("hair") || query.includes("scalp") || query.includes("shampoo") || query.includes("conditioner")) {
    mainSubject = "Hair Therapy Detail";
  } else if (query.includes("order") || query.includes("buy") || query.includes("whatsapp") || query.includes("cart") || query.includes("price") || query.includes("delivery") || query.includes("shipping") || query.includes("checkout")) {
    mainSubject = "Order & Delivery Inquiry";
  }

  const steps: string[] = [];
  
  // Step 1: Analysing / Understanding
  if (mentionedProduct) {
    steps.push(`Analyzing formulation of ${mentionedProduct.name}`);
  } else {
    // Extract a couple of neat keywords from the user prompt for extreme personalization
    const cleanWords = query
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 3 && !['recommend', 'what', 'show', 'tell', 'about', 'with', 'from', 'smetik', 'please', 'need', 'some', 'good', 'best', 'your', 'have', 'more'].includes(w));
    
    if (cleanWords.length > 0) {
      const keywordsSample = cleanWords.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" & ");
      steps.push(`Understanding concerns about ${keywordsSample}`);
    } else {
      steps.push(`Refining your ${mainSubject}`);
    }
  }

  // Step 2: Product selection / collection review
  if (mentionedProduct) {
    if (mentionedProduct.ingredients) {
      steps.push(`Validating natural botanical actives`);
    } else {
      steps.push(`Reviewing key luxury ingredients`);
    }
  } else if (mainSubject === "Skin Care Routine") {
    steps.push(`Filtering through advanced skin serums`);
  } else if (mainSubject === "Makeup Preference") {
    steps.push(`Checking premium cosmetics in stock`);
  } else if (mainSubject === "Hair Therapy Detail") {
    steps.push(`Reviewing organic scalp treatments`);
  } else if (mainSubject === "Order & Delivery Inquiry") {
    steps.push(`Gathering active checkout prompts`);
  } else {
    steps.push("Detailing Smetik boutique solutions");
  }

  // Step 3: Deep Customization/Consultation
  if (mainSubject === "Skin Care Routine") {
    steps.push("Matching dermal properties & moisture levels");
  } else if (mainSubject === "Makeup Preference") {
    steps.push("Optimizing texture and pigment tone matching");
  } else if (mainSubject === "Order & Delivery Inquiry") {
    steps.push("Arranging WhatsApp routing options");
  } else if (mainSubject === "Hair Therapy Detail") {
    steps.push("Aligning hydration index and growth factors");
  } else {
    steps.push("Curating elite beauty protocols");
  }

  // Step 4: Finalizing
  steps.push("Compiling beauty consultant advice");

  return steps;
};

export const SmetikAssistant: React.FC<SmetikAssistantProps> = ({
  onClose,
  onSelectProductById,
  allProducts,
  currentScreen,
  currentProduct
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentStatusText, setCurrentStatusText] = useState('');
  const [dynamicStatuses, setDynamicStatuses] = useState<string[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Setup rotating loading status text cycle (transitions every 1.7 seconds)
  useEffect(() => {
    if (!isSending || dynamicStatuses.length === 0) {
      setCurrentStatusText('');
      return;
    }

    setCurrentStatusText(dynamicStatuses[0]);

    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % dynamicStatuses.length;
      setCurrentStatusText(dynamicStatuses[step]);
    }, 1700);

    return () => clearInterval(interval);
  }, [isSending, dynamicStatuses]);

  // Triggers smooth scrolling to bottom during chat streaming or messages update
  const triggerScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    triggerScroll();
  }, [messages, isSending, currentStatusText]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setErrorStatus(null);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: getFormattedTime()
    };

    // Dynamically generate the customized loading statuses matching this exact user prompt
    const calculatedStatuses = generateDynamicStatuses(textToSend.trim(), allProducts);
    setDynamicStatuses(calculatedStatuses);

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    const startTime = Date.now();

    try {
      const chatHistory = [...messages, userMsg].map(({ role, content }) => ({
        role,
        content
      }));

      // Fire the fetch call
      const resPromise = fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          messages: chatHistory,
          currentScreen,
          currentProduct
        })
      });

      const response = await resPromise;
      if (!response.ok) {
        throw new Error(`Server returned code ${response.status}`);
      }

      const data = await response.json();
      const rawAnswer = data.text || "Your Smetik Beauty Consultant is currently polishing advice. Please frame another question.";

      // Enforce premium pacing so the user experiences the elite consultation process
      const elapsed = Date.now() - startTime;
      const premiumMinimumDelay = 3400; // Time needed to rotate through status cards
      if (elapsed < premiumMinimumDelay) {
        await new Promise(resolve => setTimeout(resolve, premiumMinimumDelay - elapsed));
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: rawAnswer,
        timestamp: getFormattedTime()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setErrorStatus("Connection timeout. Your consultation is on hold. Tap below to retry or connect to 0714300535.");
    } finally {
      setIsSending(false);
    }
  };

  const handleApplySuggestion = (text: string) => {
    handleSendMessage(text);
  };

  // Standard inline styling formatter (bold, headings, bullets etc.)
  const parseInlineFormatting = (text: string) => {
    const parts = [];
    let remaining = text;
    while (remaining.length > 0) {
      const boldIndex = remaining.indexOf('**');
      const italicIndex = remaining.indexOf('*');
      
      if (boldIndex === -1 && italicIndex === -1) {
        parts.push(remaining);
        break;
      }
      
      if (boldIndex !== -1 && (italicIndex === -1 || boldIndex <= italicIndex)) {
        if (boldIndex > 0) {
          parts.push(remaining.slice(0, boldIndex));
        }
        const endBold = remaining.indexOf('**', boldIndex + 2);
        if (endBold !== -1) {
          const boldText = remaining.slice(boldIndex + 2, endBold);
          parts.push(
            <strong key={remaining.length + endBold} className="font-bold text-[#845EC2]">
              {boldText}
            </strong>
          );
          remaining = remaining.slice(endBold + 2);
        } else {
          parts.push(remaining.slice(boldIndex));
          break;
        }
      } else {
        if (italicIndex > 0) {
          parts.push(remaining.slice(0, italicIndex));
        }
        const endItalic = remaining.indexOf('*', italicIndex + 1);
        if (endItalic !== -1) {
          const italicText = remaining.slice(italicIndex + 1, endItalic);
          parts.push(
            <em key={remaining.length + endItalic} className="italic text-gray-500 font-medium">
              {italicText}
            </em>
          );
          remaining = remaining.slice(endItalic + 1);
        } else {
          parts.push(remaining.slice(italicIndex));
          break;
        }
      }
    }
    return <>{parts.length > 0 ? parts : text}</>;
  };

  // Convert incoming textual paragraphs to responsive semantic layouts
  const parseMarkdownText = (rawText: string) => {
    const lines = rawText.split('\n');
    return (
      <div className="flex flex-col gap-1.5 text-[#373A40] font-sans antialiased">
        {lines.map((line, idx) => {
          if (line.trim() === '---') {
            return <hr key={idx} className="my-2 border-t border-purple-100" />;
          }

          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-[12.5px] font-bold text-gray-900 mt-2 mb-0.5 flex items-center gap-1 leading-snug font-sans">
                ✨ {line.slice(4)}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-[13px] font-extrabold text-gray-900 mt-2 mb-0.5 flex items-center gap-1 leading-snug font-sans">
                {line.slice(3)}
              </h3>
            );
          }
          if (line.startsWith('# ')) {
            return (
              <h2 key={idx} className="text-sm font-extrabold text-gray-900 mt-2 mb-0.5 flex items-center gap-1 leading-snug font-sans">
                {line.slice(2)}
              </h2>
            );
          }

          // Lists
          let isBullet = false;
          let bulletContent = line;
          if (line.trim().startsWith('* ')) {
            isBullet = true;
            bulletContent = line.trim().slice(2);
          } else if (line.trim().startsWith('- ')) {
            isBullet = true;
            bulletContent = line.trim().slice(2);
          } else if (/^\d+\.\s/.test(line.trim())) {
            const match = line.trim().match(/^(\d+\.)\s(.*)/);
            if (match) {
              return (
                <div key={idx} className="flex gap-2 ml-1 mt-0.5 mb-0.5 font-sans">
                  <span className="text-[#845EC2] font-bold text-xs shrink-0">{match[1]}</span>
                  <span className="text-xs text-[#373a40] leading-relaxed font-semibold">{parseInlineFormatting(match[2])}</span>
                </div>
              );
            }
          }

          if (isBullet) {
            return (
              <div key={idx} className="flex gap-2 ml-2 mt-0.5 mb-0.5 font-sans">
                <span className="text-[#845EC2] text-xs shrink-0 select-none">•</span>
                <span className="text-xs text-[#373a40] leading-relaxed font-semibold">{parseInlineFormatting(bulletContent)}</span>
              </div>
            );
          }

          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          return (
            <p key={idx} className="text-xs text-[#373a40] leading-relaxed font-semibold my-0.5 font-sans">
              {parseInlineFormatting(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Automatic semantic indexing to recommend boutique assets dynamically to the client
  const renderMessageContent = (msg: Message, isLatestAssistant: boolean) => {
    if (msg.role === 'user') {
      return (
        <p className="text-xs font-semibold leading-relaxed font-sans">{msg.content}</p>
      );
    }

    // Smart string indexing to look for recommended product names in the AI reply
    const words = msg.content.toLowerCase();
    const detectedProducts = allProducts.filter(p => 
      words.includes(p.name.toLowerCase()) ||
      words.includes(p.name.split(' ').slice(0, 3).join(' ').toLowerCase())
    ).slice(0, 2);

    return (
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold leading-relaxed text-gray-700 font-sans">
          {isLatestAssistant ? (
            <TypewriterText 
              text={msg.content} 
              onUpdate={triggerScroll} 
              render={(typedTxt) => parseMarkdownText(typedTxt)}
            />
          ) : (
            parseMarkdownText(msg.content)
          )}
        </div>
        
        {/* Dynamic Compact Product Recommendation Cards */}
        {detectedProducts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-purple-50 flex flex-col gap-2 bg-[#FBF9FF] p-2.5 rounded-xl border border-purple-100/40 animate-fade-in shadow-xs">
            <span className="text-[9px] font-bold text-[#845EC2] uppercase tracking-wider block leading-none">
              ✨ Recommended Formulation
            </span>
            <div className="flex flex-col gap-2 mt-1">
              {detectedProducts.map(p => (
                <div 
                  key={p.id} 
                  className="flex gap-2.5 p-2 bg-white border border-purple-100/50 rounded-xl hover:shadow-xs transition-shadow duration-200"
                >
                  <img 
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=150'} 
                    alt={p.name} 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover border border-purple-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wide truncate max-w-[80px]">
                          {p.category}
                        </span>
                        <span className="text-[10.5px] font-bold text-[#845EC2]">
                          {p.price.toLocaleString()} TZS
                        </span>
                      </div>
                      <h5 className="text-[11px] font-bold text-gray-800 tracking-tight leading-snug truncate mt-0.5">
                        {p.name}
                      </h5>
                    </div>
                    <button
                      onClick={() => {
                        onSelectProductById(p.id);
                        onClose();
                      }}
                      className="self-start mt-1.5 px-3 py-1 bg-[#845EC2] text-white hover:bg-[#724cb1] active:scale-95 transition-all text-[9px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      📦 View Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      id="smetik-ai-assistant-overlay" 
      className="absolute inset-0 bg-[#FAF9FC] z-50 flex flex-col animate-fade-in text-gray-800"
    >
      {/* 5. FIXED BOUTIQUE CONSULTING HEADER */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-purple-100/25 flex items-center justify-between shadow-[0_1px_2px_rgba(132,94,194,0.03)]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-50 to-white border border-[#845EC2]/25 flex items-center justify-center shadow-2xs">
              <SmetikSparkLogo size={24} />
            </div>
            {/* Pulsing Status Dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-soft animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[13px] font-brand font-medium text-gray-900 tracking-tight leading-normal">
              Smetik Assistant
            </h3>
            <span className="text-[9.5px] text-gray-500 font-semibold tracking-tight mt-0.5 flex items-center gap-1 leading-none">
              AI Beauty & Personal Care Consultant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Animated pulsing 'Available' tag */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100/50 animate-pulse">
            Available
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-transform hover:scale-105 active:scale-90 shadow-2xs"
            aria-label="Close Assistant"
          >
            <X size={15} />
          </button>
        </div>
      </header>

      {/* 4. MAIN CONSULTATION MESSAGES SPACE */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5 bg-gradient-to-b from-[#FCFBFD] via-[#FCFCFF] to-[#FAF9FC] h-full"
      >
        
        {/* 6. WELCOME SCREEN CARD (Renders statically when chat is empty or starting out) */}
        {messages.length === 0 && (
          <div className="p-5 bg-white border border-purple-100 rounded-2xl shadow-xs text-gray-800 flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-50 to-white border border-[#845EC2]/25 flex items-center justify-center shadow-2xs shrink-0">
                <SmetikSparkLogo size={26} />
              </div>
              <div>
                <h4 className="text-[13.5px] font-brand font-medium text-gray-950 leading-tight">Smetik Assistant</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-0.5">Your personal beauty and skincare helper.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-purple-50 pt-3">
              <p className="text-[10px] font-bold text-[#845EC2] uppercase tracking-wider select-none leading-none mb-1.5">I can help you:</p>
              <ul className="space-y-2 text-gray-700 font-semibold text-[11.5px]">
                <li className="flex items-start gap-2">
                  <span className="text-[#845EC2] text-xs leading-none mt-0.5 select-none">•</span>
                  <span>Discover premium products tailored to your preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#845EC2] text-xs leading-none mt-0.5 select-none">•</span>
                  <span>Find customized dermatological skincare solutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#845EC2] text-xs leading-none mt-0.5 select-none">•</span>
                  <span>Explore organic, satin velvet makeup collections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#845EC2] text-xs leading-none mt-0.5 select-none">•</span>
                  <span>Learn how the interactive boutique app layout works</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#845EC2] text-xs leading-none mt-0.5 select-none">•</span>
                  <span>Complete instant orders easily through WhatsApp</span>
                </li>
              </ul>
            </div>

            {/* Micro client specs showcase */}
            <div className="text-[10px] text-gray-400 border-t border-purple-50 pt-2.5 flex items-center justify-between font-mono">
              <span className="font-semibold">User Role: <span className="text-[#845EC2] font-bold">{localStorage.getItem('smetik_user_role') || 'Guest Shopper'}</span></span>
              <span className="font-semibold">Skin Type: <span className="text-[#845EC2] font-bold">{localStorage.getItem('smetik_skin_type') || 'Oily'}</span></span>
            </div>
          </div>
        )}

        {/* MESSAGES LIST */}
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex flex-col w-full max-w-[85%] ${
              msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            {/* Bubble Layout & Soft styling matching user alignment */}
            <div
              className={`py-3 px-3.5 pb-4 md:pb-4.5 rounded-2xl relative shadow-xs animate-slide-up transition-all ${
                msg.role === 'user'
                  ? 'bg-[#845EC2] text-white rounded-tr-none border border-[#724cb1] shadow-md shadow-[#845EC2]/10'
                  : 'bg-white text-gray-800 border border-purple-100/30 rounded-tl-none'
              }`}
            >
              {renderMessageContent(msg, index === messages.length - 1 && msg.role === 'assistant')}
              
              {/* Timestamp inside the bubble bottom right */}
              <span className={`absolute bottom-1 right-2.5 text-[8.5px] font-bold tracking-tight select-none ${
                msg.role === 'user' ? 'text-white/60' : 'text-gray-400'
              }`}>
                {msg.timestamp || getFormattedTime()}
              </span>
            </div>

            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 px-1 select-none flex items-center gap-1.5">
              <span>{msg.role === 'user' ? 'You' : 'Smetik Assistant'}</span>
            </span>
          </div>
        ))}

        {/* 1. Rotational Loader Step Simulation */}
        {isSending && (
          <div className="self-start max-w-[85%] flex flex-col gap-1 animate-slide-up">
            <div className="py-2.5 px-3.5 bg-white border border-purple-100/50 rounded-2xl rounded-tl-none shadow-soft flex items-center">
              <span className="text-[11.5px] font-bold text-[#845EC2] font-sans tracking-wide">
                {currentStatusText}
                <span className="inline-flex text-[#845EC2] ml-0.5">
                  <span className="animate-[pulse_1.2s_infinite_0s] opacity-30 select-none">.</span>
                  <span className="animate-[pulse_1.2s_infinite_0.3s] opacity-30 select-none">.</span>
                  <span className="animate-[pulse_1.2s_infinite_0.6s] opacity-30 select-none">.</span>
                </span>
              </span>
            </div>
            <span className="text-[7.5px] font-bold text-gray-400 tracking-widest px-1 select-none flex items-center gap-1 font-sans">
              <Sparkles size={8} className="animate-spin text-purple-400" /> Analyzing Beauty Profile...
            </span>
          </div>
        )}

        {/* Fault handling */}
        {errorStatus && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 flex flex-col gap-2.5 animate-bounce">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 text-rose-500 shrink-0" />
              <span className="text-[10px] font-extrabold tracking-tight leading-normal uppercase">
                {errorStatus}
              </span>
            </div>
            <button
              onClick={() => {
                const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                if (lastUserMsg) {
                  handleSendMessage(lastUserMsg.content);
                } else {
                  setErrorStatus(null);
                }
              }}
              className="self-end px-3 py-1 bg-white border border-rose-200 text-[#845EC2] hover:bg-rose-100/50 text-[9px] font-extrabold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <RefreshCw size={9} />
              Retry Question
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SUGGESTION CHIPS ROW (Sticky above input) */}
      <div className="px-4 py-2.5 shrink-0 bg-white border-t border-purple-50">
        <span className="text-[8px] font-bold text-[#845EC2] uppercase tracking-widest block mb-2 select-none leading-none">
          How can I help you today?
        </span>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CHIP_DETAILS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleApplySuggestion(chip.query)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-purple-50/50 to-white border border-purple-100/40 text-gray-650 hover:border-[#845EC2] hover:text-[#845EC2] rounded-full text-[10px] font-bold whitespace-nowrap active:scale-95 transition-all cursor-pointer shadow-soft shrink-0"
            >
              💄 {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT DRAWER FOOTER */}
      <div className="p-3 border-t border-purple-50 bg-white flex items-center gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask Smetik beauty consultant anything..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSendMessage(inputValue)}
          className="flex-1 bg-slate-50/70 text-xs py-2.5 px-3.5 rounded-xl border border-slate-150 focus:outline-none focus:border-[#845EC2] focus:bg-white text-gray-800 font-sans font-medium transition-all"
          disabled={isSending}
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          disabled={isSending || !inputValue.trim()}
          className="w-10 h-10 rounded-xl text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0 shadow-md shadow-[#845EC2]/20"
          style={{ backgroundColor: '#845EC2' }}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};
