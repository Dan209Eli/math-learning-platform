document.addEventListener('DOMContentLoaded', () => {
  const quizForm = document.querySelector('.quiz-card');
  const submitBtn = quizForm ? quizForm.querySelector('.btn-primary') : null;
  
  // Correct answer key for demonstration (q1 -> option b: x = 5)
  const correctAnswers = {
    q1: 'b'
  };

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const selectedOption = document.querySelector('input[name="q1"]:checked');
      
      if (!selectedOption) {
        alert('Please select an option before submitting!');
        return;
      }

      const userAnswer = selectedOption.value;
      const isCorrect = userAnswer === correctAnswers.q1;

      // Remove existing feedback message if present
      const existingFeedback = quizForm.querySelector('.feedback-msg');
      if (existingFeedback) existingFeedback.remove();

      // Create feedback message
      const feedback = document.createElement('div');
      feedback.className = `feedback-msg ${isCorrect ? 'correct' : 'incorrect'}`;
      feedback.style.marginTop = '1rem';
      feedback.style.padding = '0.75rem';
      feedback.style.borderRadius = '6px';
      feedback.style.fontWeight = '600';

      if (isCorrect) {
        feedback.style.backgroundColor = '#dcfce7';
        feedback.style.color = '#15803d';
        feedback.textContent = '🎉 Correct! 2x + 5 = 15 ➔ 2x = 10 ➔ x = 5.';
        updateProgressStats(100);
      } else {
        feedback.style.backgroundColor = '#fee2e2';
        feedback.style.color = '#b91c1c';
        feedback.textContent = '❌ Incorrect. Try again! Hint: Subtract 5 from both sides first.';
      }

      quizForm.appendChild(feedback);
    });
  }

  // Update localStorage and UI stats
  function updateProgressStats(newScore) {
    localStorage.setItem('math_quiz_accuracy', `${newScore}%`);
    
    const accuracyStat = document.querySelectorAll('.stat-number')[1];
    if (accuracyStat) {
      accuracyStat.textContent = `${newScore}%`;
    }
  }

  // Load saved accuracy on startup
  const savedAccuracy = localStorage.getItem('math_quiz_accuracy');
  if (savedAccuracy) {
    const accuracyStat = document.querySelectorAll('.stat-number')[1];
    if (accuracyStat) accuracyStat.textContent = savedAccuracy;
  }
});