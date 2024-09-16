const drawAlert = function (type, res) {
    const body = document.getElementsByTagName('header')[0];

    const alertClasses = {
        warning: 'alert alert-warning m-3',
        info: 'alert alert-info m-3',
        error: 'alert alert-error m-3',
        success: 'alert alert-success m-3 '
    };

    const alertElement = document.createElement('div');
    alertElement.setAttribute("class", alertClasses[type]);
    alertElement.textContent = res;

    body.append(alertElement);

    alertElement.addEventListener('click', function () {
        body.removeChild(alertElement);
        window.location.reload();
    })

    setTimeout(() => {
        body.removeChild(alertElement);
    }, 10000);

}

