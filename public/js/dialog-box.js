class Dialog {
    constructor() {
        this.mainTag = document.getElementsByTagName('main');
        this.dialogTag = document.getElementsByClassName('dialogBox');
        this.body = document.body;
        this.formTag = document.getElementById('action-type-dialog');
        this.btnCloseDialog = document.getElementsByClassName('btn-close-dialog');
        this.btnSaveDialog = document.getElementsByClassName('btn-save-dialog');
        this.saveConfig = { headers: { 'Content-Type': 'application/json' } };
    }

    async save() {
        const emailsList = Array.from(document.querySelectorAll('.chip')).map(element => (element.textContent).slice(0, -1));
        const name = document.getElementById('inp-name-task').value;
        const termValue = document.getElementById('inp-term').value;
        const urgency = document.getElementById('task-urgency').value;
        const category = document.getElementById('inp-category-task').value;

        if (!name || emailsList.length === 0 || !termValue || !urgency) {
            alert('Por favor, preencha todos os campos obrigatórios.');
        } else {
            const colectedData = {
                name: name,
                user: emailsList,
                ownerName: `${emailsList.join(', ')}`,
                description: '',
                status: false,
                term: new Date(termValue),
                category: category,
                urgency: urgency,
                concluded: false,
                completionDate: null
            };

            try {
                const response = await fetch('/api/task/addTask/', {
                    method: 'POST',
                    body: JSON.stringify(colectedData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.status == 200) {
                    alert('Tarefa criada!');
                    this.disableDialog();
                    window.location.reload();
                } else {
                    alert('ERRO!', data.message)
                }
            } catch (err) {
                alert(err);
            }
        }
    }

    async getDatalistUsers() {
        const response = await fetch('/api/usersDataList');
        const data = await response.json();
        return data;
    }


    applyStyleMainTag() {
        this.mainTag[0].classList.add("blocked");
    }

    removeStyleMainTag() {
        this.mainTag[0].classList.remove("blocked");
    }

    createDialog(i) {
        const formattedDate = new Date(i).toISOString().slice(0, 16);
        this.body.innerHTML += `
        <section class="dialogBox">
            <div class="container">
                <section class="config-display-dialog">
                    <div class="row">
                        <div class="title col-md-12 p-0">
                            <h1>CRIAR TAREFA +</h1>
                        </div>
                    </div>
                </section>
                <section class="config-display-dialog">
                    <div class="row">
                        <div class="col p-0">
                            <h5>Adicionar nova tarefa</h5>
                            <div>
                                <div class="label-ipt">
                                    <label>Responsáveis</label>
                                    <div class="input-container" id="recipientInput">
                                        <input type="text" id="inputField" placeholder="Digite um email">
                                        <div class="suggestions" id="suggestionsBox"></div>
                                    </div>
                                </div> 
                                <div style="display: flex;" class="disp-flex-inpt">
                                    <div class="label-ipt">
                                        <label>Nome da tarefa</label>
                                        <input class="inputs-add" type="text" name="nameTask" id="inp-name-task" placeholder="organizar laboratório<3">
                                    </div> 
                                    <div class="label-ipt">
                                        <label>Categoria (Projeto ou robô)</label>
                                        <input pattern="[PR]" maxlength="1" class="inputs-add" type="text" name="nameTask" id="inp-category-task" placeholder="P ou R">
                                    </div>  
                                </div>
                                <input class="inputs-add" type="datetime-local" name="date" id="inp-term" min="${formattedDate}" value="${formattedDate}">
                                <label for="task-urgency">Urgência:</label>
                                <input class="task-urgency" value="0" type="range" min="0" max="5" id="task-urgency" style="width: 20%">
                                
                            </div>
                        </div>
                    </div>
                </section>
                <section class="config-display-dialog">
                    <div class="row div-btn-close-dialog">
                        <div class="col-md-12 p-0 div-btns-dialog">
                            <button class="btn-save-dialog">SALVAR</button>
                            <button class="btn-close-dialog">FECHAR</button>
                        </div>
                    </div>
                </section>        
            </div>
        </section>
        `
    }

    async inputAutoComplete() {

        const contacts = await this.getDatalistUsers();
        const inputField = document.getElementById("inputField");
        const inputContainer = document.getElementById("recipientInput");
        const suggestionsBox = document.getElementById("suggestionsBox");

        inputField.addEventListener("input", function () {
            const query = inputField.value.toLowerCase();
            suggestionsBox.innerHTML = ""; // Limpa sugestões anteriores

            if (query) {
                const filteredContacts = contacts.filter(email => email.includes(query));

                if (filteredContacts.length) {
                    suggestionsBox.style.display = "block";

                    filteredContacts.forEach(email => {
                        const suggestionItem = document.createElement("div");
                        suggestionItem.classList.add("suggestion-item");
                        suggestionItem.textContent = email;

                        suggestionItem.addEventListener("click", function () {
                            createChip(email);
                            inputField.value = "";
                            suggestionsBox.style.display = "none";
                        });

                        suggestionsBox.appendChild(suggestionItem);
                    });
                } else {
                    suggestionsBox.style.display = "none";
                }
            } else {
                suggestionsBox.style.display = "none";
            }
        });

        inputField.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();

                let email = inputField.value.trim();
                if (email) {
                    createChip(email);
                    inputField.value = "";
                    suggestionsBox.style.display = "none";
                }
            }
        });

        function createChip(text) {
            const chip = document.createElement("div");
            chip.classList.add("chip");
            chip.textContent = text;
            chip.setAttribute('name', text);

            const removeBtn = document.createElement("span");
            removeBtn.classList.add("remove");
            removeBtn.textContent = "×";

            removeBtn.addEventListener("click", function () {
                chip.remove();
            });

            chip.appendChild(removeBtn);
            inputContainer.insertBefore(chip, inputField);
        }

        document.addEventListener("click", function (event) {
            if (!inputContainer.contains(event.target)) {
                suggestionsBox.style.display = "none";
            }
        });
    }

    removeDialog() {
        this.body.removeChild(this.dialogTag[0]);
    }

    enableDialog() {
        this.dialogTag[0].style.display = 'flex';
        this.applyStyleMainTag();
        this.enableEvents();
    }

    disableDialog() {
        this.dialogTag[0].style.display = 'none';
        this.removeStyleMainTag();

        setTimeout(() => {
            this.removeDialog();
            document.dispatchEvent(new Event("dialogClosed"));
        }, 50);
    }

    enableEvents() {
        this.btnCloseDialog[0].addEventListener("click", () => {
            this.disableDialog();
        });
        document.getElementById("inp-category-task").addEventListener("input", function (e) {
            const value = e.target.value.toUpperCase();
            document.getElementById("inp-category-task").value = value;
            if (!["P", "R"].includes(value)) {
                e.target.value = "";
            }
        });
        this.btnSaveDialog[0].addEventListener("click", async () => {
            await this.save();
        });

    }

    type(i) {
        this.createDialog(i);
        this.enableDialog();
        dialog.inputAutoComplete();
        console.log(i);
    }

}
const dialog = new Dialog();
