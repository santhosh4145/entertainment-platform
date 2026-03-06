// src/components/AIChat.tsx
import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([])

        const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();

    // Immediately show user message + loading indicator
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessages((prev) => [...prev, { role: "ai", content: "Thinking..." }]);
    setMessage(""); // clear input

    try {
        console.log("Sending to backend:", { message: userMessage }); // debug log

        const response = await fetch("http://localhost:8000/ai/chat", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ message: userMessage }), // ← this MUST be the body
        });

        console.log("Response status:", response.status); // debug

        if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("AI reply data:", data); // debug

        // Replace "Thinking..." with real reply
        setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "ai", content: data.reply || "No reply received from AI" },
        ]);
    } catch (err) {
        console.error("Chat request failed:", err);

        const errorMessage = err instanceof Error ? err.message : "Failed to connect to AI";
        setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "ai", content: `Error: ${errorMessage}` },
        ]);
    }
    };

  return (
    <>
      {/* Floating chat bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-black/80 p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-display text-lg text-white">Hotbox AI Concierge</h3>
                <p className="text-white/40 text-xs">Ask anything about events, artists, merch...</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-white/40">
                <MessageCircle className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-sm">Ask me anything!</p>
                <p className="text-xs mt-2">Examples:</p>
                <p className="text-xs mt-1">"Hip hop events in LA under $100"</p>
                <p className="text-xs">"Best merch for summer festivals"</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-red-600/20 text-white rounded-br-none"
                        : "bg-white/5 text-white rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-white/10 bg-black/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about events, artists, merch..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-red-500/50"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="bg-red-600 hover:bg-red-500 text-white rounded-full p-3 disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}