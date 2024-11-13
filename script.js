function validateForm() {
    let name = document.getElementById("name").value;
    let nim = document.getElementById("nim").value;
    if (name === "" || nim === "") {
        alert("All fields are required");
        return false;
    }
    return true;
}

