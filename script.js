// Preload images
const images = [
  'assets/img/1.png',
  'assets/img/2.png',
  'assets/img/3.png',
  'assets/img/4.png',
  'assets/img/5.png',
  'assets/img/6.png',
  'assets/img/7.png',
  'assets/img/8.png',
  'assets/img/9.png'
];

let loadedImages = 0;

function preloadImages(imageArray, callback) {
  imageArray.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedImages++;
      if (loadedImages === imageArray.length) {
        callback();
      }
    };
  });
}

preloadImages(images, () => {
  startSlideshow();
});

function startSlideshow() {
  const hero = document.getElementById('hero');
  let currentImageIndex = 0;

  setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    hero.style.backgroundImage = `url(${images[currentImageIndex]})`;
  }, 4500); // Change image every 3 seconds
}

// Existing code...
const words = ["Ready", "Resilient", "Prepared", "Equipped"];
const changingWord = document.querySelector('.changing-word');
let currentIndex = 0;

function typeWord(word) {
    let chars = word.split('');
    changingWord.textContent = '';
    chars.forEach((char, index) => {
        setTimeout(() => {
            changingWord.textContent += char;
        }, 100 * index);
    });
}

setInterval(() => {
    currentIndex = (currentIndex + 1) % words.length;
    typeWord(words[currentIndex]);
}, 3000);

// Initial call
typeWord(words[0]);

const faqQuestions = document.querySelectorAll('.faq-question');
const faqItems = document.querySelectorAll('.faq-item');

faqQuestions.forEach((question, index) => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
        const answer = question.nextElementSibling;
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        
        // Check if two or more FAQ answers are visible
        const activeCount = Array.from(faqItems).filter(item => item.classList.contains('active')).length;
        if (activeCount >= 2) {
            faqItems[0].classList.remove('active'); // Collapse the fun fact box
            faqItems[0].querySelector('.faq-answer').style.display = 'none';
        }

        // Auto collapse the second FAQ when the third FAQ is opened
        if (index === 2 && faqItems[1].classList.contains('active')) {
            faqItems[1].classList.remove('active');
            faqItems[1].querySelector('.faq-answer').style.display = 'none';
        }
    });
});

window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    var scrollPosition = window.scrollY || document.documentElement.scrollTop;
    var offset = 100;
    var hideOffset = window.innerHeight * 7.6;
  
    if (scrollPosition > window.innerHeight - offset) {
      header.style.backgroundColor = '#176240';
    } else {
      header.style.backgroundColor = 'transparent';
    }
  
    if (scrollPosition > hideOffset) {
      header.style.display = 'none';
    } else {
      header.style.display = 'block';
    }
  
    var contactLink = document.querySelector('.nav-bar li a[href="#contact"]');
    var contactSection = document.querySelector('#contact');
    var contactSectionTop = contactSection.getBoundingClientRect().top + scrollPosition;
    var contactSectionHeight = contactSection.offsetHeight;
  
    if (scrollPosition >= contactSectionTop && scrollPosition < contactSectionTop + contactSectionHeight) {
      contactLink.classList.add('active-link');
    } else {
      contactLink.classList.remove('active-link');
    }
  });
  
  document.querySelector('.hero-button').addEventListener('click', function() {
    window.scrollBy({
      top: window.innerHeight - 25,
      behavior: 'smooth'
    });
  });
  
  var swiper = new Swiper('.blog-slider', {
    spaceBetween: 30,
    effect: 'fade',
    loop: true,
    mousewheel: {
      invert: false,
    },
    pagination: {
      el: '.blog-slider__pagination',
      clickable: true,
    }
  });
  
// Update the title based on the selected persona
document.getElementById('persona').addEventListener('change', function () {
  const selectedPersona = this.value;
  const personaTitle = document.getElementById('persona-title');

  // Update the h2 title with the selected persona
  personaTitle.textContent = selectedPersona;
});

document.getElementById('persona').addEventListener('change', () => {
    document.getElementById('persona-selector').style.display = 'none';
    document.getElementById('instructions').style.display = 'block';
});

// Reset Assessment
function resetAssessment() {
  document.getElementById("assessment-form").reset();
  document.getElementById("results").classList.add("hidden");
  document.querySelectorAll(".fact").forEach((fact) => fact.classList.add("hidden"));
  document.getElementById('persona-selector').style.display = 'flex'; // Ensure it's flex to center
  document.getElementById('instructions').style.display = 'none';
  document.getElementById('persona').selectedIndex = 0; // Reset the selector
  document.getElementById('assessment-section').scrollIntoView({ behavior: 'smooth' });
  document.querySelectorAll('.question').forEach((question) => {
    question.classList.remove('invalid');
  });
  document.querySelectorAll('.warning').forEach((warning) => {
    warning.classList.add('hidden');
  });
}

// Ensure the "Take Again" button calls the resetAssessment function
document.querySelector('.btn-cta[onclick="resetAssessment()"]').addEventListener('click', resetAssessment);

// Handle form submission
document.getElementById('assessment-form').addEventListener('submit', function (event) {
  event.preventDefault();

  let totalUserScore = 0;
  let totalFactualScore = 0;
  const totalQuestions = 20;
  let allAnswered = true;
  const resultsTableBody = document.querySelector('#results-table tbody');
  resultsTableBody.innerHTML = ''; // Clear previous results

  let closeMatches = [];
  let significantDifferences = [];
  let moderateDifferences = [];

  for (let i = 1; i <= totalQuestions; i++) {
    const userScoreElement = document.querySelector(`input[name="question-${i}"]:checked`);
    if (!userScoreElement) {
      allAnswered = false;
      const questionContainer = document.getElementById(`question-container-${i}`);
      questionContainer.classList.add('invalid');
      document.getElementById(`warning-${i}`).classList.remove('hidden');
    } else {
      const userScore = parseInt(userScoreElement.value);
      const factualScore = parseInt(document.getElementById(`factual-score-${i}`).textContent);

      totalUserScore += userScore;
      totalFactualScore += factualScore;

      // Add row to results table
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>Question ${i}</td>
        <td>${userScore}</td>
        <td>${factualScore}</td>
      `;
      resultsTableBody.appendChild(row);

      // Analyze the score differences
      const scoreDifference = userScore - factualScore;
      if (Math.abs(scoreDifference) <= 1) {
        closeMatches.push(i);
      } else if (scoreDifference >= 5 || scoreDifference <= -5) {
        significantDifferences.push(i);
      } else {
        moderateDifferences.push(i);
      }
    }
  }

  if (!allAnswered) {
    return;
  }

  const averageUserScore = (totalUserScore / totalQuestions).toFixed(1);
  const averageFactualScore = (totalFactualScore / totalQuestions).toFixed(1);

  document.getElementById('user-score').textContent = averageUserScore;
  document.getElementById('factual-score').textContent = averageFactualScore;
  

  const selectedPersona = document.getElementById('persona').value;
  let feedback = '';

  if (closeMatches.length > significantDifferences.length && closeMatches.length > moderateDifferences.length) {
    feedback = `Great Job! Your ratings match closely with our research in ${closeMatches.length} areas.`;
  } else if (significantDifferences.length > closeMatches.length && significantDifferences.length > moderateDifferences.length) {
    feedback = `There’s more to learn about Ocampo’s DRRM. You had significant differences in ${significantDifferences.length} areas.`;
  } else if (moderateDifferences.length > closeMatches.length && moderateDifferences.length > significantDifferences.length) {
    feedback = `Your ratings are somewhat close to our research with moderate differences in ${moderateDifferences.length} areas. Keep learning!`;
  } else {
    feedback = `Your ratings are a mix of close matches, moderate differences, and significant differences. Keep learning!`;
  }

  feedback += ` As a ${selectedPersona}, we encourage you to visit the INFOHUB for more knowledge and tips on DRRM.`;

  // Add detailed feedback without humor
  if (closeMatches.length > 0) {
    feedback += ` Here are the questions where your ratings matched closely with ours: ${closeMatches.join(', ')}.`;
  }
  if (significantDifferences.length > 0) {
    feedback += ` Here are the questions where your ratings were significantly different: ${significantDifferences.join(', ')}.`;
  }
  if (moderateDifferences.length > 0) {
    feedback += ` Here are the questions where your ratings were moderately different: ${moderateDifferences.join(', ')}.`;
  }

  document.getElementById('feedback').textContent = feedback;

  // Generate humorous feedback based on overall score difference
  let humorFeedback = '';
  const scoreDifference = averageUserScore - averageFactualScore;

  if (scoreDifference < 0) {
    humorFeedback = `Grabe naman, teh! Ang taas ng standards mo ha pero kay ano bagsak ka.`;
  } else if (scoreDifference > 0) {
    humorFeedback = `Baba naman ng standards mo teh, mas mababa pa sa chance na maging kayo ng crush mo?`;
  } else {
    humorFeedback = `Woah! Gaya-gaya ka talaga kahit kailan! Anyway, same thoughts!`;
  }

  document.getElementById('humor-feedback').textContent = humorFeedback;

  document.getElementById('results').classList.remove('hidden');
});

// Handle question interactions
document.querySelectorAll('.rating-options input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', function () {
        const questionId = parseInt(this.name.split('-')[1]);
        const userScore = this.value;
        const factDiv = document.getElementById(`fact-${questionId}`);
        factDiv.classList.remove("hidden");

        // Update the user's score in the fact div
        document.getElementById(`user-score-${questionId}`).textContent = userScore;

        // Set factual score to a fixed value
        const factualScores = {
          1: 7,
          2: 6,
          3: 7,
          4: 8,
          5: 7,
          6: 8,
          7: 9,
          8: 9,
          9: 7,
          10: 7,
          11: 8,
          12: 7,
          13: 8,
          14: 6,
          15: 8,
          16: 9,
          17: 7,
          18: 8,
          19: 8,
          20: 8
        };
        const factualScore = factualScores[questionId];
        document.getElementById(`factual-score-${questionId}`).textContent = factualScore;

        // Remove invalid class and warning if answered
        const questionContainer = document.getElementById(`question-container-${questionId}`);
        questionContainer.classList.remove('invalid');
        document.getElementById(`warning-${questionId}`).classList.add('hidden');
    });
});

document.getElementById('start-assessment-button').addEventListener('click', () => {
    document.getElementById('assessment-section').scrollIntoView({ behavior: 'smooth' });
});

window.addEventListener('scroll', function() {
  var ccontainer = document.querySelector('.ccontainer');
  var scrollPosition = window.scrollY || document.documentElement.scrollTop;
  var bottomOffset = 100;

  if (scrollPosition + window.innerHeight >= document.documentElement.scrollHeight - bottomOffset) {
    ccontainer.classList.add('blur');
  } else {
    ccontainer.classList.remove('blur');
  }
});

document.querySelector('.formbox button').addEventListener('click', function(event) {
  event.preventDefault();
  var email = document.querySelector('#email').value;
  var emailError = document.querySelector('#emailError');
  var emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (email.match(emailPattern)) {
    emailError.style.display = 'none';
    document.querySelector('#imgbox').classList.add('move-right');
    document.querySelector('#thankyoubox').style.display = 'block';
    document.querySelector('.formbox').style.display = 'none';
  } else {
    emailError.style.display = 'block';
  }
});

document.querySelector('.formbox button').addEventListener('click', function() {
  var email = document.querySelector('#email').value;
  if (validateEmail(email)) {
    document.querySelector('#imgbox').classList.add('move-right');
    document.querySelector('#contentbox').classList.add('move-left');
    document.querySelector('#thankyoubox').style.display = 'block';
  }
});
