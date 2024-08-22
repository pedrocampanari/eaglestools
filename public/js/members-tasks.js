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
            body: JSON.stringify({id: memberId})
        };

        const response = await fetch('/api/tasks/', options);
        const data = await response.json();
        console.log(data);


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
                                <h4 class="info-task">Prazo: <span class="span-date">${element.term}</span></h4>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col p-0">
                                <h4 class="info-task">Status: <span class="span-status-${element.status? 'pendente':'atrasado'}">${element.status? 'Pendente':'Atrasado'}</span></h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-2 task-buttons-box p-1">
                    <button>
                        <img src="../assets/img/icon/draft.svg">
                    </button>
                    <button>
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

queryTasks();

const dayClicked = document.getElementsByClassName('dayClicked');


dayClicked.forEach(element =>{
    element.addEventListener('click', () => {
        console.log("Teste");
    });
})





