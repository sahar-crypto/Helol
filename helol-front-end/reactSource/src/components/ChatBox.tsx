import { useState, useEffect, useRef } from "react";
import "../css/ChatBox.css";

interface ChatMessage {
  id: number;
  text?: string;
  audioUrl?: string;
  sender: "user" | "bot";
  date: string;
  time: string;
  tempId?: number; // optimistic message identifier
}

interface ChatBoxProps {
  userId: number;
}

export default function ChatBox({ userId }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const ws = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // --- WebSocket setup ---
  useEffect(() => {
    if (ws.current) return;
    const socket = new WebSocket(`ws://localhost:8000/ws/chat_consumer/${userId}/`);
    ws.current = socket;

    socket.onopen = () => console.log("✅ WebSocket connected");
    socket.onclose = () => console.log("❌ WebSocket closed");
    socket.onerror = (err) => console.error("WebSocket error:", err);

    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const messagesArray = Array.isArray(data) ? data : [data];

      setMessages((prev) => {
        const newMessages = [...prev];

        messagesArray.forEach(
          ({ id, user_message, bot_message, audio_file,
             user_message_date, user_message_time,
             bot_message_date, bot_message_time, tempId }) => {

            // Replace optimistic message if tempId matches
            if (tempId) {
              const idx = newMessages.findIndex((m) => m.tempId === tempId);
              if (idx !== -1) {
                newMessages[idx] = {
                  ...newMessages[idx],
                  id,
                  text: user_message ?? newMessages[idx].text,
                  audioUrl: audio_file ?? newMessages[idx].audioUrl,
                  sender: "user",
                  date: user_message_date,
                  time: user_message_time,
                  tempId, // keep tempId for safety
                };
                return;
              }
            }

            // user audio
            if (audio_file && !newMessages.some((m) => m.id === id && m.audioUrl)) {
              newMessages.push({
                id,
                audioUrl: audio_file,
                sender: "user",
                date: user_message_date,
                time: user_message_time,
              });
            }

            // user text
            if (user_message && !newMessages.some((m) => m.id === id && m.text === user_message)) {
              newMessages.push({
                id,
                text: user_message,
                sender: "user",
                date: user_message_date,
                time: user_message_time,
              });
            }

            // bot reply
            if (bot_message && !newMessages.some((m) => m.id === id && m.text === bot_message)) {
              newMessages.push({
                id,
                text: bot_message,
                sender: "bot",
                date: bot_message_date,
                time: bot_message_time,
              });
            }
          }
        );

        return newMessages;
      });
    };

    return () => {
      socket.close();
      ws.current = null;
    };
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const tempId = Date.now();

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        tempId,
        text: input,
        sender: "user",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      },
    ]);

    ws.current?.send(JSON.stringify({ user_message: input, tempId }));
    setInput("");
  };

  // --- Recording functions ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const base64 = await blobToBase64(blob);
        const duration = recordingTime;

        const tempId = Date.now();

        // Optimistic audio message
        setMessages((prev) => [
          ...prev,
          {
            id: tempId,
            tempId,
            audioUrl: URL.createObjectURL(blob),
            sender: "user",
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
          },
        ]);

        ws.current?.send(
          JSON.stringify({
            type: "audio",
            audio: base64,
            filename: `recording_${tempId}.webm`,
            duration,
            tempId,
          })
        );

        setRecordingTime(0);
      };

      recorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  // --- UI ---
  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.length === 0 && <div className="prompt">ما هي شكوتك؟</div>}
        {messages.map((msg) => (
          <div key={msg.tempId ?? msg.id} className={`message ${msg.sender}`}>
            {msg.text && <div className="message-text" dir="rtl">{msg.text}</div>}
            {msg.audioUrl && <audio controls>
              <source src={msg.audioUrl} type="audio/webm"/></audio>}
            <div className="timestamp">{msg.date} | {msg.time}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

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
          {!isRecording ? (
            <span className="icon-mic" onClick={startRecording}>
              <img src="/voice.png" alt="Mic Icon" />
            </span>
          ) : (
            <span className="icon-stop" onClick={stopRecording}>
              <img src="/stop-button.png" alt="Stop Icon" />
              <span className="recording-time">{formatTime(recordingTime)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
