import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function FlashcardScreen() {
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    fetchDueCards();
  }, []);

  const fetchDueCards = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/flashcards/due`);
      const data = await response.json();
      setCards(data);
      if (data.length > 0) {
        setCurrentCard(data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setLoading(false);
    }
  };

  const handleReview = async (correct) => {
    if (!currentCard) return;

    try {
      await fetch(`${API_BASE_URL}/api/flashcards/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          correct
        })
      });

      const remainingCards = cards.slice(1);
      setCards(remainingCards);

      if (remainingCards.length > 0) {
        setCurrentCard(remainingCards[0]);
        setShowAnswer(false);
        setUserAnswer('');
      } else {
        setCurrentCard(null);
        setShowAnswer(false);
        setUserAnswer('');
      }
    } catch (error) {
      console.error('Error reviewing card:', error);
    }
  };

  if (loading) {
    return (
      <div className="screen">
        <div className="screen-header">
          <h1>Flashcards</h1>
        </div>
        <div className="empty-state">
          <p>Loading cards...</p>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="screen">
        <div className="screen-header">
          <h1>Flashcards</h1>
        </div>
        <div className="empty-state">
          <div className="camera-icon">✨</div>
          <h2>All Caught Up!</h2>
          <p>No cards due for review right now. Keep studying to add more!</p>
          <button onClick={fetchDueCards} className="camera-button">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Flashcards</h1>
        <div className="cards-remaining">{cards.length} cards left</div>
      </div>

      <div className="flashcard-container">
        <div className="flashcard">
          <div className="card-category">{currentCard.category}</div>

          <div className="card-question">
            <h2>Translate:</h2>
            <p className="word">{currentCard.word}</p>
          </div>

          {!showAnswer ? (
            <div className="answer-input-section">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="flashcard-input"
                autoFocus
              />
              <button
                onClick={() => setShowAnswer(true)}
                className="show-answer-btn"
              >
                Show Answer
              </button>
            </div>
          ) : (
            <div className="answer-section">
              <div className="your-answer">
                <strong>Your answer:</strong> {userAnswer || '(skipped)'}
              </div>
              <div className="correct-answer">
                <strong>Correct answer:</strong> {currentCard.correctAnswer}
              </div>
              {currentCard.userAnswer && (
                <div className="previous-mistake">
                  <strong>You previously said:</strong> {currentCard.userAnswer}
                </div>
              )}

              <div className="review-buttons">
                <button
                  onClick={() => handleReview(false)}
                  className="wrong-btn"
                >
                  ❌ Wrong
                </button>
                <button
                  onClick={() => handleReview(true)}
                  className="correct-btn"
                >
                  ✅ Correct
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlashcardScreen;
