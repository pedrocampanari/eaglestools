const btnSignIn = document.getElementsByClassName("logIn")[0];
const btnSignUp = document.getElementsByClassName("signUp")[0];


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

btnSignUp.addEventListener("click", async () => {
    const inpUserName = document.getElementById('inp-username').value;
    const inpEmail = document.getElementById('inp-email').value;
    const inpPassword = document.getElementById('inp-password').value;

    let bodyRequest = {
        "name": inpUserName,
        "email": inpEmail,
        "password": inpPassword,
        "root": false
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyRequest),
    };

    const response = await fetch('/api/user/add/', options);
    const data = await response.json();
    console.log(data);

    alert('Novo Usuário Adicionado! Faça o login');

    window.location.reload();

});