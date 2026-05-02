import { useState, useRef, useEffect } from 'react';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Agent loaded. I am a proxy for Sai Vardhan. Ask me anything.' }
  ]);
  
  const endOfMessagesRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', content: inputText.trim() }];
    setMessages(newMessages);
    setInputText('');

    // Mock API delay response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'Processing sequence initiated... [API integration pending]' }
      ]);
    }, 600);
  };

  return (
    <>
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        interactivechat()
      </button>

      <div className={`chatbot-window terminal-window ${isOpen ? 'open' : ''}`}>
        <div className="terminal-header" style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="terminal-dot"></span>
            <span className="terminal-dot"></span>
            <span className="terminal-dot"></span>
            <span className="terminal-title">agent.sh</span>
          </div>
          <span 
            onClick={() => setIsOpen(false)}
            style={{ cursor: 'pointer', color: 'var(--fg-muted)', fontSize: '0.9rem' }}
          >
            ✕
          </span>
        </div>
        
        <div className="terminal-body chatbot-body">
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <span className="prompt-symbol">{msg.role === 'user' ? '$' : '>'}</span>
                <span className="msg-content">{msg.content}</span>
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>

          <form className="chatbot-input-form" onSubmit={handleSubmit}>
            <span className="prompt-symbol">$</span>
            <input
              type="text"
              className="chatbot-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Query the agent..."
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    </>
  );
}
