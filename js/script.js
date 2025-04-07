document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLink = document.querySelector('.nav-link');

    menuToggle.addEventListener('click', function() {
        navLink.classList.toggle('active');
    });


});

function setFavicon(url) {
    let link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png"; 
    link.href = url;

    let existingFavicon = document.querySelector("link[rel='icon']");
    if (existingFavicon) {
        document.head.removeChild(existingFavicon);
    }

    document.head.appendChild(link);
}

window.onload = function() {
    setFavicon("images/fav-icon.png"); 
};

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const successMessage = document.getElementById("success-message");

form.addEventListener("submit", function (event) {
    event.preventDefault(); 

    
    form.style.display = "none";
    
    successMessage.style.display = "block";

    setTimeout(() => {
        successMessage.style.display = "none";
        form.style.display = "block";
        form.reset(); 
    }, 4000);
});
});