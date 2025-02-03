class MemberConfig {
    #userInfo;
    #controlSpans;
    #classNamesAndIDs;
    tasks = [];

    constructor(member) {
        this.member = member;
        this.#initializeClassNamesAndIDs();
    }

    async storageInfoUser() {
        try {
            const userInfoResponse = await fetch(`/api/userInfo/${this.member}`);
            this.#userInfo = await userInfoResponse.json();

            const tasksResponse = await fetch(`/api/tasks/getAll/${this.member}`);
            this.tasks = await tasksResponse.json();
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }

    async request(url, method, body = '') {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (method != 'GET'){
            options.body = JSON.stringify(body);
        };

        try {
            const response = await fetch(url, options);
            return response.json();
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }

    async sendCommitFile () {
        let formData = new FormData();
        let fileInput = document.getElementById("fileInput");
        let textArea = document.getElementById("message-commit").value;

        if (fileInput.files.length === 0) {
            alert("Selecione um arquivo para enviar!");
            return;
        }


        formData.append("file", fileInput.files[0]);
 
        await fetch("/code-dropzone-update", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => alert(error));

        const commit = await this.request('/commit-files', 'POST', { message: textArea });
        alert(commit.message);

        this.#classNamesAndIDs.dropzoneCommitBox.style.display = 'none';

    }

    #initializeClassNamesAndIDs() {
        this.#classNamesAndIDs = {
            tasksInProgress: document.getElementById('carousel-inner'),
            tasksConcluded: document.getElementById('historic'),
            btnAddTask: document.getElementById('taskAddButton'),
            textArea: document.getElementById('placeTextArea'),
            commitsBox: document.getElementsByClassName('commits-box')[0],
            dropzoneCommitBox: document.getElementsByClassName('dropzone-commit-box')[0]
        };
        this.#controlSpans = {
            taskInProgressSpan: document.getElementsByClassName('spn-tasks-in-progress')[0],
            taskConcludedSpan: document.getElementsByClassName('spn-historic')[0],
            userInfo: document.getElementById('username'),
            dropzoneCommitBox: document.getElementsByClassName('control-span-close-commit-changes')[0]
        }

    }

    renderUserInfo() {
        this.#controlSpans.userInfo.innerHTML = this.#userInfo.name;
    }

    renderTasksInProgress() {
        if (!this.tasks.length) {
            console.warn("No tasks available to render.");
            return;
        }
        const tasksInProgress = this.tasks.filter(task => task.status === false);
        this.printElements('tasksInProgress', tasksInProgress);
    }

    async renderLastCommits() {
        const lastCommits = await this.request('/lastCommits', 'GET');
        this.printElements('last-commits', lastCommits);
    }

    renderHistoric() {
        if (!this.tasks.length) {
            console.warn("No tasks available to render.");
            return;
        }
        const tasksConcluded = this.tasks.filter(task => task.status === true);
        this.printElements('tasksHistoric', tasksConcluded);
    }

    printElements(type, content) {
        switch (type) {
            case 'tasksInProgress':
                this.#controlSpans.taskInProgressSpan.innerHTML = content.length;
                content.forEach(task => {
                    this.#classNamesAndIDs.tasksInProgress.innerHTML += `
                        <div class="carousel-item">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-9">
                                        <h4 class="info-task">${task.name} - Resp. ${task.ownerName}</h4>
                                        <h4 class="info-task">Prazo: <span class="span-date">${(new Date(task.term).getDate()) < 10 ? "0" + (new Date(task.term).getDate()) : (new Date(task.term).getDate())}/${(new Date(task.term).getMonth() + 1) < 10 ? "0" + (new Date(task.term).getMonth() + 1) : (new Date(task.term).getMonth() + 1)}/${new Date(task.term).getFullYear()} - ${new Date(task.term).getHours()}:${new Date(task.term).getMinutes() > 10 ? new Date(task.term).getMinutes() : '0' + new Date(task.term).getMinutes()}</span></h4>
                                        <h4 class="info-task">Status: <span class="span-status-${new Date(task.term) >= new Date() ? 'pendente' : 'atrasado'}">${new Date(task.term) >= new Date() ? 'Pendente' : 'Atrasado'}</span></h4>
                                    </div>
                                    <div class="col-1 task-buttons-box">
                                        <button class="btn-edit-report" value="${task._id}">
                                            <img src="../assets/img/icon/draft.svg">
                                        </button>
                                        <button class="btn-save" value="${task._id}">
                                            <img src="../assets/img/icon/done.svg">
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                });
                break;
            case 'tasksHistoric':
                this.#controlSpans.taskConcludedSpan.innerHTML = content.length;
                content.forEach(task => {
                    this.#classNamesAndIDs.tasksConcluded.innerHTML += `
                        <div class="task2">
                            <div class="pt-2 pb-2">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col p-0">
                                            <h4 class="info-task">${task.name} - Resp. ${task.ownerName}</h4>
                                        </div>
                                    </div>
                                <div class="row">
                                    <div class="col p-0">
                                        <h4 class="info-task">Data de conclusão: <span class="span-date">${(new Date(task.completionDate).getDate()) < 10 ? "0" + (new Date(task.completionDate).getDate()) : (new Date(task.completionDate).getDate())}/${(new Date(task.completionDate).getMonth() + 1) < 10 ? "0" + (new Date(task.completionDate).getMonth() + 1) : (new Date(task.completionDate).getMonth() + 1)}/${new Date(task.completionDate).getFullYear()}</span></h4>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col p-0">
                                        <h4 class="info-task">Status: <span class="span-status-concluded">Concluído</span></h4>
                                    </div>
                                </div>
                            </div>
                            <div class="task-buttons-box p-1">
                                <button onclick="showDraft(this)" value="${task._id}">
                                    <img src="../assets/img/icon/draft.svg">
                                </button>
                            </div>
                        </div>
                    `
                });
                break;
            case 'edit-report':
                window.location.href = '#focusONtext';
                this.#classNamesAndIDs.textArea.innerHTML = `
                        <textarea rows="8" cols="100"  placeholder="Escreva aqui..."></textarea>
                        <button value="${content}" onclick="sendTask(this)">Enviar relatório</button>`;
                break;
            case 'last-commits': 
                content.forEach(element => {
                    const date = new Date(element.date);
                    const day = `${date.getDate()<10? '0' + date.getDate():date.getDate()}/${date.getMonth()+1 < 10? "0" + (date.getMonth()+1):date.getMonth()+1}/${date.getFullYear()}`;
                    const hour = `${date.getHours()<10? '0' + date.getHours():date.getHours()}:${date.getMinutes()< 10? '0' + date.getMinutes():date.getMinutes()}:${date.getSeconds()<10? '0' + date.getSeconds():date.getSeconds()}`;
                    this.#classNamesAndIDs.commitsBox.innerHTML += `
                        <div class="commit">
                            <div class="commit-message">
                                <p>${element.message}</p>
                            </div>
                            <div class="commit-date">
                                <span class="commit-date-items">${day}<br>${hour}</span>
                            </div>
                        </div>
                
                    `
                });
                break;
        }
    }

    enableBtns() {
        document.querySelectorAll('.btn-edit-report').forEach(btn => {
            btn.removeEventListener('click', this.handleEditClick);
            btn.addEventListener('click', this.handleEditClick);
        });

        document.querySelectorAll('.dayNormal').forEach(btn => {
            btn.removeEventListener('click', this.handleDayClick);
            btn.addEventListener('click', this.handleDayClick);
        });

        this.dropzone();

        const btnCommit = document.getElementById('btn-commit');
        btnCommit.addEventListener('click', async ()=>{
            await this.sendCommitFile();
        })

        enableBtnsCalendar();
    }

    handleEditClick = (event) => {
        this.printElements('edit-report', event.target.value);
    };

    handleDayClick = (event) => {
        dialog.type(event.target.value);
    };


    dropzone() {
        const dropzone = document.getElementById("dropzone");
        const fileInput = document.getElementById("fileInput");

        // Clique para abrir o seletor de arquivos
        dropzone.addEventListener("click", () => fileInput.click());

        // Adiciona arquivos ao input ao selecionar manualmente
        fileInput.addEventListener("change", (event) => {
            this.handleFiles(event.target.files);
        });

        // Evita o comportamento padrão do navegador
        dropzone.addEventListener("dragover", (event) => {
            event.preventDefault();
            dropzone.classList.add("dragover");
        });

        dropzone.addEventListener("dragleave", () => {
            dropzone.classList.remove("dragover");
        });

        // Processa os arquivos soltos na área de drop
        dropzone.addEventListener("drop", (event) => {
            event.preventDefault();
            dropzone.classList.remove("dragover");
            const files = event.dataTransfer.files;
            this.handleFiles(files);
        });

    }

    handleFiles(files) {
        const fileList = document.getElementById("fileList");
        
        this.#classNamesAndIDs.dropzoneCommitBox.style.display = 'flex';
        fileList.innerHTML = ""; // Limpa a lista
        for (const file of files) {
            const li = document.createElement("li");
            li.innerHTML = `${file.name} (${(file.size / 1024).toFixed(2)} KB) <span class="control-span-close-commit-changes">x</span>`;            
            fileList.appendChild(li);
        }
        // this.#controlSpans.dropzoneCommitBox.addEventListener("click", ()=> {
        //     this.#classNamesAndIDs.dropzoneCommitBox.style.display = 'none';
        // });
        
    }

    dispatchMsgEvents() {
        document.removeEventListener('dialogClosed', this.enableBtns); // Remove antes de adicionar para evitar duplicações
        document.addEventListener('dialogClosed', this.enableBtns.bind(this)); // Garante que this seja mantido
    }

    async run() {
        await this.storageInfoUser();
        await this.renderLastCommits();
        this.renderUserInfo();
        this.renderTasksInProgress();
        this.renderHistoric();
        this.enableBtns();
        this.dispatchMsgEvents();
    }
}

const url = new URL(window.location.href);
const member = new MemberConfig(url.pathname.split('/').pop());
member.run();
