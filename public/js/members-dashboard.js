class MemberConfig {
    #userInfo;
    #controlSpans;
    #classNamesAndIDs;
    tasks = [];

    constructor(member) {
        this.member = member;
        this.#initializeClassNamesAndIDs();
    }

    #initializeClassNamesAndIDs() {
        this.#classNamesAndIDs = {
            tasksInProgressProject: document.getElementById('carousel-inner-project'),
            tasksInProgressRobot: document.getElementById('carousel-inner-robot'),
            tasksConcluded: document.getElementById('historic'),
            btnAddTask: document.getElementById('taskAddButton'),
            textArea: document.getElementById('placeTextArea'),
            commitsBox: document.getElementsByClassName('commits-box')[0],
            dropzoneCommitBox: document.getElementsByClassName('dropzone-commit-box')[0]
        };
        this.#controlSpans = {
            taskInProgressSpan: document.getElementsByClassName('spn-tasks-in-progress')[0],
            taskConcludedSpan: document.getElementsByClassName('spn-historic')[0],
            taskInProgressProjectSpan: document.getElementById('spn-tasks-in-progress-project'),
            taskInProgressRobotSpan: document.getElementById('spn-tasks-in-progress-robot'),
            userInfo: document.getElementById('username'),
            dropzoneCommitBox: document.getElementsByClassName('control-span-close-commit-changes')[0]
        }

    }

    async storageInfoUser() {
        try {
            const userInfoResponse = await fetch(`/api/userInfo/${this.member}`);
            this.#userInfo = await userInfoResponse.json();
            console.log(this.#userInfo);

            const tasksResponse = await fetch(`/api/tasks/getAll/${this.member}`);
            this.tasks = await tasksResponse.json();
            console.log(this.tasks);
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

        if (method != 'GET') {
            options.body = JSON.stringify(body);
        };

        try {
            const response = await fetch(url, options);
            return response.json();
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }

    async sendCommitFile() {
        let formData = new FormData();
        let fileInput = document.getElementById("fileInput");
        let textArea = document.getElementById("message-commit").value;

        if (fileInput.files.length === 0) {
            alert("Selecione um arquivo para enviar!");
            return;
        }

        if (fileInput.files[0].size > 20 * 1024 *1024){
            alert("Arquivo muito grande!");
            window.location.reload();
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
        window.location.reload();
    }

    async updateUserTask(id) {
        try {
            const textArea = document.getElementById('placeTextArea').getElementsByTagName('textarea')[0];
            const description = textArea.value;
            const response = await this.request(`/api/update/task/${id}`, 'PUT', { description: description });
            
            alert('Tarefa enviada com sucesso!');
            window.location.reload();
        }
        catch (err) {
            console.error("Error updating task:", err);
        }
    }

    async sendUserTask(id) {
        try {
            const response = await this.request(`/api/update/task/${id}`, 'PUT', { description: '' });
            
            alert('Tarefa enviada com sucesso!');
            window.location.reload();
        }
        catch (err) {
            console.error("Error updating task:", err);
        }
    }

    renderUserInfo() {
        this.#controlSpans.userInfo.innerHTML = this.#userInfo.name;
        document.getElementById('comments').innerHTML = `<a id="link_comments" href="/allposts?id=${this.#userInfo.name}&name=${this.#userInfo.name}"><img src="../assets/img/icon/people.png" alt="Comentários" srcset=""></a>`
    }

    renderTasksInProgress() {
        if (!this.tasks.length) {
            console.warn("No tasks available to render.");
            return;
        }
        const tasksInProgress = this.tasks.filter(task => task.concluded === false);
        console.log('TasksInProgress:', tasksInProgress)
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
        const tasksConcluded = this.tasks.filter(task => task.concluded === true);
        this.printElements('tasksHistoric', tasksConcluded);
    }

    printElements(type, content) {
        console.log(type);
        switch (type) {
            case 'tasksInProgress':
                console.log('Entrou')
                let carousel, robot = 0, project = 0;
                content.forEach(task => {
                    console.log(task);

                    if (task.category != 'P') {
                        carousel = document.getElementById('carousel-inner-robot');
                        robot++;
                    } else {
                        carousel = document.getElementById('carousel-inner-project')
                        project++;
                    }

                    carousel.innerHTML += `
                        <div class="carousel-item">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-9">
                                        <h4 class="info-task">${task.name}</h4>
                                        <h4 class="info-task" style="font-size:0.7rem;">Owner: ${task.ownerName}</h4>
                                        <h4 class="info-task" style="font-size:0.7rem;">Category: ${task.category} - Urgency: ${task.urgency}</h4>
                                        <h4 class="info-task pt-2">
                                            Term: <span class="span-date">${(new Date(task.term).getDate()) < 10 ? "0" + (new Date(task.term).getDate()) : (new Date(task.term).getDate())}/${(new Date(task.term).getMonth() + 1) < 10 ? "0" + (new Date(task.term).getMonth() + 1) : (new Date(task.term).getMonth() + 1)}/${new Date(task.term).getFullYear()} - ${new Date(task.term).getHours()}:${new Date(task.term).getMinutes() > 10 ? new Date(task.term).getMinutes() : '0' + new Date(task.term).getMinutes()}</span> - 
                                            Status: <span class="span-status-${new Date(task.term) >= new Date() ? 'pendente' : 'atrasado'}">${new Date(task.term) >= new Date() ? 'Pending' : 'Late'}</span>
                                        </h4>
                                    </div>
                                    <div class="col-1 task-buttons-box">
                                        <button class="btn-edit-report" value="${task._id}">
                                            <img src="../assets/img/icon/draft.svg" value="${task._id}">
                                        </button>
                                        <button class="btn-save-report" value="${task._id}">
                                            <img src="../assets/img/icon/done.svg" value="${task._id}">
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                });

                document.getElementById("spn-tasks-in-progress-project").innerText = project;
                document.getElementById("spn-tasks-in-progress-robot").innerText = robot;

                this.#controlSpans.taskInProgressSpan.innerHTML = content.length;
                console.log(robot, project)
                robot = 0, project = 0;
                break;
            case 'tasksHistoric':
                this.#controlSpans.taskConcludedSpan.innerHTML = content.length;
                this.#classNamesAndIDs.tasksConcluded.innerHTML = '';
                content.forEach(task => {
                    this.#classNamesAndIDs.tasksConcluded.innerHTML += `
                        <div class="task2 p-2">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col p-0">
                                        <h4 class="info-task">${task.name} - Owner. ${task.ownerName}</h4>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col p-0">
                                        <h4 class="info-task">Completion date: <span class="span-date">${(new Date(task.completionDate).getDate()) < 10 ? "0" + (new Date(task.completionDate).getDate()) : (new Date(task.completionDate).getDate())}/${(new Date(task.completionDate).getMonth() + 1) < 10 ? "0" + (new Date(task.completionDate).getMonth() + 1) : (new Date(task.completionDate).getMonth() + 1)}/${new Date(task.completionDate).getFullYear()}</span></h4>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col p-0">
                                        <h4 class="info-task">Category: <span class="span-date">${task.category}</span></h4>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col p-0">
                                        <h4 class="info-task">Status: <span class="span-status-concluded">Concluded</span></h4>
                                    </div>
                                </div>
                            </div>
                            <div class="task-buttons-box p-1">
                                <button class="btn-view-report" value="${task._id}">
                                    <img src="../assets/img/icon/draft.svg" value="${task._id}">
                                </button>
                            </div>
                    </div>
                    `
                });
                break;
            case 'edit-report':
                window.location.href = '#focusONtext';
                this.#classNamesAndIDs.textArea.innerHTML = '';
                this.#classNamesAndIDs.textArea.innerHTML = `
                        <textarea rows="8" cols="100"  placeholder="Write here..."></textarea>
                        <button value="${content}" class="btn-send-report" >Send report</button>`;
                const btnUp = document.getElementsByClassName('btn-send-report');
                btnUp[0].addEventListener('click', this.handleSendReport);
                break;
            case 'view-report':
                window.location.href = '#focusONtext';
                this.#classNamesAndIDs.textArea.innerHTML = '';
                this.#classNamesAndIDs.textArea.innerHTML = `
                        <textarea rows="8" cols="100" disabled>${content}</textarea>
                        <button value="${content}" class="btn-send-report">Close report</button>`;
                const btnclose = document.getElementsByClassName('btn-send-report');
                btnclose[0].addEventListener('click', ()=>{
                    window.location.reload();
                });
                break;
            case 'last-commits':
                this.#classNamesAndIDs.commitsBox.innerHTML = ``;
                content.forEach(element => {
                    const date = new Date(element.date);
                    const day = `${date.getFullYear()}/${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}`;
                    const hour = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;
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

        document.querySelectorAll('.btn-save-report').forEach(btn => {
            btn.removeEventListener('click', this.handleSaveReport);
            btn.addEventListener('click', this.handleSaveReport);
        });

        document.querySelectorAll('.btn-view-report').forEach(btn => {
            btn.removeEventListener('click', this.handleViewClick);
            btn.addEventListener('click', this.handleViewClick);
        });

        document.querySelectorAll('.dayNormal').forEach(btn => {
            btn.removeEventListener('click', this.handleDayClick);
            btn.addEventListener('click', this.handleDayClick);
        });

        this.dropzone();

        const btnCommit = document.getElementById('btn-commit');
        btnCommit.addEventListener('click', async () => {
            await this.sendCommitFile();
        })

        enableBtnsCalendar();
    }

    handleEditClick = (event) => {
        this.printElements('edit-report', event.target.getAttribute('value'));  
    };

    handleViewClick = (event) => {
        const task = this.tasks.filter(task => task._id == event.target.getAttribute('value'));
        this.printElements('view-report', task[0].description);  
    };

    handleDayClick = (event) => {
        dialog.type(event.target.getAttribute('data-value'));
    };

    handleSendReport = async (event) => {
        await this.updateUserTask(event.target.value);
        console.log(`SEND FILE`);

    }

    handleSaveReport = async (event) => {
        await this.sendUserTask(event.target.getAttribute("value"));
    }

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
        document.addEventListener('dialogClosed', () => {
            this.enableBtns();
            this.restartTasks();
        }); // Garante que this seja mantido
    }

    async restartTasks() {
        await this.storageInfoUser();
        this.renderHistoric();
        this.renderTasksInProgress();
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

