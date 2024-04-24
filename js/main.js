//Находим элементы на странцице
const form = document.querySelector('#form'),
	taskInput = document.querySelector('#taskInput'),
	tasksList = document.querySelector('#tasksList');

let tasks = [];

if (localStorage.getItem('tasks')){
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}	

checkEmptyList();

//Добавление задач
form.addEventListener('submit', addTask);

//Удаление задач
tasksList.addEventListener('click', deleteTask);

//Выполененная задачи
tasksList.addEventListener('click', doneTask);

//Функции 
function addTask(event){
	//Отменяем отправку формы
	event.preventDefault();

	//достает текст из формы
	const taskText = taskInput.value;

	//Описываем задачу в виду объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false
	};

	//добавляем объект в массив задач
	tasks.push(newTask);

	renderTask(newTask);

	//Очищаем поле ввода и возвращаем на него фокус
	taskInput.value = '';
	taskInput.focus();

	checkEmptyList();
	
	//Сохраняем список задач в хранилище браузера LocalStorage
	saveToLocalStorage();
}

function deleteTask(event){
	//Проверяем если клик был не по кнопке удалить задачу
	if(event.target.dataset.action !== 'delete') return;
	
	//поиск родителя и удаление его
	const parentNode = event.target.closest('.list-group-item');//поиск снаружи из родителей
	
	//Определяем id задачи
	const id = Number(parentNode.id);
    
	//подходящие под условие удаляются из массива остальные остаются
	tasks = tasks.filter(function(task){
		return task.id !== id;
	});

	//Удаление задачи из разметки
	parentNode.remove(); 
	checkEmptyList();
		
	//Сохраняем список задач в хранилище браузера LocalStorage
	saveToLocalStorage();
}

function doneTask(event){
	//Проверяем что клик был не по кнопке "Задача выполнена"
	if(event.target.dataset.action !== 'done') return;

	//поиск родителя и изменение стиля у него
	const parentNode = event.target.closest('.list-group-item');//поиск снаружи родителя

	const id = Number(parentNode.id);

	//указывает в task ссылку на объект из tasks
	const task = tasks.find((task) => task.id === id);

	//обратное значение от текущего
	task.done = !task.done;

	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done'); //благодаря toggle если он есть то будет убираться если его нет то будет добавляться
	
	//Сохраняем список задач в хранилище браузера LocalStorage
	saveToLocalStorage();
}

function checkEmptyList(){
	if(tasks.length === 0){
		const emptyListEleemnt = `
			<li id="emptyList" class="list-group-item empty-list">
				<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
				<div class="empty-list__title">Список дел пуст</div>
			</li>`;
		tasksList.insertAdjacentHTML('afterbegin',emptyListEleemnt);
	}
	if(tasks.length > 0 ){
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage(){
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task){
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title' ;
    
	//формируем разметку для новой задачи
	const taskHTML = `
    <li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
        <span class='${cssClass}'>${task.text}</span>
        <div   div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`;
	
	//Добавим задачу на страницу
	tasksList.insertAdjacentHTML('beforeend',taskHTML);
}