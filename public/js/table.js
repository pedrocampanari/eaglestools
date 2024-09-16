const tbody = document.querySelector('#addMembers');

const createRowsForMembers = async function () {
    const response = await fetch('/api/task/dailyTasks/');
    const data = await response.json();
    console.log(data)
    data.forEach(element => {
        tbody.innerHTML += `
        <tr class="urgencia-alta">
            <td class="urgency-${element.urgency}">${element.urgency}</td>
            <td>${element.ownerName}</td>
            <td>${element.name}</td>
        </tr>
        `
    });
}

createRowsForMembers();
