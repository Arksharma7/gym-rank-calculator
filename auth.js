const loginUI = document.getElementById("loginUI");
const mainLayout = document.getElementById("mainLayout");

function signup(){
    showDashboard();
}

function login(){
    showDashboard();
}

function continueGuest(){
    showDashboard();
}

function showDashboard(){
    loginUI.style.display = "none";
    mainLayout.style.display = "flex";
}

window.onload = function(){
    loginUI.style.display = "flex";
    mainLayout.style.display = "none";
}
