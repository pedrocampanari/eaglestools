const taskInProgressContainer = document.getElementById('dinamic-items-next');
async function queryTasks() {

    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
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
                    <button onclick="removeTask(this)" value="${element._id}">
                        <img src="../assets/img/icon/remove.svg" class="redHover">
                    </button>
                    <button onclick="sendTask(this)" value="${element._id}">
                        <img src="../assets/img/icon/done.svg" class="greenHover">
                    </button>
                </div>
            </div>
        `
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function queryTasksConcluded() {
    const taskConcludedContainer = document.getElementById('historic');
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const response = await fetch('/api/tasks/concludedAll', options);
        const data = await response.json();
        console.log(data);

        if (data.length == 0){

            taskConcludedContainer.innerHTML = `<span class="span-roboto-condensed p-3 text-align-center">Sem tarefas concluídas!</span>`
            console.log('No tasks found');
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
                        <img src="../assets/img/icon/draft.svg" class="cianHover">
                    </button>
                    <button onclick="removeTask(this)" value="${element._id}">
                        <img src="../assets/img/icon/waste.svg" class="redHover">
                    </button>
                </div>
            </div>
        `
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

queryTasksConcluded();

queryTasks();


function reloadWindow(){
    window.location.reload();
}

async function showDraft(element){
    const id = element.value;
    const response = await fetch('/api/task/concluded/'+ id, {method: 'GET', headers:{"content-type": 'application/json'}});
    const data = await response.json();
    const textAreaEdit = document.getElementById('placeTextArea').innerHTML = `<textarea rows="8" cols="100" disabled  placeholder="Escreva aqui...">${data.description}</textarea><button onclick="reloadWindow()">Fechar relatório</button>`;
    window.location.href = '#top';
}

async function sendTask(element){
    const idTask = element.value;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: ''
        })
    }

    try{
        const response = await fetch('/api/task/concluded/' + idTask, options);
        const data = response.json();
        console.log(data);
        alert('Tarefa enviada com sucesso!');
    }catch(err){
        alert('ERRO NO PROCESSO!');
        console.log(err);
    }

    window.location.reload();
}


async function removeTask(element) {
    const taskId = element.value;

    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: taskId })
    };

    try {
        const response = await fetch('/api/task/removeTask/', options);
        const data = response.json();
        alert('Removido com sucesso!');
    } catch (err) {
        alert(err);
    }
    window.location.reload();

    
}



