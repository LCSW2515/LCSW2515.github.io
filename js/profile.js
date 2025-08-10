document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const profileSection = document.getElementById("profile-section");
    const profileAvatar = document.getElementById("profile-avatar");
    const tasksList = document.getElementById("user-tasks");
    const logoutBtn = document.getElementById("logout-btn");
    const avatarUploadLogin = document.getElementById("avatar-upload-login");

    const storedUsername = localStorage.getItem("rememberedUsername");
    const storedPassword = localStorage.getItem("registeredPassword");
    const loggedIn = localStorage.getItem("loggedIn");

    // Load avatar on page load if saved
    if (localStorage.getItem("profileAvatar")) {
        profileAvatar.src = localStorage.getItem("profileAvatar");
    }

    // Auto login if already logged in before
    if (loggedIn && storedUsername) {
        showProfile(storedUsername);
    }

    // Avatar upload during login form before login
    avatarUploadLogin.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Save avatar data url to localStorage immediately
                localStorage.setItem("profileAvatar", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value.trim();

        const loginError = document.getElementById("login-error");
        loginError.style.display = "none";

        if (username === storedUsername && password === storedPassword) {
            localStorage.setItem("loggedIn", "true");
            loginForm.style.display = "none";
            showProfile(username);
        } else {
            loginError.style.display = "block";
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedIn");
        profileSection.style.display = "none";
        loginForm.style.display = "block";

        // Clear login form inputs
        document.getElementById("login-username").value = "";
        document.getElementById("login-password").value = "";
        avatarUploadLogin.value = "";

        // Hide login error if visible
        document.getElementById("login-error").style.display = "none";
    });

    function showProfile(username) {
        loginForm.style.display = "none";
        profileSection.style.display = "block";

        // Show avatar saved in localStorage or default
        if (localStorage.getItem("profileAvatar")) {
            profileAvatar.src = localStorage.getItem("profileAvatar");
        } else {
            profileAvatar.src = "images/default-avatar.png";
        }

        // Display username and password as plain text
        document.getElementById("display-username").textContent = username;
        document.getElementById("display-password").textContent = storedPassword || "N/A";

        // Load tasks
        const tasks = JSON.parse(localStorage.getItem("brewnex_tasks")) || [];
        tasksList.innerHTML = "";

        if (tasks.length === 0) {
            tasksList.innerHTML = "<li>No tasks found.</li>";
        } else {
            tasks.forEach((task) => {
                const li = document.createElement("li");
                li.textContent = `📌 ${task.title} — ${task.status}`;
                tasksList.appendChild(li);
            });
        }
    }
});
