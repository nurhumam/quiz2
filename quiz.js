const questions = [
    {
        type: "multiple-choice",
        text: "What is the capital of France?",
        options: ["Paris", "London", "Rome", "Berlin"],
        correct: 0
    },
    {
        type: "fill-in-the-blank",
        text: "The square root of 16 is ___",
        correct: "4"
    },
    {
        type: "multiple-choice",
        text: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let globalTimeLeft = 120; 
let timer, globalTimer;
let answers = new Array(questions.length).fill(null);


const playerName = localStorage.getItem("playerName");
const playerNIM = localStorage.getItem("playerNIM");

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("totalQuestions").textContent = questions.length;
    createNavigation();
    loadQuestion();
    startQuestionTimer();
    startGlobalTimer();
});

function createNavigation() {
    const navContainer = document.getElementById("question-nav");
    questions.forEach((_, index) => {
        const button = document.createElement("button");
        button.textContent = `Q${index + 1}`;
        button.className = "nav-button unanswered";
        button.addEventListener("click", () => goToQuestion(index));
        navContainer.appendChild(button);
    });
}

function updateNavigation() {
    const navButtons = document.querySelectorAll(".nav-button");
    navButtons.forEach((button, index) => {
        if (answers[index] !== null) {
            button.classList.remove("unanswered");
            button.classList.add("answered");
        } else {
            button.classList.remove("answered");
            button.classList.add("unanswered");
        }
    });
}

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById("time").textContent = timeLeft;

    const question = questions[currentQuestionIndex];
    document.getElementById("question-text").textContent = question.text;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    if (question.type === "multiple-choice") {
        question.options.forEach((option, index) => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="radio" name="answer" value="${index}"> ${option}`;
            optionsContainer.appendChild(label);
            optionsContainer.appendChild(document.createElement("br"));
        });
    } else if (question.type === "fill-in-the-blank") {
        const input = document.createElement("input");
        input.type = "text";
        input.name = "answer";
        optionsContainer.appendChild(input);
    }

    document.getElementById("currentQuestion").textContent = currentQuestionIndex + 1;
    updateStatus();
    updateNavigation();
    startQuestionTimer();
}

function startQuestionTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function startGlobalTimer() {
    globalTimer = setInterval(() => {
        globalTimeLeft--;
        const minutes = Math.floor(globalTimeLeft / 60);
        const seconds = globalTimeLeft % 60;
        document.getElementById("global-timer").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (globalTimeLeft <= 0) {
            clearInterval(globalTimer);
            showResults(); 
        }
    }, 1000);
}

function saveAnswer() {
    const question = questions[currentQuestionIndex];
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    const inputOption = document.querySelector('input[name="answer"]');

    if (question.type === "multiple-choice" && selectedOption) {
        answers[currentQuestionIndex] = parseInt(selectedOption.value);
    } else if (question.type === "fill-in-the-blank" && inputOption) {
        answers[currentQuestionIndex] = inputOption.value;
    }
}

function nextQuestion() {
    saveAnswer();
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    saveAnswer();
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function goToQuestion(index) {
    saveAnswer();
    currentQuestionIndex = index;
    loadQuestion();
}

function updateStatus() {
    const answered = answers.filter(answer => answer !== null).length;
    const unanswered = questions.length - answered;
    document.getElementById("answered").textContent = answered;
    document.getElementById("unanswered").textContent = unanswered;
}

function showResults() {
    score = answers.reduce((acc, answer, index) => {
        const question = questions[index];
        if ((question.type === "multiple-choice" && answer === question.correct) || 
            (question.type === "fill-in-the-blank" && answer === question.correct)) {
            return acc + 10;
        }
        return acc;
    }, 0);

    clearInterval(timer);
    clearInterval(globalTimer);
    document.body.innerHTML = `
        <div class="container">
            <h2>Quiz Results</h2>
            <p>Your Score: ${score}</p>
            <p>Name: ${playerName}</p>
            <p>NIM: ${playerNIM}</p>
            <button onclick="location.href='index.html'">Return to Home</button>
        </div>
    `;
}
