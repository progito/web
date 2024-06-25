async function check(event) {
    event.preventDefault();

    const response = await fetch('data.json');
    const userData = await response.json();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if there is a user with the provided username and password
    const user = userData.users.find(u => u.user === username && u.password === password);

    if (user) {
        // Redirect to index.html if the user is found
        location.href = "login.html";

        // Store user data in localStorage
        localStorage.setItem("user", user.user);
        localStorage.setItem("country", user.country);
        localStorage.setItem("langs", JSON.stringify(user.langs));

        localStorage.setItem("py", JSON.stringify(user.py));
        localStorage.setItem("c", JSON.stringify(user.c));
        localStorage.setItem("js", JSON.stringify(user.js));

        localStorage.setItem("proc_py", user.proc_py);
        localStorage.setItem("proc_c", user.proc_c);
        localStorage.setItem("proc_js", user.proc_js);

        localStorage.setItem("itog_py", user.itog_py);
        localStorage.setItem("itog_c", user.itog_c);
        localStorage.setItem("itog_js", user.itog_js);

        localStorage.setItem("itog_ppy", user.itog_ppy);
        localStorage.setItem("itog_pc", user.itog_pc);
        localStorage.setItem("itog_pjs", user.itog_pjs);

        localStorage.setItem("pract_py", JSON.stringify(user.pract_py));
        localStorage.setItem("pract_c", JSON.stringify(user.pract_c));
        localStorage.setItem("pract_js", JSON.stringify(user.pract_js));

    } else {
        // Show an alert if the user is not found
        alert('Неверный username или пароль!');
    }
}
