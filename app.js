// DOM Elements
const menuBtn = document.querySelector('.menu-btn');
const sideMenu = document.querySelector('.side-menu');
const closeBtn = document.querySelector('.close-btn');
const newListBtn = document.getElementById('new-list-btn');
const todoSection = document.querySelector('.todo-section');
const backBtn = document.querySelector('.back-btn');
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.querySelector('.todo-list');

// Menu functionality
menuBtn.addEventListener('click', () => {
  sideMenu.classList.add('open');
});

closeBtn.addEventListener('click', () => {
  sideMenu.classList.remove('open');
});

// ToDo List functionality
newListBtn.addEventListener('click', () => {
  document.querySelector('.features').classList.add('hidden');
  todoSection.classList.remove('hidden');
});

backBtn.addEventListener('click', () => {
  todoSection.classList.add('hidden');
  document.querySelector('.features').classList.remove('hidden');
});

// Add new task
addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const taskText = todoInput.value.trim();
  if (taskText) {
    const taskId = Date.now();
    const taskItem = document.createElement('li');
    taskItem.className = 'todo-item';
    taskItem.dataset.id = taskId;
    
    taskItem.innerHTML = `
      <input type="checkbox" id="task-${taskId}">
      <label for="task-${taskId}">${taskText}</label>
      <button class="delete-btn">×</button>
    `;
    
    todoList.appendChild(taskItem);
    todoInput.value = '';
    
    // Save to localStorage
    saveTasks();
    
    // Add event listeners to new task
    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    const deleteBtn = taskItem.querySelector('.delete-btn');
    
    checkbox.addEventListener('change', () => {
      taskItem.classList.toggle('completed');
      saveTasks();
    });
    
    deleteBtn.addEventListener('click', () => {
      taskItem.remove();
      saveTasks();
    });
  }
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
  todoList.innerHTML = '';
  
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = `todo-item ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.id = task.id;
    
    taskItem.innerHTML = `
      <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
      <label for="task-${task.id}">${task.text}</label>
      <button class="delete-btn">×</button>
    `;
    
    todoList.appendChild(taskItem);
    
    // Add event listeners
    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    const deleteBtn = taskItem.querySelector('.delete-btn');
    
    checkbox.addEventListener('change', () => {
      taskItem.classList.toggle('completed');
      saveTasks();
    });
    
    deleteBtn.addEventListener('click', () => {
      taskItem.remove();
      saveTasks();
    });
  });
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.todo-item').forEach(item => {
    tasks.push({
      id: item.dataset.id,
      text: item.querySelector('label').textContent,
      completed: item.querySelector('input').checked
    });
  });
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Initialize
loadTasks();

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}