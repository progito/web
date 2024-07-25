let isMenuClosed = false;
const username = localStorage.getItem("user");
const country = localStorage.getItem("country");

const langs = localStorage.getItem("langs");

document.title = "Личный кабинет";

const py = JSON.parse(localStorage.getItem("py"));
const c = JSON.parse(localStorage.getItem("c"));
const js = JSON.parse(localStorage.getItem("js"));

const proc_py = localStorage.getItem("proc_py");
const proc_c = localStorage.getItem("proc_c");
const proc_js = localStorage.getItem("proc_js");

const itog_py = localStorage.getItem("itog_py");
const itog_c = localStorage.getItem("itog_c");
const itog_js = localStorage.getItem("itog_js");

const itog_ppy = localStorage.getItem("itog_ppy");
const itog_pc = localStorage.getItem("itog_pc");
const itog_pjs = localStorage.getItem("itog_pjs");

const pract_py = localStorage.getItem("pract_py");
const pract_c = localStorage.getItem("pract_c");
const pract_js = localStorage.getItem("pract_js");

const url = localStorage.getItem("avatar");

const name_div = document.querySelector('.user-info');
name_div.innerHTML = `
<div class="user-avatar"></div>
<span class="user-name">${username}</span>
`

const user_avatar = document.getElementsByClassName("user-avatar")[0];
if (url != " " && url != undefined){
    user_avatar.style.background = `url("${url}")`;
}

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
        for (let i = -1; i < 13; i++) {
            const scheduleRow = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const td = document.createElement('td');
                const cellValue = schedule[j][i];                
                if (cellValue !== undefined) {
                    td.textContent = cellValue;
                }
                console.log(schedule[j][i])
                if (schedule[j][i] != "" && schedule[j][i] != undefined){
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

        for (let j = 0; j < 13; j++) {
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
                    console.log(userSchedule)
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
if (isMobileDevice()){
    toggleSidebar()
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

function saveSettings(){
    const avatarUrl = document.getElementById("avatar").value;
    localStorage.setItem("avatar", avatarUrl);
}

// Создаем функцию для создания круглой иконки языка
function createLanguageIcon(language, imageUrl) {
    const icon = document.createElement('div');
    icon.classList.add('language-icon');
    icon.setAttribute('title', language); // Добавляем подсказку с именем языка

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = language; // Устанавливаем атрибут alt для доступности

    // Настраиваем стили для div и img
    icon.style.width = '55px';
    icon.style.height = '55px';
    icon.style.borderRadius = '50%';
    icon.style.overflow = 'hidden';
    icon.style.border = '2px solid #333';
    icon.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    icon.style.transition = 'transform 0.3s ease-in-out';
    icon.style.cursor = 'pointer';
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    icon.style.justifyContent = 'center';

    if (language === "C/C++") {
        img.style.width = '70px';
        img.style.height = '70px';
    } else {
        img.style.width = '50px';
        img.style.height = '50px';
    }
    img.style.objectFit = 'cover'; // Изображение заполняет всю область img без искажений

    // Добавляем img внутрь div
    icon.appendChild(img);

    // Добавляем обработчик событий для эффекта при наведении
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });

    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    return icon;
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

    const langsArray = JSON.parse(langs);

    const languages = document.createElement('div');
    languages.classList.add('languages', 'panel');
    languages.innerHTML = `<span>Изучаемые языки: </span>`;
    

    // Маппинг для соответствия языков и их изображений
    const languageImages = {
        "Python": "https://upload.wikimedia.org/wikipedia/commons/3/31/Python-logo.png",
        "C/C++": "https://stage.digilabs.ai/wp-content/uploads/2023/10/C.png",
        "JavaScript": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Front-end-logo-color%402x.png"
    };

    // Проходим по массиву языков и создаем иконки для каждого языка
    langsArray.forEach(language => {
        const imageUrl = languageImages[language];
        if (imageUrl) {
            const icon = createLanguageIcon(language, imageUrl);
            icon.onclick = () => { showCourses(1); }; // Pass index 1 to showCourses
            languages.appendChild(icon);
        }
    });

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

    // Fetch user data from the JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(userData => {
            const user = userData.users.find(u => u.user === localStorage.getItem("user"));
            
            
            // Display notification blocks only if proc_py is greater than 20
            if (user.proc_py >= 13) {
                // Создаем элементы для раздела уведомлений
                const notifications = document.createElement('div');
                notifications.classList.add('notifications');

                // Создаем блок уведомления 1
                const notificationBlock1 = createNotificationBlock(
                    'Повторение Python #1',
                    'В этом видео повторим базовые понятия от компиляции программы до PEP8.',
                    'https://cdn.sites.univibes.ru/univibes.ru/2023/06/mini_programming-background-with-person-working-with-codes-on-computer.jpg',
                    'Смотреть',
                    'https://www.youtube.com/embed/mJia7Wu5QGM'

                );

                // Создаем блок уведомления 2
                const notificationBlock2 = createNotificationBlock(
                    'Как пройти собеседование?',
                    'Классные лайфхаки по проходу собеседований!',
                    'https://medportal.ru/pictures/article/6278b394-1c9d-428d-bb47-9a643cca900e/medium.jpg',
                    'Перейти',
                    '#'
                );

                // Добавляем блоки уведомлений к разделу уведомлений
                notifications.appendChild(notificationBlock1);
                notifications.appendChild(notificationBlock2);
                if (user.proc_py >= 25) {
                    const notificationBlock3 = createNotificationBlock(
                        'Повторение Python #2 (коллекции)',
                        'Повторим коллекции в Python (cписки, кортежи..)',
                        'https://248006.selcdn.ru/main/iblock/9ce/9ce0a2979cd753d450272cf40f76ad3d/f60d2152225079701f9cec28e0564241.png',
                        'Смотреть',
                        'https://www.youtube.com/embed/-xHGeeYoyQI'
                    );
                    notifications.appendChild(notificationBlock3);
                    if (user.proc_py >= 30) {
                        const notificationBlock4 = createNotificationBlock(
                            'Повторение Python #3 (функции)',
                            'Повторим функции в Python (виды, параметры, lambda, декораторы...)',
                            'https://static.tildacdn.com/tild6237-3263-4233-b164-316631353331/Smartiqa_Workbook_Py.png',
                            'Смотреть',
                            'https://www.youtube.com/embed/5gH1dimQumI'
                        );
                        notifications.appendChild(notificationBlock4);
                        if (user.proc_py >= 30) {
                            const notificationBlock5 = createNotificationBlock(
                                'Повторение Python #4 (ООП)',
                                'Повторим ООП в Python (классы, объекты и др)',
                                'https://dev-gang.ru/static/storage/112260987635916824610320717826339060167.jpeg',
                                'Смотреть',
                                'https://www.youtube.com/embed/FEEBPoZYQuo'
                            );
                            notifications.appendChild(notificationBlock5);
                            if (user.proc_py >= 30) {
                                const notificationBlock6 = createNotificationBlock(
                                    'Python #5 (Особенность FOR)',
                                    'Разберем прикольную особенность популярного цикла for...',
                                    'https://coderpad.io/wp-content/uploads/2021/05/img_6094fcc2be38c.png',
                                    'Смотреть',
                                    'https://www.youtube.com/embed/a4IzB5McbuY'
                                );
                                notifications.appendChild(notificationBlock6);
                                if (user.proc_py >= 39) {
                                const notificationBlock6 = createNotificationBlock(
                                    'Python #6 (Исключения и обработка ошибок)',
                                    'Повторим Исключения и обработку ошибок (RAISE, TRY, EXCEPT..) в Python',
                                    'https://pythonchik.ru/pic/lb1/cover_4a783694-d0ad-45e1-af70-2aaac93c8a1f_big2x.jpeg',
                                    'Смотреть',
                                    'https://www.youtube.com/embed/U1456ECaTNQ'
                                );
                                const notificationBlock7 = createNotificationBlock(
                                    'Python #7 (Алгоритмы + введение в структуры данных (стек, очередь, дек))',
                                    'Повторим базовый АИСД в Python',
                                    'https://gbcdn.mrgcdn.ru/uploads/geekbrains/public/ckeditor_assets/pictures/10111/retina-af076cecf7261c7c53dc6c911b7226f6.png',
                                    'Смотреть',
                                    'https://www.youtube.com/embed/5m7L24qlwrk?si=zzkDXkk3W4r276i9'
                                );
                                notifications.appendChild(notificationBlock6);
                                notifications.appendChild(notificationBlock7);
                            }
                            }
                        }
                    }
                    
                    
                }
                // Добавляем раздел уведомлений в основное содержимое
                mainContent.appendChild(notifications);
            } else {
                const notifications = document.createElement('div');
                notifications.classList.add('notifications');
                // Создаем блок уведомления 2
                const notificationBlock2 = createNotificationBlock(
                    'Как пройти собеседование?',
                    'Классные лайфхаки по проходу собеседований!',
                    'https://medportal.ru/pictures/article/6278b394-1c9d-428d-bb47-9a643cca900e/medium.jpg',
                    'Перейти',
                    '#'
                );

               
                notifications.appendChild(notificationBlock2);

                mainContent.appendChild(notifications);
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
}


function createNotificationBlock(title, description, imageUrl, buttonText, link) {
    const notificationBlock = document.createElement('div');
    notificationBlock.classList.add('notification-block');

    const img = document.createElement('img');
    img.classList.add('notification-img');
    img.src = imageUrl;
    img.alt = title;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;

    const button = document.createElement('button');
    button.classList.add('notification-button');
    button.textContent = buttonText;
    button.onclick=()=>{
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '';
        if (link != "#"){

            const videoContainer = createVideoContainer(link);
            mainContent.appendChild(videoContainer);
        } else {
            const data = {
                "T": "Как успешно пройти собеседование на IT специалиста",
                "H": "Подготовка к собеседованию",
                "P": "Собеседование на IT специалиста — важный этап в карьере, где вам предстоит продемонстрировать свои навыки и знания. Подготовьтесь тщательно, изучив требования компании, в которой вы собираетесь проходить собеседование. Познакомьтесь с их проектами, используемыми технологиями и основными задачами.",
            
                "H2": "Обзор технических вопросов",
                "P2": "Ожидайте вопросы, связанные с вашими техническими навыками. Подготовьтесь рассказать о проектах, в которых вы участвовали, используемых вами технологиях, архитектурных решениях. Практикуйтесь в решении задач по кодированию и освежите знания в области алгоритмов и структур данных.",
            
                "H3": "Стратегии ответов на технические вопросы",
                "P3": "Будьте готовы к детальным вопросам по вашему опыту работы. Структурируйте свои ответы, демонстрируя, как ваши навыки соответствуют требованиям позиции. Если у вас есть проекты, которые можно показать, подготовьте их демонстрацию. Расскажите о трудностях, с которыми вы сталкивались, и о том, как их преодолели.",
            
                "H4": "Мягкие навыки и коммуникация",
                "P4": "Собеседование — это не только проверка технических знаний, но и оценка ваших мягких навыков. Работодатели ценят коммуникабельность, способность к командной работе, инициативность. Подготовьтесь к вопросам о ситуациях, когда вам приходилось решать проблемы в коллективе, управлять проектами или вносить свой вклад в командный успех.",
            
                "H5": "Завершение собеседования",
                "P5": "Завершите собеседование с вопросами о компании, ваших будущих задачах и перспективах развития. Выразите интерес к дальнейшему общению и выясните следующие шаги в процессе отбора. После собеседования не забудьте отправить благодарственное письмо, выражающее ваш интерес к позиции и компании."
            };
            const artCont = formedArticle(data);
            mainContent.appendChild(artCont);
        }
        

    }

    notificationBlock.appendChild(img);
    notificationBlock.appendChild(titleElement);
    notificationBlock.appendChild(descriptionElement);
    notificationBlock.appendChild(button);

    return notificationBlock;
}
function formedArticle(data) {
    const articleContainer = document.createElement('div');
    articleContainer.classList.add('article-container');

    // Check if the "T" key (title) exists in the data object
    if (data["T"]) {
        const articleTitle = document.createElement('h2');
        articleTitle.textContent = data["T"];
        articleContainer.appendChild(articleTitle);
    }

    // Check if the "H" key (subtitle) exists in the data object
    if (data["H"]) {
        const articleSubtitle = document.createElement('h3');
        articleSubtitle.textContent = data["H"];
        articleContainer.appendChild(articleSubtitle);
    }

    // Check if the "P" key (paragraph) exists in the data object
    if (data["P"]) {
        const articleParagraph = document.createElement('p');
        articleParagraph.textContent = data["P"];
        articleContainer.appendChild(articleParagraph);
    }

    // Check if the "H2" key (another subtitle) exists in the data object
    if (data["H2"]) {
        const anotherSubtitle = document.createElement('h3');
        anotherSubtitle.textContent = data["H2"];
        articleContainer.appendChild(anotherSubtitle);
    }
    if (data["P2"]) {
        const articleParagraph = document.createElement('p');
        articleParagraph.textContent = data["P2"];
        articleContainer.appendChild(articleParagraph);
    }

    // Check if the "H2" key (another subtitle) exists in the data object
    if (data["H3"]) {
        const anotherSubtitle = document.createElement('h3');
        anotherSubtitle.textContent = data["H3"];
        articleContainer.appendChild(anotherSubtitle);
    }
    if (data["P3"]) {
        const articleParagraph = document.createElement('p');
        articleParagraph.textContent = data["P3"];
        articleContainer.appendChild(articleParagraph);
    }

    // Check if the "H2" key (another subtitle) exists in the data object
    if (data["H4"]) {
        const anotherSubtitle = document.createElement('h3');
        anotherSubtitle.textContent = data["H4"];
        articleContainer.appendChild(anotherSubtitle);
    }
    if (data["P4"]) {
        const articleParagraph = document.createElement('p');
        articleParagraph.textContent = data["P4"];
        articleContainer.appendChild(articleParagraph);
    }

    // Check if the "H2" key (another subtitle) exists in the data object
    if (data["H5"]) {
        const anotherSubtitle = document.createElement('h3');
        anotherSubtitle.textContent = data["H5"];
        articleContainer.appendChild(anotherSubtitle);
    }
    if (data["P5"]) {
        const articleParagraph = document.createElement('p');
        articleParagraph.textContent = data["P5"];
        articleContainer.appendChild(articleParagraph);
    }
    return articleContainer;
}
showProfile()
async function check(event) {
    event.preventDefault();

    const response = await fetch('data.json');
    const data = await response.json();
   
    if (data.user == username){

    }
}

function createVideoContainer(link) {
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container');

    const video = document.createElement('iframe');
    video.id = 'myVideo';
    video.width = '560'; // Adjust the width as needed
    video.height = '700px'; // Adjust the height as needed
    video.src = link;
    video.allowFullscreen = true; // Allow the video to be played in fullscreen mode

    videoContainer.appendChild(video);

    return videoContainer;
}

function super_(){
    const mainContent = document.querySelector('.main-content');

    // Очищаем текущий контент
    mainContent.innerHTML = '';

    const f = document.createElement('iframe');
    if (isMobileDevice()){
        f.width = '350';
        f.height = '900';
    }
    else{f.width = '100%'; f.height = '1200';} // Adjust the width as needed
    // Adjust the height as needed
    f.src = 'marafon.html';

    mainContent.appendChild(f);
}

function windowExtension() {
    const mainContent = document.querySelector('.main-content');

    // Очищаем текущий контент
    mainContent.innerHTML = '';

    const f = document.createElement('iframe');
    if (isMobileDevice()){
        f.width = '350';
        f.height = '900';
    }
    else{f.width = '100%'; f.height = '1200';} // Adjust the width as needed
    // Adjust the height as needed
    f.src = 'app.html';

    mainContent.appendChild(f);
}

function windowExam() {
    const mainContent = document.querySelector('.main-content');

    // Очищаем текущий контент
    mainContent.innerHTML = '';

    const f = document.createElement('iframe');
    if (isMobileDevice()){
        f.width = '350';
        f.height = '900';
    }
    else{f.width = '100%'; f.height = '1200';} // Adjust the width as needed
    // Adjust the height as needed
    f.src = 'exam.html';

    mainContent.appendChild(f);
}

function windowTasking() {
    const mainContent = document.querySelector('.main-content');

    // Очищаем текущий контент
    mainContent.innerHTML = '';

    // Создаем карточки курсов
    const courses = [
        { title: "🎙🧧0A - Защита ОР/ИР", imageUrl: "/css/img/0a.png" },
        { title: "🎙K1 - Python", imageUrl: "/css/img/k1.png" },
        { title: "🎙K2 - C/C++", imageUrl: "/css/img/k2.png" },
        { title: "🎙K3 - Frontend", imageUrl: "/css/img/k3.png" }
    ];

    const urlsLesson = [
        "https://meet.jit.si/programlessonorirzashita8yf728yf8728723684781791",
        "https://meet.jit.si/programlessonpython3745871523466187",
        "https://meet.jit.si/programlessonccplusplus832r7y287t673214",
        "https://meet.jit.si/programlessonfrontenduwyf87268736r81763481",
    ];

    let j = 0;

    courses.forEach((course, index) => {
        // Создаем элементы для карточки курса
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        courseCard.style.cursor = 'pointer'; // Изменяем курсор при наведении

        const backgroundDiv = document.createElement('div');
        backgroundDiv.classList.add('background-image');
        backgroundDiv.style.backgroundImage = `url(${course.imageUrl})`;

        const textBlock = document.createElement('div');
        textBlock.classList.add('text-block');
        const courseTitle = document.createElement('h3');
        courseTitle.textContent = course.title;
        textBlock.appendChild(courseTitle);

        // Добавляем обработчик клика для открытия соответствующего iframe
        courseCard.addEventListener('click', function() {
            mainContent.innerHTML = ''; // Очищаем текущее содержимое
        
            // Создаем iframe
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', urlsLesson[index]); // Устанавливаем URL из массива urlsLesson
            iframe.setAttribute('width', isMobileDevice() ? '350' : '100%');
            iframe.setAttribute('height', isMobileDevice() ? '600' : '720');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('style', 'border: 0;');
        
            mainContent.appendChild(iframe); // Добавляем iframe в основное содержимое
            mainContent.appendChild()
        });
        

        // Добавляем элементы в карточку курса
        backgroundDiv.appendChild(textBlock);
        courseCard.appendChild(backgroundDiv);
        mainContent.appendChild(courseCard); // Добавляем карточку курса в основное содержимое
    });

    // Обновляем заголовок в зависимости от онлайн-статуса
    document.title = navigator.onLine ? "🟢 Online" : "❌ Offline";
}

// Добавляем функцию для отображения разделов
function showSection(section) {
    const mainContent = document.querySelector('.main-content');

    // Очищаем текущий контент
    mainContent.innerHTML = '';

    // Создаем элементы для раздела
    const sectionElement = document.createElement('div');
    sectionElement.classList.add(section);
    document.title = "Личный кабинет";
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
        case 'extension':
            windowExtension();
            break;
        case 'exam':
            windowExam();
            break;
        case 'tasking':
            windowTasking();
            break;
        case 'super':
            super_();
            break;
        default:
            break;
    }

    // Добавляем элементы к разделу
    mainContent.appendChild(sectionElement);
}

let courses_ = ['C/C++', 'Python', 'Frontend', 'GIT/GITHUB', 'Harvard University (course)']

function showCourses() {
    const mainContent = document.querySelector('.main-content');
    
    // Очищаем текущий контент
    mainContent.innerHTML = '';

    // Создаем элементы для раздела "Учеба"
    const coursesSection = document.createElement('div');
    coursesSection.classList.add('courses');
    
    // Добавляем три панели курса CSS
    for (let i = 0; i <= 4; i++) {
        const coursePanel = document.createElement('div');
        coursePanel.classList.add('course-panel');

        const courseTitle = document.createElement('h3');
        courseTitle.textContent = `Курс ${courses_[i]}`;

        const courseContent = document.createElement('p');
        if (courses_[i] == 'GIT/GITHUB'){
            courseContent.textContent = `Developer`;
        }
        else if (courses_[i] == 'Harvard University (course)'){
            courseContent.textContent = `Computer Science`;
        }
        else{
            courseContent.textContent = `Junior/Middle Developer`;
        }
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
