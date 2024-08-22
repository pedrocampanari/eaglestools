const inpUserName = document.getElementById('inp-username').value;
const inpEmail = document.getElementById('inp-email').value;
const inpPassword = document.getElementById('inp-password').value;
const inpRoot = document.getElementById('inp-root');
const btnAddUser = document.getElementById('userAddButton');



btnAddUser.addEventListener("click", async ()=>{
    let bodyRequest = {
        "name": inpUserName,
        "email": inpEmail,
        "password": inpPassword,
        "root": inpRoot.checked
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
});