let isMenuClosed = false;
const username = localStorage.getItem("user");
const country = localStorage.getItem("country");

const langs = localStorage.getItem("langs");

const py = JSON.parse(localStorage.getItem("py"));
const c = JSON.parse(localStorage.getItem("c"));
const js = JSON.parse(localStorage.getItem("js"));

const proc_py = localStorage.getItem("proc_py");
const proc_c = localStorage.getItem("proc_c");
const proc_js = localStorage.getItem("proc_js");

const itog_py = localStorage.getItem("itog_py");
const itog_c = localStorage.getItem("itog_c");
const itog_js = localStorage.getItem("itog_js");


const name_div = document.querySelector('.user-info');
name_div.innerHTML = `
<div class="user-avatar"></div>
<span class="user-name">${username}</span>
`
let currentWeekIndex = 0;

function showPreviousWeeks() {
    if (currentWeekIndex > 0) {
        currentWeekIndex--;
        updateWeekTable();
    }
}

function showNextWeeks() {
    currentWeekIndex++;
    updateWeekTable();
}

function updateWeekTable() {
    const mainContent = document.querySelector('.main-content');

    // Очищаем текущий контент
    mainContent.innerHTML = '';

    // Создаем блок week-selector
    const weekSelectorDiv = document.createElement('div');
    weekSelectorDiv.classList.add('week-selector');

    // Создаем кнопку "Назад"
    const backButton = document.createElement('button');
    backButton.textContent = 'Назад';
    backButton.addEventListener('click', showPreviousWeeks);

    // Создаем span для отображения номера недели
    const weekNumberSpan = document.createElement('span');
    weekNumberSpan.id = 'weekNumber';
    weekNumberSpan.textContent = `Неделя: ${currentWeekIndex + 1}`;

    // Создаем кнопку "Далее"
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Далее';
    nextButton.addEventListener('click', showNextWeeks);

    // Добавляем все элементы в блок week-selector
    weekSelectorDiv.appendChild(backButton);
    weekSelectorDiv.appendChild(weekNumberSpan);
    weekSelectorDiv.appendChild(nextButton);

    // Добавляем week-selector в main-content
    mainContent.appendChild(weekSelectorDiv);

    const table = document.createElement('table');
    table.id = 'scheduleTable';
    const tbody = document.createElement('tbody');
    const thead = document.createElement('thead');
    const weekNumberElement = document.getElementById('weekNumber');

    // Остальной код для создания таблицы
    const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    const headerRow = document.createElement('tr');
    let date_start = "", date_end = "";
    daysOfWeek.forEach((day, index) => {
        const th = document.createElement('th');
        const currentDate = getStartOfWeek(addDays(new Date(), 7 * (currentWeekIndex-1)));
        const currentDay = addDays(currentDate, index);
        if (index == 0){
            date_start = formatDate(currentDay);
        }
        else if (index == 6){
            date_end = formatDate(currentDay);
        }
        th.textContent = `${day}\n${formatDate(currentDay)}`;
        headerRow.appendChild(th);
    });
    console.log(date_start, date_end)
    thead.appendChild(headerRow);
    table.appendChild(thead);
    formedSchedule(date_start, date_end)
    .then(schedule => {
        for (let i = 0; i < 8; i++) {
            const scheduleRow = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const td = document.createElement('td');
                const cellValue = schedule[j][i];                
                if (cellValue !== undefined) {
                    td.textContent = cellValue;
                }
                if (schedule[j][i] != ""){
                    td.className = "lesson_this";
                }
                scheduleRow.appendChild(td);
            }
            tbody.appendChild(scheduleRow);
        }
    })
    .catch(error => {
        console.error('Error fetching schedule:', error);
    });

    table.appendChild(tbody);
    const a = document.createElement('a');
    const br = document.createElement('br');
    a.href = "https://t.me/ProgitoCourseBot";
    a.textContent = "Запись на занятие (телеграм-бот)";
    a.target = '_blank';
    mainContent.appendChild(table);
    mainContent.appendChild(br);
    mainContent.appendChild(a);
}

async function formedSchedule(date_start, date_end){
    const response = await fetch('data.json');
    const userData = await response.json();
    let schedule = [];
    for (let i = 0; i < 7; i++) {
        schedule[i] = [];

        for (let j = 0; j < 8; j++) {
            schedule[i][j] = "";
        }
    }
    // Assuming there is a current user (you might need to adjust this part based on your use case)
    const currentUser = userData.users.find(user => user.user === localStorage.getItem("user"));
    if (localStorage.getItem("user") === "Andrey <ADMIN>"){
        for (const user of userData.users) {
            const userSchedule = user.date_lesson;

            for (const date in userSchedule) {
                if (userSchedule.hasOwnProperty(date)) {
                    // Check if the date is within the specified range
                    if (date >= date_start && date <= date_end) {
                        const dayIndex = getDayIndexFromDate(date);
                        const time = userSchedule[date][0];
                        const event = userSchedule[date][1];
                        const hours = Number(userSchedule[date][2]);

                        // Update the schedule array with the time and event information
                        const endTime = addHours(time, hours);
                        schedule[dayIndex][getSlotIndexFromTime(time)] = `[${time}-${endTime}] ${event} (${user.user})`;
                    }
                }
            }
        }
        return schedule;
    }
    else if (currentUser) {
        const object = JSON.stringify(currentUser.date_lesson);
        const pr = JSON.parse(object);
        console.log(pr)
        for (let i = 0; i < 7; i++) {
            schedule[i] = [];
    
            for (let j = 0; j < 8; j++) {
                schedule[i][j] = "";
            }
        }
    
        for (const date in pr) {
            if (pr.hasOwnProperty(date)) {
                // Check if the date is within the specified range
                if (date >= date_start && date <= date_end) {
                    const dayIndex = getDayIndexFromDate(date);
                    const time = pr[date][0];
                    const event = pr[date][1];
                    const hours = Number(pr[date][2]); // Convert the hours to a number

                    // Update the schedule array with the time and event information
                    // Calculate the end time based on the start time and duration
                    const endTime = addHours(time, hours);
                    console.log(endTime)
                    // Update the schedule array with the time and event information
                    schedule[dayIndex][getSlotIndexFromTime(time)] = `[${time}-${endTime}] ${event}`;
                }
            }
        }
        return schedule;
    } else {
        console.error('Current user not found in the data.'); // Handle the case where the current user is not found
    }
}
function addHours(time, hours) {
    // Extract hours and minutes from the time string
    const [startHours, startMinutes] = time.split(':').map(Number);

    // Calculate the end time
    let endHours = startHours + hours;
    let endMinutes = startMinutes;

    // Handle overflow from minutes to hours
    while (endMinutes >= 60) {
        endHours++;
        endMinutes -= 60;
    }

    // Format the end time as HH:mm
    const formattedEndHours = endHours.toString().padStart(2, '0');
    const formattedEndMinutes = endMinutes.toString().padStart(2, '0');

    return `${formattedEndHours}:${formattedEndMinutes}`;
}

// Helper function to get the day index based on the date
function getDayIndexFromDate(date) {
    // Parse the date string to a Date object
    const parsedDate = new Date(date);
    
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const day = parsedDate.getDay();

    // Adjust the day index based on your needs
    return (day + 7) % 7;
}


function getSlotIndexFromTime(time) {
    // Implement your logic to calculate the slot index based on the time
    // Example: Assuming time is in 'HH:mm' format
    const hours = parseInt(time.split(':')[0], 10);
    // Adjust the slot index based on your needs
    return hours - 10; // Assuming the schedule starts at 10:00 AM
}
function getISOWeek(date) {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.ceil((date - oneJan) / 86400000);
    return Math.ceil(days / 7);
}

function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
}

function getEndOfWeek(date) {
    const lastday = date.getDate() - (date.getDay() - 1) + 6;
    return new Date(date.setDate(lastday));
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function getWeekDates(year) {
    const startDate = new Date(year, 0, 1); // Начало года
    const endDate = new Date(year + 1, 0, 1); // Начало следующего года

    const weekDates = [];
    let currentDate = startDate;

    while (currentDate < endDate) {
        const startOfWeek = getStartOfWeek(currentDate);
        const endOfWeek = getEndOfWeek(currentDate);

        weekDates.push({ start: startOfWeek, end: endOfWeek });
        currentDate = addDays(endOfWeek, 1); // Переходим к следующему дню после текущей недели
    }

    return weekDates;
}


// Функция определения номера недели
function getISOWeek(date) {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.ceil((date - oneJan) / 86400000);
    return Math.ceil(days / 7);
}

function getCurrentDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: 'Europe/Moscow' // Укажите нужный часовой пояс
    };
    return now.toLocaleDateString('ru-RU', options);
}
function updateDateTime() {
    const dateTimePanel = document.querySelector('.date-time');
    if (dateTimePanel) {
        dateTimePanel.innerHTML = `<span>Здравствуйте, ${username}</span><br/><span>${getCurrentDateTime()}</span>`;
    }
}
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const closeMenuButton = document.getElementById('close-menu');
    const menuItems = document.querySelectorAll('.menu a');
    const userName = document.getElementsByClassName("user-name")[0];
    const whatsAppBtn = document.getElementById("btn-whats-app");
    if (isMenuClosed) {
        sidebar.style.width = '250px';
        closeMenuButton.innerText = '<< cвернуть меню';
        
        // Показываем текст у элементов списка
        menuItems.forEach(item => {
            item.querySelector('.menu-text').style.display = 'inline-block';
        });
        userName.style.display = "flex";
        whatsAppBtn.style.maxWidth = "200px";
        whatsAppBtn.style.fontSize = "14px";
        whatsAppBtn.style.padding = "15px 30px";
        document.getElementsByClassName("main-content")[0].style.marginLeft = "250px"
    } else {
        sidebar.style.width = '90px';
        closeMenuButton.innerText = '>>';
        
        // Скрываем текст у элементов списка
        menuItems.forEach(item => {
            item.querySelector('.menu-text').style.display = 'none';
        });

        userName.style.display = "none";
        whatsAppBtn.style.maxWidth = "60px";
        whatsAppBtn.style.fontSize = "10px";
        whatsAppBtn.style.padding = "5px 12px";
        document.getElementsByClassName("main-content")[0].style.marginLeft = "90px"
    }

    isMenuClosed = !isMenuClosed;
}

function showSettings() {
    const mainContent = document.querySelector('.main-content');

    // Очищаем текущий контент
    mainContent.innerHTML = '';

    // Создаем элементы для раздела "Настройки"
    const settingsSection = document.createElement('div');
    settingsSection.classList.add('settings');

    // Добавляем форму настроек
    const settingsForm = document.createElement('form');
    settingsForm.innerHTML = `
        <label for="username">Имя пользователя:</label>
        <input type="text" id="username" name="username" placeholder="Введите новое имя пользователя">

        <label for="city">Город:</label>
        <input type="text" id="city" name="city" placeholder="Введите новый город">

        <label for="avatar">Аватарка (URL):</label>
        <input type="text" id="avatar" name="avatar" placeholder="Введите URL аватарки">

        <button type="button" onclick="saveSettings()">Сохранить</button>
    `;

    // Добавляем форму настроек к разделу "Настройки"
    settingsSection.appendChild(settingsForm);

    // Добавляем раздел "Настройки" в основное содержимое
    mainContent.appendChild(settingsSection);
    const additionalSettingsDiv = document.querySelector('.settings');
    if (additionalSettingsDiv) {
        additionalSettingsDiv[1].remove();
    }
}

// Добавляем функцию для отображения профильной информации
function showProfile() {
    const mainContent = document.querySelector('.main-content');
    

    // Очищаем текущий контент
    mainContent.innerHTML = '';
    
    // Создаем элементы для профиля
    const profileInfo = document.createElement('div');
    profileInfo.classList.add('profile-info');

    const dateTimePanel = document.createElement('div');
    dateTimePanel.classList.add('date-time', 'panel');
    const techSupport = document.createElement('div');
    techSupport.classList.add('tech-support', 'panel');
    techSupport.innerHTML = '<span>Техническая поддержка</span><br/><span>email@email.ru</span>';
    const userData = document.createElement('div');
    userData.classList.add('user-data', 'panel');
    userData.innerHTML = `<span>Имя: ${username}</span><span>Страна/Регион: ${country}</span>`;

    const achievements = document.createElement('div');
    achievements.classList.add('achievements', 'panel');
    achievements.innerHTML = '<span>Достижения: - ';

    const languages = document.createElement('div');
    languages.classList.add('languages', 'panel');
    languages.innerHTML = `<span>Изучаемые языки: ${langs}`;

    // Добавляем элементы к профильной информации
    profileInfo.appendChild(dateTimePanel);
    profileInfo.appendChild(techSupport);
    profileInfo.appendChild(userData);
    profileInfo.appendChild(achievements);
    profileInfo.appendChild(languages);

    // Добавляем профильную информацию в основное содержимое
    mainContent.appendChild(profileInfo);
}
function showNotifications() {
    const mainContent = document.querySelector('.main-content');

    // Очищаем текущий контент
    mainContent.innerHTML = '';

    // Создаем элементы для раздела уведомлений
    const notifications = document.createElement('div');
    notifications.classList.add('notifications');

    const whatsappSection = document.createElement('div');
    whatsappSection.classList.add('whatsapp-section');
    whatsappSection.innerHTML = '<iframe style="border-radius: 10px;" src="chat.html" width="480%" height="900" frameborder="0" style="border: 0;"></iframe>';

    // Добавляем элементы к разделу уведомлений
    notifications.appendChild(whatsappSection);

    // Добавляем раздел уведомлений в основное содержимое
    mainContent.appendChild(notifications);
}
showProfile()
async function check(event) {
    event.preventDefault();

    const response = await fetch('data.json');
    const data = await response.json();
   
    if (data.user == username){

    }
}

// Начнем с отображения первой недели

// Добавляем функцию для отображения разделов
function showSection(section) {
    const mainContent = document.querySelector('.main-content');

    // Очищаем текущий контент
    mainContent.innerHTML = '';

    // Создаем элементы для раздела
    const sectionElement = document.createElement('div');
    sectionElement.classList.add(section);

    switch (section) {
        case 'profile':
            showProfile()
            break;
        case 'notifications':
            showNotifications()
            break;
        case 'education':
            showCourses();    
            break;
        case 'settings':
            showSettings();
            break;
        case 'date-lessons':
            updateWeekTable();
            break;
        
        default:
            break;
    }

    // Добавляем элементы к разделу
    mainContent.appendChild(sectionElement);
}

let courses_ = ['C/C++', 'Python', 'HTML/CSS/JS']

function showCourses() {
    const mainContent = document.querySelector('.main-content');

    // Очищаем текущий контент
    mainContent.innerHTML = '';

    // Создаем элементы для раздела "Учеба"
    const coursesSection = document.createElement('div');
    coursesSection.classList.add('courses');

    // Добавляем три панели курса CSS
    for (let i = 0; i <= 2; i++) {
        const coursePanel = document.createElement('div');
        coursePanel.classList.add('course-panel');

        const courseTitle = document.createElement('h3');
        courseTitle.textContent = `Курс ${courses_[i]}`;

        const courseContent = document.createElement('p');
        courseContent.textContent = `Junior/Middle Developer`;
        coursePanel.id = `d${i}`;
        coursePanel.onclick = () => {
            mainContent.innerHTML = '';

            // Создаем элементы для раздела уведомлений
            const courseType = document.createElement('div');
            courseType.classList.add('courseType');

            const thisCourse = document.createElement('div');
            thisCourse.classList.add('whatsapp-section');
            if (isMobileDevice()) {
                thisCourse.innerHTML = `<iframe src="c${i}.html" width="100%" height="900px" frameborder="0" style="border: 0;"></iframe>`;

            } else {
                thisCourse.innerHTML = `<iframe src="c${i}.html" width="100%" height="1500px" frameborder="0" style="border: 0;"></iframe>`;

            }
           
            courseType.appendChild(thisCourse);
            mainContent.appendChild(courseType);
        }
        // Добавляем элементы к панели курса
        coursePanel.appendChild(courseTitle);
        coursePanel.appendChild(courseContent);
        coursesSection.appendChild(coursePanel);
    }

    // Добавляем раздел "Учеба" в основное содержимое
    mainContent.appendChild(coursesSection);
}
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth < 600 && window.innerHeight < 800);
}
document.querySelector('.menu a[data-section="settings"]').addEventListener('click', function () {
    showSettings();
});
// Подписываем функцию на событие нажатия на элементы меню
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', function () {
        const section = this.getAttribute('data-section');
        showSection(section);
    });
});
setInterval(updateDateTime, 1000);