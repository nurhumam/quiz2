function startQuiz() {
    const name = document.getElementById("name").value;
    const nim = document.getElementById("nim").value;
    if (!name || !nim) {
        alert("Please fill out all fields.");
        return false;
    }
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerNIM", nim);
    window.location.href = "quiz.html";
    return false;
}