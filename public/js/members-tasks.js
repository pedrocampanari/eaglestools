
const taskInProgressContainer = document.getElementById('dinamic-items-next');


const url = new URL(window.location.href);
var memberId = url.pathname.split('/').pop();

memberId = '66c4c435050bae3dfbff6ef1'

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

        if (data.length == 0){

            taskInProgressContainer.innerHTML = `<span class="span-roboto-condensed p-3 text-align-center">Sem tarefas no momento!</span>`
            console.log('No tasks found');
            return;
        }


        data.forEach(element => {
            taskInProgressContainer.innerHTML += `
                <div class="row task">
                    <div class="col-10 pt-2">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col p-0">
                                    <h4 class="info-task">${element.name} - Resp. ${element.ownerName}</h4>
                                </div>
                            </div>
                        <div class="row">
                            <div class="col p-0">
                                <h4 class="info-task">Prazo: <span class="span-date">${(new Date(element.term).getDate() + 1) < 10 ? "0" + (new Date(element.term).getDate() + 1) : (new Date(element.term).getDate() + 1)}/${(new Date(element.term).getMonth() + 1) < 10 ? "0" + (new Date(element.term).getMonth() + 1) : (new Date(element.term).getMonth() + 1)}/${new Date(element.term).getFullYear()}</span></h4>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col p-0">
                                <h4 class="info-task">Status: <span class="span-status-${ new Date(element.term) >= new Date() ? 'pendente' : 'atrasado'}">${new Date(element.term) >= new Date() ? 'Pendente' : 'Atrasado'}</span></h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-2 task-buttons-box p-1">
                    <button onclick="editDraft(this)" value="${element._id}">
                        <img src="../assets/img/icon/draft.svg">
                    </button>
                    <button onclick="sendTask(this)" value="${element._id}">
                        <img src="../assets/img/icon/done.svg">
                    </button>
                </div>
            </div>
        `
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function queryTasksConclused() {
    const taskConclusedContainer = document.getElementById('historic');
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: memberId })
        };

        const response = await fetch('/api/tasks/conlusedAll', options);
        const data = await response.json();
        console.log(data);

        if (data.length == 0){

            taskConclusedContainer.innerHTML = `<span class="span-roboto-condensed p-3 text-align-center">Sem tarefas concluídas!</span>`
            console.log('No tasks found');
            return;
        }


        data.forEach(element => {
            taskConclusedContainer.innerHTML += `
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
                                <h4 class="info-task">Status: <span class="span-status-conclused">Concluído</span></h4>
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
        console.error('Error fetching data:', error);
    }
}

queryTasksConclused();
queryTasks();

function clickoutElement(element, day) {
    document.body.addEventListener("dblclick", function(event) {
        // Verifica se o clique foi fora do elemento
        if (!element.contains(event.target)) {
            // Altera as propriedades do elemento quando o clique for fora
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
    const formatedDate = dateWithoutFormatation.toISOString().split('T')[0];
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
                <label for="inp-username">Nome: </label>
                <input class="inputs-add" type="text" name="nameTask" id="inp-name-task">
                <label for="inp-term">Prazo: </label>
                <input disabled class="inputs-add" type="date" name="date" id="inp-term" value="${formatedDate}">
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
        window.location.reload();

    });
}


async function sendTask(element){
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

    try{
        const response = await fetch('/api/task/conclused/' + idTask, options);
        const data = response.json();
        console.log(data);
        alert('Tarefa enviada com sucesso!');
    }catch(err){
        alert('ERRO NO PROCESSO!');
        console.log(err);
    }

    window.location.reload();
}


function editDraft(element){
    const idTask = element.value;
    const textAreaEdit = document.getElementById('placeTextArea').innerHTML = `<textarea rows="8" cols="100"  placeholder="Escreva aqui..."></textarea><button value="${idTask}" onclick="sendTask(this)">Enviar relatório</button>`;
    window.location.href = '#top';
}


function reloadWindow(){
    window.location.reload();
}

async function showDraft(element){
    const id = element.value;
    const response = await fetch('/api/task/conclused/'+ id, {method: 'GET', headers:{"content-type": 'application/json'}});
    const data = await response.json();
    const textAreaEdit = document.getElementById('placeTextArea').innerHTML = `<textarea rows="8" cols="100" disabled  placeholder="Escreva aqui...">${data.description}</textarea><button onclick="reloadWindow()">Fechar relatório</button>`;
    window.location.href = '#top';
}

