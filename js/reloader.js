async function check() {
    const response = await fetch('data.json');
    const userData = await response.json();

    // Assuming there is a current user (you might need to adjust this part based on your use case)
    const currentUser = userData.users.find(user => user.user === localStorage.getItem("user"));

    if (currentUser) {
        localStorage.setItem("country", currentUser.country);
        localStorage.setItem("langs", JSON.stringify(currentUser.langs));

        localStorage.setItem("py", JSON.stringify(currentUser.py));
        localStorage.setItem("c", JSON.stringify(currentUser.c));
        localStorage.setItem("js", JSON.stringify(currentUser.js));

        localStorage.setItem("proc_py", currentUser.proc_py);
        localStorage.setItem("proc_c", currentUser.proc_c);
        localStorage.setItem("proc_js", currentUser.proc_js);

        localStorage.setItem("itog_py", currentUser.itog_py);
        localStorage.setItem("itog_c", currentUser.itog_c);
        localStorage.setItem("itog_js", currentUser.itog_js);
    } else {
        console.error('Current user not found in the data.'); // Handle the case where the current user is not found
    }
}

setInterval(check, 10000);
