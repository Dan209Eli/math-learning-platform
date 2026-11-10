document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Fetch quizzes from our SQLite database via the Express API
    const response = await fetch('http://localhost:3000/api/quizzes');
    const result = await response.json();

    if (!result.success || result.data.length === 0) {
      console.warn('No quizzes found in database.');
      return;
    }

    const quizzes = result.data; // Store all database quizzes
    let currentIndex = 0;
    let score = 0;
    const totalQuestions = quizzes.length;

    // Function to render a specific question by index
    function loadQuestion(index) {
      if (index >= totalQuestions) {
        // Quiz session complete!
        renderCompletionScreen(score, totalQuestions, quizzes[0].topic);
        return;
      }

      const quiz = quizzes[index];

      // Update question counter text if it exists
      const counterElement = document.querySelector('.question-counter, [class*="question"]');
      if (counterElement) {
        // If you have a counter element, update it dynamically
      }

      // Update the question text
      const questionElement = document.querySelector('h3, .question-title, p'); 
      if (questionElement) {
        questionElement.textContent = quiz.question;
      }

      // Select option buttons
      const optionButtons = document.querySelectorAll('button');

      // Clear old review cards if any exist from previous question
      const existingReview = document.querySelector('#solution-review-card');
      if (existingReview) {
        existingReview.remove();
      }

      // Loop through database options and assign their text
      quiz.options.forEach((option, optionIndex) => {
        if (optionButtons[optionIndex]) {
          optionButtons[optionIndex].style.display = 'inline-block'; // Ensure visible
          optionButtons[optionIndex].textContent = option.text;
          
          // Reset button click handlers for the current question
          optionButtons[optionIndex].onclick = async (e) => {
            e.preventDefault();
            
            console.log("Option button clicked!", option.text);

            const submitResponse = await fetch('http://localhost:3000/api/quizzes/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                quizId: quiz.id,
                selectedAnswer: option.text
              })
            });

            const submitResult = await submitResponse.json();
            console.log("Full server submit result:", submitResult);  

            // Track score locally if correct
            if (submitResult.isCorrect) {
              score++;
            }

            // Render Interactive Solution Review Card
            let reviewContainer = document.querySelector('#solution-review-card');
            if (!reviewContainer) {
              reviewContainer = document.createElement('div');
              reviewContainer.id = 'solution-review-card';
              reviewContainer.style.cssText = `
                margin-top: 20px;
                padding: 20px;
                border-radius: 8px;
                background: #f8f9fa;
                border-left: 5px solid #007bff;
                font-family: inherit;
              `;
              const quizContainer = document.querySelector('h3, .question-title, p').parentNode;
              quizContainer.appendChild(reviewContainer);
            }

            reviewContainer.style.borderLeftColor = submitResult.isCorrect ? '#28a745' : '#dc3545';
            reviewContainer.innerHTML = `
              <h4 style="margin: 0 0 10px 0; color: ${submitResult.isCorrect ? '#28a745' : '#dc3545'};">
                ${submitResult.message}
              </h4>
              <p style="margin: 0 0 8px 0;"><strong>Correct Answer:</strong> ${submitResult.correctAnswer}</p>
              <p style="margin: 0 0 15px 0; color: #333;"><strong>Step-by-Step Explanation:</strong> ${submitResult.explanation || 'No explanation provided.'}</p>
              <button id="next-question-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                ${index + 1 < totalQuestions ? 'Next Question →' : 'View Final Results →'}
              </button>
            `;

            // Disable option buttons after answering so they can't double-click
            optionButtons.forEach(btn => btn.onclick = null);

            // Hook up the "Next Question" button
            document.querySelector('#next-question-btn').onclick = () => {
              currentIndex++;
              loadQuestion(currentIndex);
            };
          };
        }
      });
    }

    // Helper to render completion and trigger score persistence
    function renderCompletionScreen(finalScore, total, topic) {
      const quizContainer = document.querySelector('h3, .question-title, p').parentNode;
      quizContainer.innerHTML = `
        <div style="text-align: center; padding: 30px;">
          <h3 style="color: #28a745; margin-bottom: 15px;">Quiz Session Completed! 🎉</h3>
          <p style="font-size: 1.2rem; margin-bottom: 20px;">Your Score: <strong>${finalScore} / ${total}</strong></p>
          <p style="color: #666;">Your score has been successfully saved to your profile dashboard.</p>
        </div>
      `;

      // Submit score to backend API
      submitQuizScore(topic, finalScore, total);
    }

    // Kick off the first question
    loadQuestion(currentIndex);

  } catch (error) {
    console.error('Failed to load quizzes from API:', error);
  }
});

async function submitQuizScore(topic, score, total) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('User not logged in. Score not saved.');
    return;
  }

  try {
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ topic, score, total })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Quiz score saved successfully:', data);
    } else {
      console.error('Failed to save score:', data.error);
    }
  } catch (error) {
    console.error('Network error saving score:', error);
  }
}

async function submitQuizScore(topic, score, total) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('User not logged in. Score not saved.');
    return;
  }

  try {
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ topic, score, total })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Quiz score saved successfully:', data);
    } else {
      console.error('Failed to save score:', data.error);
    }
  } catch (error) {
    console.error('Network error saving score:', error);
  }
}