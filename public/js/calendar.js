
const calendarDays = document.getElementById('calendar-days');
const monthYear = document.getElementById('monthYear');
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function renderCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Nomes dos meses em português
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    monthYear.textContent = `${monthNames[month]} de ${year}`;
    calendarDays.innerHTML = '';

    // Ajustando o primeiro dia da semana (para alinhar corretamente)
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    // Adiciona espaços vazios antes do primeiro dia do mês
    for (let i = 0; i < offset; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('empty-cell');
        calendarDays.appendChild(emptyCell);
    }

    // Adiciona os dias do mês
    for (let i = 1; i <= lastDay; i++) {
        const date = new Date(year, month, i);
        date.setHours(23, 59, 59, 999); // Garante que a comparação seja feita no final do dia
        
        const dayElement = document.createElement('div');
        dayElement.textContent = i;

        if (date.getTime() < today.getTime()) {
            dayElement.classList.add("dayLated");
        } else {
            dayElement.classList.add("dayNormal");
            dayElement.setAttribute("data-value", date.toISOString()); // Armazena a data no elemento
        }

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

function enableBtnsCalendar() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    // Verifica se os event listeners já foram adicionados
    if (!prevBtn.dataset.listenerAdded) {
        prevBtn.addEventListener('click', () => {
            navigateMonth('prev');
            document.dispatchEvent(new Event('reloadEnableBtns'));
        });
        prevBtn.dataset.listenerAdded = "true"; // Marca que o evento já foi adicionado
    }

    if (!nextBtn.dataset.listenerAdded) {
        nextBtn.addEventListener('click', () => {
            navigateMonth('next');
            document.dispatchEvent(new Event('reloadEnableBtns'));
        });
        nextBtn.dataset.listenerAdded = "true"; // Marca que o evento já foi adicionado
    }
}
// Renderiza o calendário ao carregar a página
renderCalendar(currentMonth, currentYear);
enableBtnsCalendar();
