class Login {
    async #request(body) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }

        try {
            const response = await fetch('/login/', options);
            const data = await response.json();
            return data;
        }catch (err) {
            console.error(err);
        }
    }

    async #login() {
        const body = {
            email: document.getElementById('input-username').value,
            password: document.getElementById('input-password').value
        }
        const response = await this.#request(body);
        if (response.status == 404){
            alert(response.message);
            return
        }
        window.location.href = response.redirectUrl;
    }

    enableButtons() {
        const loginButton = document.getElementById('login-button');
        document.getElementsByClassName('login-form')[0].addEventListener('submit', (event)=>{
            event.preventDefault();
        })

        loginButton.addEventListener('click', ()=> {
            this.#login();
        });

        
    }

    run() {
        this.enableButtons();
    }
}

const login = new Login();
login.run();