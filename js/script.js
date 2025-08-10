document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLink = document.querySelector('.nav-link');

    menuToggle.addEventListener('click', function() {
        navLink.classList.toggle('active');
    });


});

function setFavicon(url) {
    let link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png"; 
    link.href = url;

    let existingFavicon = document.querySelector("link[rel='icon']");
    if (existingFavicon) {
        document.head.removeChild(existingFavicon);
    }

    document.head.appendChild(link);
}

window.onload = function() {
    setFavicon("images/fav-icon.png"); 
};

document.addEventListener('DOMContentLoaded', () => {
  const subscribeForm = document.querySelector('form.join-club');
  const successMsg = document.getElementById('success-message');

  if (subscribeForm && successMsg) {
    successMsg.style.display = 'none'; 

    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault(); 
      successMsg.style.display = 'block'; 
    });
  }
});




document.addEventListener("DOMContentLoaded", function () {
    const regForm = document.getElementById("registration-form");
    const successMessage = document.getElementById("success-message");

    if (regForm) {
      const username = document.getElementById("username");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const confirmPassword = document.getElementById("confirm-password");
      const rememberMe = document.getElementById("remember-me");

      // Pre-fill form if data exists in localStorage
      const rememberedUsername = localStorage.getItem("rememberedUsername");
      const rememberedEmail = localStorage.getItem("rememberedEmail");

      if (rememberedUsername) {
          username.value = rememberedUsername;
          rememberMe.checked = true;
      }
      if (rememberedEmail) {
          email.value = rememberedEmail;
          rememberMe.checked = true;
      }

      const showError = (input, message) => {
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains("error-message")) {
          error = document.createElement("div");
          error.className = "error-message";
          error.style.color = "red";
          error.style.fontSize = "0.85em";
          input.insertAdjacentElement("afterend", error);
        }
        error.textContent = message;
        input.style.border = "2px solid red";
      };

      const showValid = (input) => {
        clearError(input);
        input.style.border = "2px solid green";
      };

      const clearError = (input) => {
        let error = input.nextElementSibling;
        if (error && error.classList.contains("error-message")) {
          error.textContent = "";
        }
        input.style.border = "";
      };

      const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      const isStrongPassword = (password) =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);

      const validateRegister = () => {
        let valid = true;

        if (username.value.trim().length < 3) {
          showError(username, "Username must be at least 3 characters");
          valid = false;
        } else {
          showValid(username);
        }

        if (!isValidEmail(email.value.trim())) {
          showError(email, "Enter a valid email address");
          valid = false;
        } else {
          showValid(email);
        }

        if (!isStrongPassword(password.value)) {
          showError(
            password,
            "Password must be 8+ chars, include uppercase, number & special char"
          );
          valid = false;
        } else {
          showValid(password);
        }

        if (confirmPassword.value !== password.value || !confirmPassword.value) {
          showError(confirmPassword, "Passwords do not match");
          valid = false;
        } else {
          showValid(confirmPassword);
        }

        return valid;
      };

      regForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (validateRegister()) {
          // Save or clear remembered data based on checkbox
          if (rememberMe.checked) {
            localStorage.setItem("rememberedUsername", username.value);
            localStorage.setItem("rememberedEmail", email.value);
          } else {
            localStorage.removeItem("rememberedUsername");
            localStorage.removeItem("rememberedEmail");
          }

          // Show success message
          successMessage.style.display = "block";

          // Hide form for 3 seconds
          regForm.style.display = "none";

          setTimeout(() => {
            // After 3 seconds, hide success, show form and reset inputs
            successMessage.style.display = "none";
            regForm.style.display = "block";
            regForm.reset();
            [username, email, password, confirmPassword].forEach(clearError);
            rememberMe.checked = false;
          }, 3000);
        } else {
          // Hide success message if validation fails
          successMessage.style.display = "none";
          // form stays visible
        }
      });

      [username, email, password, confirmPassword].forEach((input) =>
        input.addEventListener("input", () => {
          validateRegister();
          successMessage.style.display = "none";
        })
      );
    }
  });
  


// to implement the drag-and-drop functionality
document.addEventListener('DOMContentLoaded', function() {
  const kanbanColumns = document.querySelectorAll('.kanban-column');

  document.querySelectorAll('.kanban-task').forEach(task => {
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
  });
  

  let tasks = [];

  function loadTasks() {
    const stored = localStorage.getItem('brewnex_tasks');
    if (stored) {
      try {
        tasks = JSON.parse(stored);
      } catch {
        tasks = [];
      }
    }
  }

  function clearKanban() {
    kanbanColumns.forEach(col => {
      const tasks = col.querySelectorAll('.kanban-task');
      tasks.forEach(task => task.remove());
    });
  }
  

  // Returns color for priority badges
  function getPriorityColor(priority) {
    switch (priority) {
      case 'high': return '#d9534f';   // red
      case 'medium': return '#f0ad4e'; // orange
      case 'low': return '#5bc0de';    // blue
      default: return '#ccc';
    }
  }

  // Create and add task cards to their priority column
  function renderKanbanTasks() {
    loadTasks();
  
    // If no tasks saved, do nothing (keep defaults)
    if (tasks.length === 0) return;
  
    // For each task in localStorage
    tasks.forEach(task => {
      const priority = task.priority.toLowerCase();
      const column = document.querySelector(`.kanban-column[data-status="${priority}"]`);
      if (!column) return;
  
      // Check if task already exists in DOM by ID or title to avoid duplicates
      const existing = column.querySelector(`.kanban-task[data-id="${task.id}"]`);
      if (existing) return; // already added, skip
  
      // Create new task div
      const taskDiv = document.createElement('div');
      taskDiv.className = 'kanban-task';
      taskDiv.setAttribute('draggable', 'true');
      taskDiv.setAttribute('data-id', task.id);
      taskDiv.style.borderLeft = `6px solid ${getPriorityColor(priority)}`;
      taskDiv.style.padding = '6px 10px';
      taskDiv.style.marginBottom = '6px';
      taskDiv.style.background = '#fff';
      taskDiv.style.cursor = 'grab';
      taskDiv.textContent = task.title;
  
      // Attach drag events
      taskDiv.addEventListener('dragstart', dragStart);
      taskDiv.addEventListener('dragend', dragEnd);
  
      // Append new task after existing default tasks
      column.appendChild(taskDiv);
    });
  }
    
  // Drag & drop handlers
  function dragStart() {
    this.classList.add('dragging');
  }

  function dragEnd() {
    this.classList.remove('dragging');
  }

  function dragOver(e) {
    e.preventDefault();
    const draggingTask = document.querySelector('.dragging');
    if (draggingTask) this.appendChild(draggingTask);
  }

  function drop(e) {
    e.preventDefault();
    const draggingTask = document.querySelector('.dragging');
    if (!draggingTask) return;

    this.appendChild(draggingTask);

    const taskId = draggingTask.getAttribute('data-id');
    const newPriority = this.getAttribute('data-status');
    if (taskId && newPriority) {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].priority = newPriority;
        localStorage.setItem('brewnex_tasks', JSON.stringify(tasks));
        renderKanbanTasks();
      }
    }
  }

  // Add drag event listeners to columns
  kanbanColumns.forEach(col => {
    col.addEventListener('dragover', dragOver);
    col.addEventListener('drop', drop);
  });

  // Update Kanban when localStorage changes (cross-tab sync)
  window.addEventListener('storage', e => {
    if (e.key === 'brewnex_tasks') {
      renderKanbanTasks();
    }
  });

  // Poll localStorage every 2s to detect changes in same tab
  setInterval(() => {
    const currentStorage = localStorage.getItem('brewnex_tasks');
    if (currentStorage !== JSON.stringify(tasks)) {
      renderKanbanTasks();
    }
  }, 2000);

  // Initial render on page load
  renderKanbanTasks();
});
