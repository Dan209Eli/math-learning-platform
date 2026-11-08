document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Fetch quizzes from our SQLite database via the Express API
    const response = await fetch('http://localhost:3000/api/quizzes');
    const result = await response.json();

    if (!result.success || result.data.length === 0) {
      console.warn('No quizzes found in database.');
      return;
    }

    const quiz = result.data[0]; // Grab our first database quiz

    // 2. Update the question text
    const questionElement = document.querySelector('h3, .question-title, p'); 
    if (questionElement) {
      questionElement.textContent = quiz.question;
    }

    // 3. Select specifically your option buttons (make sure your HTML buttons have a class like class="option-btn", or select them accurately)
    const optionButtons = document.querySelectorAll('button');

    // 4. Loop through database options and assign their text
    quiz.options.forEach((option, index) => {
      if (optionButtons[index]) {
        optionButtons[index].textContent = option.text;
        
        // Remove any old listeners by cloning or handle click directly with a debug log at the very top
        optionButtons[index].onclick = async (e) => {
          e.preventDefault();
          
          // IMMEDIATE DEBUG LOG: This will prove the click is firing!
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
          alert(submitResult.message);

          // DEBUG: Let's see what properties the server is sending back
          console.log("Full server submit result:", submitResult);  

          // Only save the score if the backend indicates the quiz is complete
          if (submitResult.isComplete) { 
            const currentTopic = quiz.topic; // Fallback to quiz topic directly if needed
            const userScore = submitResult.score;
            const totalQuestions = submitResult.total;

            submitQuizScore(currentTopic, userScore, totalQuestions);
          }
        };
      }
    });

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