import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Send, Home, Lightbulb, Loader2 } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "How does AI help?",
    "Cost optimization tips?",
    "Smart material choices?",
    "Accuracy guarantee?",
  ];

  const getBotResponse = async (question: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          prompt: `You are BuildBot, a helpful construction assistant for BuildWise. Answer questions about construction, building materials, cost estimation, and building practices. Be informative, accurate, and use emojis where appropriate. Keep responses concise but helpful.

User question: ${question}

Answer as BuildBot:`,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Ollama');
      }

      const data = await response.json();
      return data.response || "I'm sorry, I couldn't generate a response right now. Please try again.";
    } catch (error) {
      console.error('Error calling Ollama:', error);
      return "I'm experiencing some technical difficulties. Please try again later or ask about construction topics I know well!";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(input);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting right now. Please try again!",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }

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
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-3 bg-card text-card-foreground card-soft">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-secondary" />
                    <span className="font-semibold text-sm">BuildBot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
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
            disabled={isLoading}
          />
          <Button onClick={handleSend} className="btn-hero h-12 px-6" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuildBot;
