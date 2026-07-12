/**
 * VLOOP Universal AI Assistant Component
 * Phase 6 — AI Intelligence Layer
 *
 * A chat-based AI assistant interface that can be embedded anywhere in the app.
 * Supports multiple assistant types: universal, shopping, learning, merchant, services.
 */

import { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShoppingBag,
  GraduationCap,
  Store,
  Zap,
  Mic,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Minimize2,
  Maximize2,
  CircleDot,
} from 'lucide-react';
import {
  AI_ASSISTANT_TYPES,
  AI_ASSISTANT_LABELS,
  type AIAssistantType,
  type AIMessage,
  getAssistantColor,
  getAssistantIcon,
  getIntentLabel,
  formatConfidence,
  getMockMessages,
} from '../lib/AIIntelligenceEngine';

interface AIAssistantProps {
  assistantType?: AIAssistantType;
  contextData?: Record<string, unknown>;
  onIntentDetected?: (intent: string, confidence: number) => void;
  onProductClick?: (productId: string) => void;
  onClose?: () => void;
  className?: string;
}

export default function AIAssistant({
  assistantType = 'universal',
  contextData,
  onIntentDetected,
  onProductClick,
  onClose,
  className = '',
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId] = useState(`sess-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load mock messages for preview
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const mockMsgs = getMockMessages();
      setMessages(mockMsgs);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setInputValue('');
    }
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
    onClose?.();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: 'conv1',
      role: 'user',
      message_type: 'text',
      content: inputValue.trim(),
      metadata: null,
      is_helpful: null,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (in production, this would call the AI backend)
    setTimeout(() => {
      const response = generateAIResponse(userMessage.content, assistantType);
      const aiMessage: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        conversation_id: 'conv1',
        role: 'assistant',
        message_type: response.type,
        content: response.content,
        metadata: response.metadata || null,
        is_helpful: null,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      if (onIntentDetected && response.intent) {
        onIntentDetected(response.intent, response.confidence || 0.9);
      }
    }, 800 + Math.random() * 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeedback = (messageId: string, isHelpful: boolean) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, is_helpful: isHelpful } : msg
      )
    );
  };

  const handleProductClick = (productId: string) => {
    onProductClick?.(productId);
  };

  const getAssistantIconComponent = () => {
    switch (assistantType) {
      case 'shopping': return ShoppingBag;
      case 'learning': return GraduationCap;
      case 'merchant': return Store;
      case 'essential_services': return Zap;
      case 'voice': return Mic;
      default: return Bot;
    }
  };

  const IconComponent = getAssistantIconComponent();
  const gradientClass = getAssistantColor(assistantType);

  return (
    <div className={`fixed z-50 ${className}`}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpenToggle}
          className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradientClass} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group`}
        >
          <IconComponent className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'fixed inset-4 md:inset-8 max-w-none'
              : 'w-80 sm:w-96 h-[28rem]'
          }`}
        >
          {/* Header */}
          <div className={`bg-gradient-to-br ${gradientClass} px-4 py-3 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  {AI_ASSISTANT_LABELS[assistantType]}
                </h3>
                <div className="flex items-center gap-1.5">
                  <CircleDot className="w-3 h-3 text-emerald-300 fill-emerald-300" />
                  <span className="text-white/80 text-xs">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleExpandToggle}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4 text-white" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 ${isExpanded ? 'h-[calc(100%-8rem)]' : 'h-80'}`}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Sparkles className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-medium">Hi! I'm your AI Assistant</p>
                <p className="text-xs text-slate-400 mt-1">Ask me anything about VLOOP</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl rounded-br-md'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-bl-md shadow-sm'
                  } px-4 py-2.5`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {/* Product Recommendations */}
                  {message.message_type === 'product_recommendation' &&
                    !!message.metadata?.products && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(message.metadata.products as string[]).map((productId) => (
                          <button
                            key={productId}
                            onClick={() => handleProductClick(productId)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors border border-blue-200"
                          >
                            View Product
                          </button>
                        ))}
                      </div>
                    )}

                  {/* Feedback for AI messages */}
                  {message.role === 'assistant' && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {message.is_helpful === null ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleFeedback(message.id, true)}
                            className="p-1 rounded hover:bg-emerald-50 transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-500" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, false)}
                            className="p-1 rounded hover:bg-red-50 transition-colors"
                          >
                            <ThumbsDown className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {message.is_helpful ? 'Helpful' : 'Not helpful'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white">
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {getQuickActions(assistantType).map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputValue(action.text)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-medium text-slate-600 whitespace-nowrap transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="px-4 pb-4 pt-2 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2.5 pr-10 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {assistantType === 'voice' && (
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                    <Mic className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`p-2.5 rounded-xl bg-gradient-to-br ${gradientClass} text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// Helper function to generate mock AI responses
function generateAIResponse(
  userMessage: string,
  assistantType: AIAssistantType
): {
  content: string;
  type: string;
  intent?: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
} {
  const lowerMessage = userMessage.toLowerCase();

  if (assistantType === 'shopping') {
    if (lowerMessage.includes('deal') || lowerMessage.includes('offer')) {
      return {
        content: "Great question! Here are today's top deals:\n\n1. Electronics Flash Sale - Up to 50% off\n2. Grocery BOGO - Buy 1 Get 1 Free\n3. Free delivery on orders above ₹500\n\nWould you like me to show you products from any specific category?",
        type: 'product_recommendation',
        intent: 'deal_hunting',
        confidence: 0.92,
        metadata: { products: ['p1', 'p2', 'p3'] },
      };
    }
    if (lowerMessage.includes('product') || lowerMessage.includes('search')) {
      return {
        content: "I found several products matching your search. Here are the top recommendations based on your preferences and ratings from other users. Would you like more details on any of these?",
        type: 'product_recommendation',
        intent: 'product_search',
        confidence: 0.88,
        metadata: { products: ['p4', 'p5'] },
      };
    }
  }

  if (assistantType === 'learning') {
    if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
      return {
        content: "I can help you prepare for quizzes! Based on your learning progress, I recommend focusing on:\n\n1. SmartPoints Earning Rules (you scored 75% last time)\n2. Trust Score Factors (new topic)\n\nWould you like me to create a practice quiz for you?",
        type: 'learning_path',
        intent: 'learning_path',
        confidence: 0.94,
      };
    }
    if (lowerMessage.includes('video') || lowerMessage.includes('learn')) {
      return {
        content: "Based on your learning style (visual), I recommend watching our new video series on the VLOOP Ecosystem. It covers:\n\n- How SmartPoints work\n- Trust Score explained\n- Care Club participation\n\nDuration: 15 minutes total",
        type: 'learning_path',
        intent: 'learning_path',
        confidence: 0.91,
      };
    }
  }

  if (assistantType === 'essential_services') {
    if (lowerMessage.includes('bill') || lowerMessage.includes('pay')) {
      return {
        content: "I can help you pay your bills! Here are your recent services:\n\n1. Electricity - Last paid 25 days ago\n2. Mobile Recharge - Due in 3 days\n3. Broadband - Active\n\nWhich bill would you like to pay? You'll earn 5 SmartPoints per transaction!",
        type: 'service_suggestion',
        intent: 'service_payment',
        confidence: 0.89,
      };
    }
  }

  // Universal assistant responses
  if (lowerMessage.includes('smartpoint') || lowerMessage.includes('point')) {
    return {
      content: "SmartPoints are VLOOP's reward currency! Here's how you can earn them:\n\n- Marketplace purchases: 1 SP per ₹4 spent\n- Daily login: 5 SP\n- Knowledge quizzes: 20 SP per pass\n- Care Club contributions: 5 SP per ₹10\n\nSmartPoints can ONLY be earned - never purchased!",
      type: 'text',
      intent: 'smartcode_help',
      confidence: 0.95,
    };
  }

  if (lowerMessage.includes('trust score') || lowerMessage.includes('trust')) {
    return {
      content: "Your Trust Score is based on several factors:\n\n- Account age and activity consistency\n- Verification level\n- Transaction history\n- Community participation\n\nYour current Trust Score helps determine your weekly rewards eligibility. Want me to show you how to improve it?",
      type: 'text',
      intent: 'smartcode_help',
      confidence: 0.92,
    };
  }

  // Default response
  return {
    content: "I'm here to help! You can ask me about:\n\n- Products and deals\n- SmartPoints and rewards\n- Bill payments and services\n- Learning paths and quizzes\n- Your account and Trust Score\n\nWhat would you like to know?",
    type: 'text',
    confidence: 0.85,
  };
}

// Helper function to get quick actions based on assistant type
function getQuickActions(assistantType: AIAssistantType): { label: string; text: string }[] {
  switch (assistantType) {
    case 'shopping':
      return [
        { label: 'Show deals', text: 'Show me the best deals today' },
        { label: 'Electronics', text: 'Find electronics under ₹5000' },
        { label: 'Trending', text: 'What are trending products?' },
      ];
    case 'learning':
      return [
        { label: 'Start quiz', text: 'I want to take a quiz' },
        { label: 'My progress', text: 'Show my learning progress' },
        { label: 'Videos', text: 'Recommend videos for me' },
      ];
    case 'essential_services':
      return [
        { label: 'Pay bills', text: 'Help me pay my bills' },
        { label: 'Electricity', text: 'Pay electricity bill' },
        { label: 'Mobile', text: 'Recharge my mobile' },
      ];
    case 'merchant':
      return [
        { label: 'Insights', text: 'Show my store insights' },
        { label: 'Analytics', text: 'How is my store performing?' },
        { label: 'Tips', text: 'Give me selling tips' },
      ];
    default:
      return [
        { label: 'SmartPoints', text: 'How do I earn SmartPoints?' },
        { label: 'Trust Score', text: 'Explain Trust Score' },
        { label: 'Help', text: 'What can you help with?' },
      ];
  }
}

// Mini version for embedding in pages
export function AIAssistantMini({
  assistantType = 'universal',
  onOpenFull,
}: {
  assistantType?: AIAssistantType;
  onOpenFull?: () => void;
}) {
  const IconComponent = assistantType === 'shopping'
    ? ShoppingBag
    : assistantType === 'learning'
    ? GraduationCap
    : assistantType === 'essential_services'
    ? Zap
    : Bot;

  return (
    <button
      onClick={onOpenFull}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white shadow-sm hover:shadow-md transition-all"
    >
      <Sparkles className="w-4 h-4" />
      <span className="text-sm font-medium">Ask AI</span>
      <IconComponent className="w-4 h-4" />
    </button>
  );
}

// Context helpers for different pages
export function ShoppingAIAssistant({ onProductClick }: { onProductClick?: (productId: string) => void }) {
  return (
    <AIAssistant
      assistantType="shopping"
      onProductClick={onProductClick}
      className="bottom-24 right-6"
    />
  );
}

export function LearningAIAssistant() {
  return (
    <AIAssistant
      assistantType="learning"
      className="bottom-24 right-6"
    />
  );
}

export function ServicesAIAssistant() {
  return (
    <AIAssistant
      assistantType="essential_services"
      className="bottom-24 right-6"
    />
  );
}

export function MerchantAIAssistant() {
  return (
    <AIAssistant
      assistantType="merchant"
      className="bottom-24 right-6"
    />
  );
}
