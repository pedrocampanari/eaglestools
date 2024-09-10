const twillioSafetyCode = 'LKM6N3U1TQHU1ADZXR1UHS13';

const btnAddUser = document.getElementById('userAddButton');
const btnAddTask = document.getElementById('taskAddButton');
const btnRemoveTask = document.getElementById('taskRemoveButton');
const btnRemoveUser = document.getElementById('userRemoveButton');

const usersSelect = document.querySelector('#usersSelect');
const usersSelect2 = document.querySelector('#usersSelect2');
const usersSelect3 = document.querySelector('#usersSelect3');
async function getUsers(userSelect) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('/api/user/getUsers/', options);
    const data = response.json();
    data.then(data => {
        data.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id;
            option.text = user.name;
            userSelect.appendChild(option);
        });
    });
}
getUsers(usersSelect);
getUsers(usersSelect3);

async function getTasks(userSelect) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('/api/tasks/getAll/', options);
    const data = response.json();
    data.then(data => {
        data.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id;
            option.text = user.name;
            userSelect.appendChild(option);
        });
    });
}

getTasks(usersSelect2);

btnRemoveUser.addEventListener("click", async (req, res) => {
    const selectElement = document.querySelector('#usersSelect3');
    const selectedOption = selectElement.options[selectElement.selectedIndex].value;

    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: selectedOption })
    };

    try {
        const response = await fetch('/api/user/removeUser/', options);
        const data = await response.json();
        alert('Usuário foi removido com sucesso!')
    } catch (error) {
        alert(err);
    }

    window.location.reload();

});


btnRemoveTask.addEventListener("click", async () => {
    const selectElement = document.querySelector('#usersSelect2');
    const selectedOption = selectElement.options[selectElement.selectedIndex].value;

    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: selectedOption })
    };

    try {
        const response = await fetch('/api/task/removeTask/', options);
        const data = response.json();
        alert('Removido com sucesso!');
    } catch (err) {
        alert(err);
    }
    window.location.reload();


});

btnAddTask.addEventListener("click", async () => {
    const nameTask = document.getElementById('inp-name-task').value;
    const selectElement = document.querySelector('select');
    const selectedOption = selectElement.options[selectElement.selectedIndex].value
    const selectedOptionOwner = selectElement.options[selectElement.selectedIndex].text
    const date = document.getElementById('inp-term').value;
    const user = selectedOption;

    console.log(selectedOption)

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: nameTask,
            description: '',
            ownerName: `${selectedOption}`,
            user: user,
            term: date,
            status: new Date(date) >= new Date(),
            conclused: false
        })

    }
    const response = await fetch('/api/task/addTask/', options);
    const data = response.json();
    data.then(data => {
        console.log(data);
    });

    alert('Nova tarefa adicionada!');

    //window.location.reload();

});

btnAddUser.addEventListener("click", async () => {
    const inpUserName = document.getElementById('inp-username').value;
    const inpEmail = document.getElementById('inp-email').value;
    const inpPassword = document.getElementById('inp-password').value;
    const inpRoot = document.getElementById('inp-root');

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

    alert('Novo Usuário Adicionado!');

    window.location.reload();

});