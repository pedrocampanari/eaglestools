const btnSignIn = document.getElementsByClassName("logIn")[0];
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
});

btnSignIn.addEventListener("click", async () => {
    const email = document.getElementById("login__username").value;
    const password = document.getElementById("login__password").value;
    const data = {
        "email": email,
        "password": password
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data)
    };

    const response = await fetch('/login', options);
    const responseData = await response.json();

    if (responseData.status == 200){
       window.location.href = responseData.redirectUrl;
    }else{
        alert("Invalid email or password");
    }
});


const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const fistForm = document.getElementById("form1");
const secondForm = document.getElementById("form2");
const container = document.querySelector(".container");

signInBtn.addEventListener("click", () => {
	container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
	container.classList.add("right-panel-active");
});

fistForm.addEventListener("submit", (e) => e.preventDefault());
secondForm.addEventListener("submit", (e) => e.preventDefault());
