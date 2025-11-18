class TodoList {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.filter = 'all';
    this.init();
  }

  init() {
    ['addBtn', 'taskInput'].forEach(id =>
      document.getElementById(id).addEventListener(id === 'addBtn' ? 'click' : 'keypress', e => {
        if (id === 'addBtn' || e.key === 'Enter') this.addTask();
      })
    );
    document.querySelectorAll('.filter-btn').forEach(btn =>
      btn.addEventListener('click', e => this.setFilter(e.target.dataset.filter))
    );
    document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
    this.render();
  }

  addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (text) {
      this.tasks.push({ id: Date.now(), text, completed: false });
      input.value = '';
      this.save();
      this.render();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
    this.render();
  }

  toggleTask(id) {
    this.tasks = this.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    this.save();
    this.render();
  }

  setFilter(f) {
    this.filter = f;
    document.querySelectorAll('.filter-btn').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.filter === f)
    );
    this.render();
  }

  clearCompleted() {
    this.tasks = this.tasks.filter(t => !t.completed);
    this.save();
    this.render();
  }

  getFilteredTasks() {
    return this.filter === 'active' ? this.tasks.filter(t => !t.completed)
         : this.filter === 'completed' ? this.tasks.filter(t => t.completed)
         : this.tasks;
  }

  save() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  render() {
    const list = document.getElementById('taskList');
    const count = document.getElementById('taskCount');
    const tasks = this.getFilteredTasks();
    list.innerHTML = tasks.map(t => `
      <li class="task-item ${t.completed ? 'completed' : ''}">
        <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''}
          onchange="todoList.toggleTask(${t.id})">
        <span class="task-text">${t.text}</span>
        <button class="delete-btn" onclick="todoList.deleteTask(${t.id})">Delete</button>
      </li>`).join('');
    count.textContent = `${this.tasks.filter(t => !t.completed).length} task(s) left`;
  }
}

const todoList = new TodoList();
