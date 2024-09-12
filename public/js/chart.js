var myChart, myChart2;

async function drawChartDefault() {
  var canvas = document.getElementById('myChart');
  var ctx = canvas.getContext('2d');

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

    const data = {
      labels: users.map(element => element[0]),
      datasets: [{
        label: 'Atividades concluídas',
        data: tasks,  
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
        data: tasks,  
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

    var ctx2 = document.getElementById('myChart2').getContext('2d');
    if (myChart2) {
      myChart2.destroy();
    }
    myChart2 = new Chart(ctx2, config2);

  } catch (error) {
    console.log('Error fetching data:', error);
  }
}



async function drawChartPersonal(id) {
  var canvas = document.getElementById('myChart');
  var ctx = canvas.getContext('2d');

  canvas.innerHTML = '';

  try {
    const response = await fetch('/api/tasks/concludedAll/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    });

    const dataResponse = await response.json();

    console.log(dataResponse);

    const data = {
      labels: ['Não atrasadas', 'Atrasadas'],
      datasets: [{
        label: '',
        data: [
          dataResponse.filter(element => element.status).length,
          dataResponse.filter(element => !element.status).length
        ],
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)'
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
      labels: ['Não atrasadas', 'Atrasadas', 'Total'],
      datasets: [{
        label: 'Relatório de atividades',
        data: [
          dataResponse.filter(element => element.status).length,
          dataResponse.filter(element => !element.status).length,
          dataResponse.length
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(0, 0, 0, 0.6)'
        ],
        borderColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
          'rgb(0, 0, 0)'
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
  };

  const response = await fetch('/api/user/getUsersNoRoot/', options);
  const data = await response.json(); // Corrigido o uso de await para data

  // Adicionando a opção padrão "..." ao select
  const option = document.createElement('option');
  option.text = "...";
  option.value = "...";
  userSelect.appendChild(option);

  // Populando o select com os usuários
  data.forEach(user => {
    const option = document.createElement('option');
    option.value = user._id;
    option.text = user.name;
    userSelect.appendChild(option);
  });
}

filterSelectMain.addEventListener("change", () => {
  const selectedValue = filterSelectMain.value;

  if (selectedValue === 'aloneInsights') {
    filterSelectChild.innerHTML = '';
    getUsers(filterSelectChild); // Chama função para popular com usuários
  } else {
    filterSelectChild.innerHTML = `
      <option value="deliver" class="full">Entregas</option>
      <option value="delay" class="full">Atrasos</option> <!-- Corrigido o valor de "Atrasos" -->
    `;
  }
});

filterSelectChild.addEventListener("change", () => {
  const selectedValue = filterSelectChild.value;
  console.log(selectedValue);

  switch (selectedValue) {
    case 'deliver':
      drawChartDefault(); // Função para desenhar gráfico de entregas
      break;
    case 'delay':
      drawChartAllDelays(); // Função para desenhar gráfico de atrasos
      break;
    case '...':
      break; // Sem ação quando a opção "..." é selecionada
    default:
      drawChartPersonal(selectedValue); // Função para gráfico personalizado de um usuário
      break;
  }
});

// Função padrão chamada ao carregar a página
drawChartDefault();






















