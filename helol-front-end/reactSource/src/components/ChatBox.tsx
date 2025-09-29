import { useState, useEffect, useRef } from "react";
import "../css/ChatBox.css";

interface BackendRecord {
  id: number;
  message: string;
  response?: string;
  message_date: string;
  message_time: string;
  response_date?: string;
  response_time?: string;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
  date: string;
  time: string;
}

interface ChatBoxProps {
  userId: number;
}

export default function ChatBox({ userId }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  if (ws.current) return; // ✅ Prevent duplicate sockets (StrictMode safe)

  const socket = new WebSocket(`ws://localhost:8000/ws/chat_consumer/${userId}/`);
  ws.current = socket;

  socket.onopen = () => console.log("✅ WebSocket connected");
  socket.onclose = () => console.log("❌ WebSocket closed");
  socket.onerror = (err) => console.error("WebSocket error:", err);

  socket.onmessage = (event: MessageEvent) => {
    const parsed = JSON.parse(event.data);

    let records: BackendRecord[] = [];
    if (Array.isArray(parsed)) records = parsed;
    else if (parsed.data && Array.isArray(parsed.data)) records = parsed.data;
    else records = [parsed];

    setMessages((prev) => {
      const next = [...prev];
      for (const rec of records) {
        const userMsgIndex = next.findIndex((m) => m.id === rec.id * 2);
        const botMsgIndex = next.findIndex((m) => m.id === rec.id * 2 + 1);

        // Update user message if needed
        if (userMsgIndex === -1) {
          next.push({
            id: rec.id * 2,
            text: rec.message,
            sender: "user",
            date: rec.message_date,
            time: rec.message_time,
          });
        }

        // Add or update bot response
        if (rec.response) {
          if (botMsgIndex === -1) {
            next.push({
              id: rec.id * 2 + 1,
              text: rec.response,
              sender: "bot",
              date: rec.response_date ?? rec.message_date,
              time: rec.response_time ?? rec.message_time,
            });
          } else {
            next[botMsgIndex] = {
              ...next[botMsgIndex],
              text: rec.response,
              date: rec.response_date ?? rec.message_date,
              time: rec.response_time ?? rec.message_time,
            };
          }
        }
      }
      return next;
});

  };

  return () => {
    socket.close();
    ws.current = null; // ✅ reset ref
  };
}, [userId]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    ws.current?.send(JSON.stringify({ message: input }));
    setInput(""); // clear input (backend will echo record back)
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {/* Prompt if no messages */}
        {messages.length === 0 && (
          <div className="prompt">ما هي شكوتك؟</div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-text" dir="rtl">{msg.text}</div>
            <div className="timestamp">
              {msg.date} | {msg.time}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input row */}
      <div className="chat-input">
        <span className="icon-send" onClick={handleSend}>
          <img src="/add.png" alt="Send Icon" />
        </span>
        <input
          type="text"
          placeholder="أكتب شكوتك هنا"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <div className="icons">
          <span className="icon-image">
            <img src="/add_photo.png" alt="Image Icon" />
          </span>
          <span className="icon-mic">
            <img src="/voice.png" alt="Mic Icon" />
          </span>
        </div>
      </div>
    </div>
  );
}
