// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDU1AQULSP_-GHlv4hAjgf8dnlcQ_xd4mc",
  authDomain: "e-ride-b2928.firebaseapp.com",
  projectId: "e-ride-b2928",
  storageBucket: "e-ride-b2928.appspot.com",
  messagingSenderId: "766360236907",
  appId: "1:766360236907:web:a17ba4bc96703ead22922e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// References
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Function to format date
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

// Function to add a task
addTaskBtn.addEventListener('click', () => {
  const task = taskInput.value.trim();
  if (task) {
    const timestamp = firebase.firestore.Timestamp.now();
    db.collection("tasks").add({ task, timestamp }).then(() => {
      taskInput.value = "";
      loadTasks();
    });
  }
});

// Function to load tasks
function loadTasks() {
  taskList.innerHTML = ""; // Clear list
  db.collection("tasks").orderBy("timestamp", "desc").get().then(snapshot => {
    snapshot.forEach(doc => {
      const taskData = doc.data();
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item';
      taskItem.innerHTML = `
        <span>${taskData.task}</span>
        <span class="task-time">${formatDate(taskData.timestamp.toDate())}</span>
        <span class="task-delete" onclick="deleteTask('${doc.id}')">❌</span>
      `;
      taskList.appendChild(taskItem);
    });
  });
}

// Function to delete a task
function deleteTask(id) {
  db.collection("tasks").doc(id).delete().then(() => loadTasks());
}

// Load tasks on page load
window.onload = loadTasks;
