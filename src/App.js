import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);

  // Voice Recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = "en-US";
    recognition.continuous = false;
  }

  // Voice output
  const say = (text) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const startListening = () => {

    if (!recognition) {
      alert("Voice not supported");
      return;
    }

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setListening(false);
      sendVoiceMessage(voiceText);
    };

    recognition.onerror = () => setListening(false);
  };

  const sendVoiceMessage = async (voiceText) => {

    setChat(prev => [...prev, { sender: "user", text: voiceText }]);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: voiceText })
      });

      const data = await response.json();

      setChat(prev => [...prev, { sender: "bot", text: data.reply }]);
      say(data.reply);

    } catch {
      setChat(prev => [...prev, { sender: "bot", text: "⚠ Server error" }]);
    }
  };

  const sendMessage = async () => {

    if (!message.trim()) return;

    setChat(prev => [...prev, { sender: "user", text: message }]);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      setChat(prev => [...prev, { sender: "bot", text: data.reply }]);
      say(data.reply);

    } catch {
      setChat(prev => [...prev, { sender: "bot", text: "⚠ Server error" }]);
    }

    setMessage("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="page">

      <div className="chatBox">

        <div className="header">
          🤖 IronGuide AI Voice Assistant
        </div>

        <div className="messages">

          {chat.map((msg, i) => (
            <div
              key={i}
              className={msg.sender === "user" ? "userMsg" : "botMsg"}
            >
              {msg.text}
            </div>
          ))}

          <div ref={bottomRef}></div>

        </div>

        <div className="inputArea">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type or speak..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={startListening}
            className={`micBtn ${listening ? "listening" : ""}`}
          >
            🎤
          </button>

          <button onClick={sendMessage} className="sendBtn">
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;
