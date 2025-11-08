import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Send, Home, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const BuildBot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey 👋, I'm BuildBot! I can help explain your construction estimates, material choices, and answer any building questions. What would you like to know?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");

  const suggestedQuestions = [
    "What's RCC?",
    "How to reduce costs?",
    "Material alternatives?",
    "Timeline estimate?",
  ];

  const getBotResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    if (q.includes("rcc") || q.includes("reinforced")) {
      return "RCC stands for Reinforced Cement Concrete. It's concrete strengthened with steel bars (rebars). The steel handles tension while concrete handles compression, making structures strong and durable. Used in beams, columns, and slabs. 🏗️";
    }
    if (q.includes("reduce") || q.includes("cost") || q.includes("save")) {
      return "Here are 3 ways to reduce costs:\n\n1. 🧱 Use fly-ash bricks instead of red bricks (saves 10-15%)\n2. 📦 Buy materials in bulk during off-season (May-July)\n3. 🚚 Source locally to cut transportation costs by 8-12%\n\nWould you like more tips?";
    }
    if (q.includes("material") || q.includes("alternative")) {
      return "Common alternatives:\n\n• Bricks → Fly-ash bricks (eco-friendly, cheaper)\n• River sand → M-sand (manufactured sand, sustainable)\n• Marble → Vitrified tiles (lower maintenance)\n• Wood → WPC (wood-plastic composite, termite-free)\n\nWhich material interests you?";
    }
    if (q.includes("timeline") || q.includes("how long") || q.includes("duration")) {
      return "Construction timeline depends on area:\n\n• 1000 sq.ft: 5-7 months\n• 1500 sq.ft: 7-10 months\n• 2000 sq.ft: 10-12 months\n• 2500+ sq.ft: 12-15 months\n\nThis includes foundation, structure, finishing, and curing. Weather and labor availability affect timelines. ⏱️";
    }
    if (q.includes("cement") || q.includes("bags")) {
      return "Cement calculation:\n• 1 bag = 50kg\n• Standard usage: 0.4 bags per sq.ft\n• For 1500 sq.ft: ~600 bags\n\nPopular brands: UltraTech, ACC, Ambuja. Store in dry place, use within 90 days. 🏗️";
    }
    if (q.includes("steel") || q.includes("tmt")) {
      return "Steel (TMT bars) info:\n• Required: 4-5 kg per sq.ft\n• Grades: Fe415, Fe500, Fe550\n• TMT = Thermo-Mechanically Treated\n• Benefits: Earthquake resistant, high strength, corrosion resistant\n\nAlways buy ISI certified bars. 🔩";
    }
    
    return "I'm learning more every day! 🤖 Could you rephrase that? Or ask about:\n• Materials (cement, steel, bricks)\n• Cost reduction\n• Construction timeline\n• RCC and structural elements\n• Quality comparisons";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(input),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);

    setInput("");
  };

  const handleSuggestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-secondary-light text-secondary-foreground py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-secondary-foreground/10 rounded-full p-2">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">BuildBot 🤖</h1>
                <p className="text-sm opacity-90">Your construction assistant</p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate("/")}
              className="bg-secondary-foreground/10 hover:bg-secondary-foreground/20"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground card-soft"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-secondary" />
                      <span className="font-semibold text-sm">BuildBot</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <div className="my-4">
            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Quick questions:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestion(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2 pt-4 border-t">
          <Input
            placeholder="Ask me anything about construction..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 h-12"
          />
          <Button onClick={handleSend} className="btn-hero h-12 px-6">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuildBot;
