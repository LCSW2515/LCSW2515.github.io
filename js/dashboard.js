document.addEventListener("DOMContentLoaded", () => {
    loadWeather();
    loadQuote();
    loadTaskSummary();
});

// Load Weather from OpenWeatherMap API
function loadWeather() {
    const apiKey = "2952f9656ea297df6846888d1fab6eab"; 
    const city = "Sarnia";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Weather API Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Show weather info
            document.getElementById("weather").innerText =
            `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
            
            // Prepare map iframe URL centered on city coordinates
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.05}%2C${lat-0.05}%2C${lon+0.05}%2C${lat+0.05}&layer=mapnik&marker=${lat}%2C${lon}`;

            // Insert iframe in weather-map div
            document.getElementById("weather-map").innerHTML = `
                <iframe width="100%" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
                    src="${mapUrl}" style="border:0;"></iframe>`;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("weather").innerText = "Unable to load weather.";
            document.getElementById("weather-map").innerHTML = ""; // Clear map on error
        });
}

// Load Daily Quote from Quotable API
function loadQuote(retry = true) {
    fetch("https://api.quotable.io/random")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Quote API Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("quote").innerText = `"${data.content}" — ${data.author}`;
        })
        .catch(err => {
            console.error("Quote fetch failed:", err);
            if (retry) {
                setTimeout(() => loadQuote(false), 2000);
            } else {
                document.getElementById("quote").innerText = "Unable to load quote.";
            }
        });
}

// Load Task Summary reading from your Task Manager data
function loadTaskSummary() {
    const STORAGE_KEY = 'brewnex_tasks';
    const tasksRaw = localStorage.getItem(STORAGE_KEY);

    if (!tasksRaw) {
        document.getElementById("task-summary").innerText = "No tasks found.";
        document.getElementById("task-details").innerHTML = '';
        return;
    }

    let tasks;
    try {
        tasks = JSON.parse(tasksRaw);
    } catch {
        document.getElementById("task-summary").innerText = "Task data corrupted.";
        document.getElementById("task-details").innerHTML = '';
        return;
    }

    if (!Array.isArray(tasks) || tasks.length === 0) {
        document.getElementById("task-summary").innerText = "No tasks found.";
        document.getElementById("task-details").innerHTML = '';
        return;
    }

    const completedStatuses = ['done', 'completed', 'finished'];
    const completedCount = tasks.filter(t => completedStatuses.includes(t.status.toLowerCase())).length;

    // Show summary
    document.getElementById("task-summary").innerText = `${completedCount} of ${tasks.length} tasks completed.`;

    // Build detailed task list HTML
    const detailsEl = document.getElementById("task-details");
    detailsEl.innerHTML = ''; // clear

    tasks.forEach(task => {
        const priorityColor = getPriorityColor(task.priority);
        const statusColor = getStatusColor(task.status);

        const taskHTML = `
        <div style="background: white;">
          <h3>${escapeHtml(task.title)}</h3>
          <p>
            <span>Priority: ${escapeHtml(task.priority)}</span>
            <span>Status: ${escapeHtml(task.status)}</span>
          </p>
          <p>
            Due Date: ${escapeHtml(task.dueDate)} | Created: ${escapeHtml(task.createdDate)}<br/>
            Tags: ${task.tags.length ? escapeHtml(task.tags.join(', ')) : '-'}
          </p>
          <p><em>${escapeHtml(task.description || '')}</em></p>
        </div>
      `;
      
        detailsEl.insertAdjacentHTML('beforeend', taskHTML);
    });
}

function getPriorityColor(priority) {
    switch ((priority || '').toLowerCase()) {
        case 'high': return '#d9534f';   // red
        case 'medium': return '#f0ad4e'; // orange
        case 'low': return '#5bc0de';    // blue
        default: return '#777';          // gray
    }
}

function getStatusColor(status) {
    switch ((status || '').toLowerCase()) {
        case 'done':
        case 'completed':
        case 'finished': return '#5cb85c';  // green
        case 'in progress': return '#5bc0de'; // blue
        case 'pending': return '#f0ad4e';     // orange
        case 'cancelled': return '#d9534f';   // red
        default: return '#777';                // gray
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
