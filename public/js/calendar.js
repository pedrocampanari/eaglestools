
const calendarDays = document.getElementById('calendar-days');
const monthYear = document.getElementById('monthYear');
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function renderCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const t = new Date().getDate();
    const m = new Date().getMonth() + 1;
    const y = new Date().getFullYear();

    console.log(t, m, y);

    // Nomes dos meses em português
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    monthYear.textContent = `${monthNames[month]} de ${year}`;
    calendarDays.innerHTML = '';

    // Ajustando o primeiro dia da semana
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    // Adiciona espaços vazios para os dias anteriores ao primeiro do mês
    for (let i = 0; i < offset; i++) {
        const emptyCell = document.createElement('div');
        calendarDays.appendChild(emptyCell);
    }
    

    // Adiciona os dias do mês
    for (let i = 1; i <= lastDay; i++) {
        const date = new Date(`${year}/${month+1}/${i}`);
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        dayElement.setAttribute("onclick", `drawCreateNewTaskDinamic(this, "${date}")`);
        calendarDays.appendChild(dayElement);
    }
}

function navigateMonth(direction) {
    if (direction === 'prev') {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
    } else if (direction === 'next') {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    }
    renderCalendar(currentMonth, currentYear);
}

document.getElementById('prevMonth').addEventListener('click', () => navigateMonth('prev'));
document.getElementById('nextMonth').addEventListener('click', () => navigateMonth('next'));

// Renderiza o calendário atual ao carregar a página
renderCalendar(currentMonth, currentYear);
