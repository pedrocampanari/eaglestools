const taskInProgressContainer = document.getElementById('carousel-inner');
const url = new URL(window.location.href);
var memberId = url.pathname.split('/').pop();
let userInfo;


const memberInfoRequest = async ()=>{
    await fetch(`/api/userInfo/${memberId}`)
    .then(response => response.json())
    .then(data => {
        userInfo = data;
        console.log(userInfo);
        document.getElementById('comments').innerHTML = `<a id="link_comments" href="/allposts?id=${memberId}&name=${data.name}"><img src="../assets/img/icon/people.png" alt="Comentários" srcset=""></a>`
        document.getElementById('username').innerHTML = data.name;
    }).catch((err)=>{
        alert('error', err);
        window.location.reload();
    });
}
memberInfoRequest();


async function queryTasks() {

    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: memberId })
        };

        const response = await fetch('/api/tasks/', options);
        const data = await response.json();
        console.log(data);

        if (data.length == 0) {

            taskInProgressContainer.innerHTML = `<span class="span-roboto-condensed p-3 text-align-center">Sem tarefas no momento!</span>`
            alert('error', 'No tasks found');
            return;
        }


        data.forEach(element => {
            taskInProgressContainer.innerHTML += `
                <div class="carousel-item">
                                            <div class="container-fluid">
                                                <div class="row">
                                                    <div class="col-9">
                                                        <h4 class="info-task">${element.name} - Resp. ${element.ownerName}</h4>
                                                        <h4 class="info-task">Prazo: <span class="span-date">${(new Date(element.term).getDate()) < 10 ? "0" + (new Date(element.term).getDate()) : (new Date(element.term).getDate())}/${(new Date(element.term).getMonth() + 1) < 10 ? "0" + (new Date(element.term).getMonth() + 1) : (new Date(element.term).getMonth() + 1)}/${new Date(element.term).getFullYear()} - ${new Date(element.term).getHours()}:${new Date(element.term).getMinutes() > 10? new Date(element.term).getMinutes(): '0' + new Date(element.term).getMinutes()}</span></h4>
                                                        <h4 class="info-task">Status: <span class="span-status-${new Date(element.term) >= new Date() ? 'pendente' : 'atrasado'}">${new Date(element.term) >= new Date() ? 'Pendente' : 'Atrasado'}</span></h4>
                                                    </div>
                                                    <div class="col-1 task-buttons-box">
                                                        <button onclick="editDraft(this)" value="${element._id}">
                                                            <img src="../assets/img/icon/draft.svg">
                                                        </button>
                                                        <button onclick="sendTask(this)" value="${element._id}">
                                                            <img src="../assets/img/icon/done.svg">
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
        `
        });
    } catch (error) {
        alert('error', 'Error fetching data:' + error);
        window.location.reload();
    }
}

async function queryTasksConcluded() {
    const taskConcludedContainer = document.getElementById('historic');
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: memberId })
        };

        const response = await fetch('/api/tasks/concludedAll', options);
        const data = await response.json();
        console.log(data);

        if (data.length == 0) {
            taskConcludedContainer.innerHTML = `<span class="span-roboto-condensed p-3 text-align-center">Sem tarefas concluídas!</span>`
            return;
        }


        data.forEach(element => {
            taskConcludedContainer.innerHTML += `
                <div class="row task2">
                    <div class="col-10 pt-2 pb-2">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col p-0">
                                    <h4 class="info-task">${element.name} - Resp. ${element.ownerName}</h4>
                                </div>
                            </div>
                        <div class="row">
                            <div class="col p-0">
                                <h4 class="info-task">Data de conclusão: <span class="span-date">${(new Date(element.completionDate).getDate()) < 10 ? "0" + (new Date(element.completionDate).getDate()) : (new Date(element.completionDate).getDate())}/${(new Date(element.completionDate).getMonth() + 1) < 10 ? "0" + (new Date(element.completionDate).getMonth() + 1) : (new Date(element.completionDate).getMonth() + 1)}/${new Date(element.completionDate).getFullYear()}</span></h4>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col p-0">
                                <h4 class="info-task">Status: <span class="span-status-concluded">Concluído</span></h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-2 task-buttons-box p-1">
                    <button onclick="showDraft(this)" value="${element._id}">
                        <img src="../assets/img/icon/draft.svg">
                    </button>
                </div>
            </div>
        `
        });
    } catch (error) {
        alert('error', 'Error fetching data:' + error);
        window.location.reload();
    }
}

queryTasksConcluded();
queryTasks();

function clickoutElement(element, day) {
    document.body.addEventListener("dblclick", function (event) {
        if (!element.contains(event.target)) {
            element.setAttribute("id", "");
            element.style.display = 'block';
            element.style.width = "14.2857%";
            element.style.height = "4rem";
            element.innerHTML = day;
            console.log("entrou")
        }
        console.log("click");
    });
}


function drawCreateNewTaskDinamic(element, date) {
    const dateWithoutFormatation = new Date(date);
    const formatedDate = dateWithoutFormatation.toISOString().split('T')[0]; // Mantém apenas a data no formato YYYY-MM-DD
    element.setAttribute("id", "dayClicked");
    element.setAttribute("onclick", `clickoutElement(this, ${dateWithoutFormatation.getDate()})`);
    element.style.display = 'block';
    element.style.width = '100%';
    element.style.height = 'auto';
    const createNewTaskContainer = element;

    createNewTaskContainer.innerHTML += `
    <section class="addNewTask">
        <h5>Adicionar nova tarefa</h5>
        <div>
            <div style="width: 100%">Resp: ${userInfo.name}
            </div>
            <label for="inp-name-task">Nome: </label>
            <input class="inputs-add" type="text" name="nameTask" id="inp-name-task">
            <label for="inp-term">Prazo: </label>
            <input class="inputs-add" type="datetime-local" name="date" id="inp-term" value="${formatedDate}T00:00" min="${formatedDate}T00:00" max="${formatedDate}T23:59">
            <label for="inp-name-task" style="width: 100%">Quão importante esta tarefa é? (0-5) <input class="inputs-add task-urgency" value="0" type="number" min="0" max="5" id="task-urgency" style="width: 10%"></label>
            
        </div>  
        <div>
            <button id="taskAddButton">Add</button>
        </div>
    </section>
`;


    btnEnable(element);
}


function btnEnable(element) {
    const btnAddTask = document.getElementById('taskAddButton');
    btnAddTask.addEventListener("click", async () => {
        const nameTask = document.getElementById('inp-name-task').value;
        const date = document.getElementById('inp-term').value;
        const user = memberId;

        console.log(date, user);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameTask,
                description: '',
                ownerName: memberId,
                user: user,
                term: date,
                urgency: document.getElementById('task-urgency').value,
                status: new Date(date) >= new Date(),
                concluded: false
            })
        }
        const response = await fetch('/api/task/addTask/', options);
        const data = response.json();
        data.then(data => {
            console.log(data);
        });

        //window.location.reload();
        alert('success', 'Nova tarefa adicionada!');
        window.location.reload();

    });
}


async function sendTask(element) {
    const textArea = document.getElementById('placeTextArea').getElementsByTagName('textarea')[0];
    const text = textArea.value;
    const idTask = element.value;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: text
        })
    }

    try {
        const response = await fetch('/api/task/concluded/' + idTask, options);
        const data = response.json();
        console.log(data);
        alert('success', 'Tarefa enviada com sucesso!');
        window.location.reload();
    } catch (err) {
        alert('error', err);
        window.location.reload();
    }

}


function editDraft(element) {
    const idTask = element.value;
    const textAreaEdit = document.getElementById('placeTextArea').innerHTML = `<textarea rows="8" cols="100"  placeholder="Escreva aqui..."></textarea><button value="${idTask}" onclick="sendTask(this)">Enviar relatório</button>`;
    window.location.href = '#focusONtext';
}


function reloadWindow() {
    window.location.reload();
}

async function showDraft(element) {
    const id = element.value;
    const response = await fetch('/api/task/concluded/' + id, { method: 'GET', headers: { "content-type": 'application/json' } });
    const data = await response.json();
    const textAreaEdit = document.getElementById('placeTextArea').innerHTML = `<textarea rows="8" cols="100" disabled  placeholder="Escreva aqui...">${data.description}</textarea><button onclick="reloadWindow()">Fechar relatório</button>`;
    window.location.href = '#top';
}

