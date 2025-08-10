document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("dark-theme-switch");
  
    const savedTheme = localStorage.getItem("brewnex_theme") || "light";
  
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
      toggle.checked = true;
    }
  
    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("brewnex_theme", "dark");
      } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("brewnex_theme", "light");
      }
    });
  });
  