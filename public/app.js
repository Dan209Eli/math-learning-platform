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

    // 3. Select ALL buttons on the page (our multiple-choice options)
    const optionButtons = document.querySelectorAll('button');

    // 4. Loop through database options and assign their .text property to the buttons
    quiz.options.forEach((option, index) => {
      if (optionButtons[index]) {
        // Explicitly set textContent to option.text so it never shows [object Object]
        optionButtons[index].textContent = option.text;
        
        // Handle answer submission when an option button is clicked
        optionButtons[index].addEventListener('click', async (e) => {
          e.preventDefault();

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
        });
      }
    });

  } catch (error) {
    console.error('Failed to load quizzes from API:', error);
  }
});