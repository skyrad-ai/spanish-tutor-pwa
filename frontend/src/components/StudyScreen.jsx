import { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function StudyScreen() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [lastSession, setLastSession] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load last session on mount
  useEffect(() => {
    const loadLastSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stats`);
        const data = await response.json();
        if (data.recentSessions && data.recentSessions.length > 0) {
          setLastSession(data.recentSessions[0]);
        }
      } catch (error) {
        console.error('Error loading last session:', error);
      }
    };
    loadLastSession();
  }, []);

  const handleResumeSession = () => {
    if (lastSession) {
      setMessages(lastSession.messages);
      setSessionId(lastSession.id);
      setLastSession(null);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handlePhotoCapture = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCapturing(true);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/analyze-page`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to analyze page');
      }

      setMessages([
        { role: 'user', content: '📸 Analyzed textbook page' },
        { role: 'assistant', content: data.message }
      ]);
      setSessionId(data.sessionId);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error analyzing page:', error);
      alert(`Failed to analyze page: ${error.message}`);
    } finally {
      setLoading(false);
      setCapturing(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);
    setTimeout(scrollToBottom, 100);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          conversationHistory: messages
        })
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleNewSession = () => {
    setMessages([]);
    setSessionId(null);
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Study</h1>
        {messages.length > 0 && (
          <button onClick={handleNewSession} className="new-session-btn">
            New Session
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="camera-icon">📷</div>
          <h2>Ready to Learn Spanish?</h2>
          <p>Take a photo of your textbook page to start a tutoring session</p>

          {lastSession && (
            <button onClick={handleResumeSession} className="camera-button" style={{ marginBottom: '16px' }}>
              Resume Last Session
            </button>
          )}

          <button onClick={handleCameraClick} className="camera-button" disabled={capturing}>
            {capturing ? 'Processing...' : 'Open Camera'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <>
          <div className="chat-container">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-content typing">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer..."
              className="chat-input"
              disabled={loading}
            />
            <button type="submit" className="send-button" disabled={loading || !inputValue.trim()}>
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default StudyScreen;
