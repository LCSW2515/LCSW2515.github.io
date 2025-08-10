(() => {
    const taskForm = document.getElementById('task-form');
    const tasksListEl = document.getElementById('tasks-list');
    const successMsg = document.getElementById('task-success-message');
    const errorMsg = document.getElementById('task-error-message');
    const exportBtn = document.getElementById('export-tasks-btn');
    const clearFormBtn = document.getElementById('clear-form-btn');
  
    // Form inputs
    const taskIdInput = document.getElementById('task-id');
    const titleInput = document.getElementById('task-title');
    const descInput = document.getElementById('task-description');
    const priorityInput = document.getElementById('task-priority');
    const statusInput = document.getElementById('task-status');
    const createdDateInput = document.getElementById('task-created-date');
    const dueDateInput = document.getElementById('task-due-date');
    const tagsInput = document.getElementById('task-tags');
  
    const STORAGE_KEY = 'brewnex_tasks';
  
    let tasks = [];
  
    // Create an element to show live error message for title
    const titleErrorMsg = document.createElement('div');
    titleErrorMsg.style.color = 'red';
    titleErrorMsg.style.fontSize = '0.9em';
    titleErrorMsg.style.marginTop = '4px';
    titleInput.parentNode.insertBefore(titleErrorMsg, titleInput.nextSibling);
  
    // Generate unique ID
    function generateId() {
      return 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
  
    // Load tasks from localStorage
    function loadTasks() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          tasks = JSON.parse(stored);
        } catch {
          tasks = [];
        }
      }
    }
  
    // Save tasks to localStorage
    function saveTasks() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  
    // Render all tasks below the form
    function renderTasks() {
      if (tasks.length === 0) {
        tasksListEl.innerHTML = '<p>No tasks available. Add a new task!</p>';
        return;
      }
  
      tasksListEl.innerHTML = '';
  
      tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        taskDiv.style = `
          border: 1px solid #ccc;
          border-left: 6px solid ${getPriorityColor(task.priority)};
          padding: 10px;
          margin-bottom: 8px;
          background: #f9f9f9;
        `;
  
        taskDiv.innerHTML = `
          <strong>${task.title}</strong> 
          <small> [${task.status}]</small><br />
          <em>${task.description || ''}</em><br />
          Priority: <span style="color:${getPriorityColor(task.priority)}">${task.priority}</span> | 
          Created: ${task.createdDate} | Due: ${task.dueDate}<br />
          Tags: ${task.tags.length ? task.tags.join(', ') : '-'}
          <br />
          <button data-id="${task.id}" class="edit-btn" style="margin-top:5px;">Edit</button>
          <button data-id="${task.id}" class="delete-btn" style="margin-left:8px; background:#a33; color:#fff;">Delete</button>
        `;
  
        tasksListEl.appendChild(taskDiv);
      });
  
      // Add event listeners for edit and delete buttons
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.target.getAttribute('data-id');
          editTask(id);
        });
      });
  
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.target.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
          }
        });
      });
    }
  
    // Returns color based on priority
    function getPriorityColor(priority) {
      switch (priority) {
        case 'high': return '#d9534f'; // red
        case 'medium': return '#f0ad4e'; // orange
        case 'low': return '#5bc0de'; // blue
        default: return '#ccc';
      }
    }
  
    // Fill form with task data to edit
    function editTask(id) {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
  
      taskIdInput.value = task.id;
      titleInput.value = task.title;
      descInput.value = task.description;
      priorityInput.value = task.priority;
      statusInput.value = task.status;
      createdDateInput.value = task.createdDate;
      dueDateInput.value = task.dueDate;
      tagsInput.value = task.tags.join(', ');
  
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';
      titleErrorMsg.textContent = '';
  
      document.getElementById('save-task-btn').textContent = 'Update Task';
    }
  
    // Clear form and reset button
    function clearForm() {
      taskIdInput.value = '';
      taskForm.reset();
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';
      titleErrorMsg.textContent = '';
      document.getElementById('save-task-btn').textContent = 'Add Task';
  
      // Set createdDate default to today
      const today = new Date().toISOString().split('T')[0];
      createdDateInput.value = today;
    }
  
    // Live validation function for title
    function validateTitleLive() {
      const titleVal = titleInput.value.trim();
      const currentId = taskIdInput.value;
      const titleLower = titleVal.toLowerCase();
  
      if (titleVal.length === 0) {
        titleErrorMsg.textContent = '';
        return false;
      }
      if (titleVal.length < 3) {
        titleErrorMsg.textContent = 'Title must be at least 3 characters.';
        return false;
      }
  
      // Check duplicate
      const duplicate = tasks.find(
        t => t.title.toLowerCase() === titleLower && t.id !== currentId
      );
  
      if (duplicate) {
        titleErrorMsg.textContent = 'Oops! This title already exists.';
        return false;
      }
  
      titleErrorMsg.textContent = '';
      return true;
    }
  
    // Validate form fields (basic + new validations)
    function validateForm() {
      const isTitleValid = validateTitleLive();
      if (!isTitleValid) return { valid: false, message: titleErrorMsg.textContent };
  
      if (!priorityInput.value) return { valid: false, message: 'Priority must be selected' };
      if (!statusInput.value) return { valid: false, message: 'Status must be selected' };
      if (!createdDateInput.value) return { valid: false, message: 'Created date is required' };
      if (!dueDateInput.value) return { valid: false, message: 'Due date is required' };
  
      // Due date cannot be in the past (compared to today)
      const today = new Date();
      today.setHours(0,0,0,0); // zero time
      const dueDate = new Date(dueDateInput.value);
      if (dueDate < today) return { valid: false, message: 'Oops! Due date cannot be in the past' };
  
      return { valid: true };
    }
  
    // Form submission handler
    taskForm.addEventListener('submit', e => {
      e.preventDefault();
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';
  
      const validation = validateForm();
      if (!validation.valid) {
        errorMsg.textContent = `⚠️ ${validation.message}`;
        errorMsg.style.display = 'block';
        return;
      }
  
      const id = taskIdInput.value || generateId();
  
      const newTask = {
        id,
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        priority: priorityInput.value,
        status: statusInput.value,
        createdDate: createdDateInput.value,
        dueDate: dueDateInput.value,
        tags: tagsInput.value
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0),
      };
  
      const existingIndex = tasks.findIndex(t => t.id === id);
  
      if (existingIndex >= 0) {
        tasks[existingIndex] = newTask;
      } else {
        tasks.push(newTask);
      }
  
      saveTasks();
      renderTasks();
      clearForm();
  
      successMsg.style.display = 'block';
    });
  
    // Clear form button handler
    clearFormBtn.addEventListener('click', () => {
      clearForm();
    });
  
    // Export tasks as JSON file
    exportBtn.addEventListener('click', () => {
      if (tasks.length === 0) {
        alert('No tasks to export!');
        return;
      }
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'brewnex_tasks.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  
    // Add event listener for input changes on title (live validation)
    titleInput.addEventListener('input', validateTitleLive);
  
    // Initialize
    function init() {
      loadTasks();
      renderTasks();
      clearForm();
    }
  
    init();
  })();
  

