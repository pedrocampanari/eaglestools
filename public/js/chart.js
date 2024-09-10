var myChart, myChart2;


async function drawChartDefault() {
  var canvas = document.getElementById('myChart');
  var ctx = canvas.getContext('2d');

  canvas.innerHTML = '';

  try {
    const response = await fetch('/api/user/getUsersNoRoot/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const dataResponse = await response.json();

    const users = dataResponse
      .map((element) => {
        if (!element.root) return [element.name, element._id];
      })
      .filter(element => element !== undefined);

    const tasks = await Promise.all(users.map(async (element) => {
      const response = await fetch('/api/user/getTasksDonesForUser/' + element[1], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      return data.length;
    }));

    console.log(users);
    console.log(tasks);

    const data = {
      labels: users.map(element => element[0]),
      datasets: [{
        label: 'Atividades concluídas',
        data: tasks,  // Usando os dados de tasks
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(0, 205, 86)',
          'rgb(0, 0, 86)',
          'rgb(120, 205, 86)'
        ],
        hoverOffset: 1
      }]
    };

    const config = {
      type: 'doughnut',
      data: data,
    };

    if (myChart) {
      myChart.destroy();
    }

    myChart = new Chart(ctx, config);
    const data2 = {
      labels: users.map(element => element[0]),
      datasets: [{
        label: 'Atividades concluídas',
        data: tasks,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    };


    const config2 = {
      type: 'bar',
      data: data2,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    };



    var ctx2 = document.getElementById('myChart2').getContext('2d');
    if (myChart2) {
      myChart2.destroy();
    }
    myChart2 = new Chart(ctx2, config2);

  } catch (error) {
    console.log('Error fetching data:', error);
  }

}

async function drawChartAllDelays() {
  var canvas = document.getElementById('myChart');
  var ctx = canvas.getContext('2d');

  canvas.innerHTML = '';

  try {
    const response = await fetch('/api/user/getUsersNoRoot/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const dataResponse = await response.json();

    const users = dataResponse
      .map((element) => {
        if (!element.root) return [element.name, element._id];
      })
      .filter(element => element !== undefined);

    const tasks = await Promise.all(users.map(async (element) => {
      const response = await fetch('/api/user/getTasksDelaysForUser/' + element[1], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      return data.length;
    }));

    const data = {
      labels: users.map(element => element[0]),
      datasets: [{
        label: 'Atividades atrasadas',
        data: tasks,  // Usando os dados de tasks
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(0, 205, 86)',
          'rgb(0, 0, 86)',
          'rgb(120, 205, 86)'
        ],
        hoverOffset: 1
      }]
    };

    const config = {
      type: 'doughnut',
      data: data,
    };

    if (myChart) {
      myChart.destroy();
    }
    myChart = new Chart(ctx, config);


    const data2 = {
      labels: users.map(element => element[0]),
      datasets: [{
        label: 'Atividades atrasadas',
        data: tasks,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    };


    const config2 = {
      type: 'bar',
      data: data2,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    };

    var canvas2 = document.getElementById('myChart2');
    var ctx2 = canvas2.getContext('2d');

    canvas2.innerHTML = '';
    if (myChart2) {
      myChart2.destroy();
    }
    myChart2 = new Chart(ctx2, config2);

  } catch (error) {
    console.log('Error fetching data:', error);
  }
}













const filterSelectChild = document.querySelector('#filter-select-child');
const filterSelectMain = document.querySelector('#filter-select-main');

async function getUsers(userSelect) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch('/api/user/getUsers/', options);
  const data = response.json();
  data.then(data => {
    data.forEach(user => {
      const option = document.createElement('option');
      option.value = user._id;
      option.text = user.name;
      userSelect.appendChild(option);
    });
  });
}




filterSelectMain.addEventListener("change", () => {
  const selectedValue = filterSelectMain.value;

  if (selectedValue == 'aloneInsights') {
    filterSelectChild.innerHTML = '';
    getUsers(filterSelectChild);
    return;
  } else {
    filterSelectChild.innerHTML = `
            <option value="deliver" class="full">Entregas</option>
            <option value="" class="full">Atrasos</option>
        `
  }
});

filterSelectChild.addEventListener("change", () => {
  const selectedValue = filterSelectChild.value;
  console.log(selectedValue)
  switch (selectedValue) {
    case 'deliver':
      drawChartDefault();
      break;
    case 'delay':
      drawChartAllDelays();
      break
  }
})

drawChartDefault();





















