// WorkPulse Neo - JavaScript Functionality

let currentRole = '';
let taskIdCounter = 4;
let editingTaskId = null;
let taskToDelete = null;

// Task data structure
let tasks = [
    {
        id: 1,
        title: 'Website Redesign',
        description: 'Complete redesign of company website with modern UI',
        assignedTo: 'Emma Martinez',
        dueDate: '2024-12-15',
        priority: 'High',
        status: 'In Progress'
    },
    {
        id: 2,
        title: 'API Development',
        description: 'Develop REST API for mobile application',
        assignedTo: 'John Smith',
        dueDate: '2024-12-20',
        priority: 'Medium',
        status: 'Completed'
    },
    {
        id: 3,
        title: 'Marketing Campaign',
        description: 'Launch Q4 marketing campaign across all channels',
        assignedTo: 'Michael Johnson',
        dueDate: '2024-12-10',
        priority: 'High',
        status: 'Overdue'
    }
];

// Screen Navigation Functions
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function showWelcome() {
    showScreen('welcome-screen');
}

function showLogin(role = currentRole) {
    if (role) {
        currentRole = role;
        window.currentRole = role; // Set global variable
    }
    
    const loginTitle = document.getElementById('login-title');
    const loginBtn = document.getElementById('login-btn');
    
    if (currentRole === 'admin') {
        loginTitle.textContent = 'Admin Login';
        loginBtn.textContent = 'Login as Admin';
    } else {
        loginTitle.textContent = 'Employee Login';
        loginBtn.textContent = 'Login as Employee';
    }
    
    showScreen('login-screen');
}

function showSignup() {
    showScreen('signup-screen');
}

// Admin Dashboard Functions
function showAdminDashboard() {
    showScreen('admin-dashboard');
    // Initialize task system if needed
    if (document.getElementById('task-list')) {
        renderTasks();
        updateTaskCounters();
    }
}

function showEmployeeHub() {
    showScreen('employee-hub');
}

function showPerformanceReview() {
    showScreen('performance-review');
}

function showTaskCenter() {
    showScreen('task-center');
    // Initialize task system
    renderTasks();
    updateTaskCounters();
}

function showAttendanceCenter() {
    showScreen('attendance-center');
}

function showDepartmentAnalysis() {
    showScreen('department-analysis');
}

function showAnnouncements() {
    showScreen('announcements');
}

// Employee Dashboard Functions
function showEmployeeDashboard() {
    showScreen('employee-dashboard');
}

function showEmployeePerformance() {
    showScreen('employee-performance');
}

function showEmployeeTasks() {
    showScreen('employee-tasks');
}

function showEmployeeAttendance() {
    showScreen('employee-attendance');
}

function showEmployeeProfile() {
    showScreen('employee-profile');
}

function showEmployeeNotifications() {
    showScreen('employee-notifications');
}

function showEmployeeReports() {
    showScreen('employee-reports');
}

// Form Handling
document.addEventListener('DOMContentLoaded', function() {
    // Login form handling
    const loginForms = document.querySelectorAll('.login-form');
    loginForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value.trim();
            const password = this.querySelector('input[type="password"]').value.trim();
            
            // Validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simple credential check (for demo purposes)
            if (email.length < 5 || password.length < 3) {
                alert('Invalid email or password.');
                return;
            }
            
            // Navigate to appropriate dashboard
            if (window.currentRole === 'admin' || currentRole === 'admin') {
                showAdminDashboard();
            } else {
                showEmployeeDashboard();
            }
        });
    });
    
    // Task form submission
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('task-title').value.trim();
            const description = document.getElementById('task-description').value.trim();
            const assignedTo = document.getElementById('task-assignee').value;
            const dueDate = document.getElementById('task-due-date').value;
            const priority = document.getElementById('task-priority').value;
            const status = document.getElementById('task-status').value;
            
            // Validation
            if (!title) {
                alert('Task title is required');
                return;
            }
            if (!assignedTo) {
                alert('Please assign the task to someone');
                return;
            }
            if (!dueDate) {
                alert('Due date is required');
                return;
            }
            
            if (editingTaskId) {
                // Update existing task
                const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
                if (taskIndex !== -1) {
                    tasks[taskIndex] = {
                        ...tasks[taskIndex],
                        title,
                        description,
                        assignedTo,
                        dueDate,
                        priority,
                        status
                    };
                }
            } else {
                // Create new task
                const newTask = {
                    id: taskIdCounter++,
                    title,
                    description,
                    assignedTo,
                    dueDate,
                    priority,
                    status
                };
                tasks.push(newTask);
            }
            
            renderTasks();
            updateTaskCounters();
            closeTaskModal();
        });
    }
    
    // Delete confirmation
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    // Employee attendance check in/out event listeners
    const checkInBtn = document.getElementById('checkin-btn');
    const checkOutBtn = document.getElementById('checkout-btn');
    
    if (checkInBtn) {
        checkInBtn.addEventListener('click', handleCheckIn);
    }
    
    if (checkOutBtn) {
        checkOutBtn.addEventListener('click', handleCheckOut);
    }
    
    // Leave form submission
    const leaveForm = document.getElementById('leave-form');
    if (leaveForm) {
        leaveForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('leave-title').value.trim();
            const description = document.getElementById('leave-description').value.trim();
            const fromDate = document.getElementById('leave-from-date').value;
            const toDate = document.getElementById('leave-to-date').value;
            
            if (!title || !description || !fromDate || !toDate) {
                alert('Please fill in all fields');
                return;
            }
            
            if (new Date(fromDate) > new Date(toDate)) {
                alert('From date cannot be later than to date');
                return;
            }
            
            addLeaveRequest(title, description, fromDate, toDate);
            closeLeaveModal();
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        const taskModal = document.getElementById('task-modal');
        const deleteModal = document.getElementById('delete-modal');
        const announcementModal = document.getElementById('announcement-modal');
        const leaveModal = document.getElementById('leave-modal');
        
        if (e.target === taskModal) {
            closeTaskModal();
        }
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
        if (e.target === announcementModal) {
            closeAnnouncementModal();
        }
        if (e.target === leaveModal) {
            closeLeaveModal();
        }
    });
    
    // Task filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter tasks based on selection
            const filterType = this.textContent.toLowerCase();
            filterTasks(filterType);
        });
    });
    
    // Department filter functionality
    const departmentFilter = document.querySelector('.department-filter');
    if (departmentFilter) {
        departmentFilter.addEventListener('change', function() {
            const selectedDept = this.value;
            filterEmployeesByDepartment(selectedDept);
        });
    }
    
    // Search functionality
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchEmployees(searchTerm);
        });
    }
    
    // Leave request actions
    const approveButtons = document.querySelectorAll('.approve-btn');
    const rejectButtons = document.querySelectorAll('.reject-btn');
    
    approveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.textContent = 'Approved';
            this.style.background = 'rgba(60, 207, 78, 0.3)';
            this.disabled = true;
            
            // Hide reject button
            const rejectBtn = this.parentElement.querySelector('.reject-btn');
            if (rejectBtn) rejectBtn.style.display = 'none';
        });
    });
    
    rejectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.textContent = 'Rejected';
            this.style.background = 'rgba(255, 71, 71, 0.3)';
            this.disabled = true;
            
            // Hide approve button
            const approveBtn = this.parentElement.querySelector('.approve-btn');
            if (approveBtn) approveBtn.style.display = 'none';
        });
    });
    
    // Task progress update
    const taskActionBtns = document.querySelectorAll('.task-action-btn');
    taskActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === 'Start Task') {
                this.textContent = 'Update Progress';
                const progressBar = this.parentElement.querySelector('.progress-fill');
                if (progressBar) {
                    progressBar.style.width = '25%';
                }
                const progressText = this.parentElement.querySelector('.task-progress span');
                if (progressText) {
                    progressText.textContent = '25%';
                }
            } else if (this.textContent === 'Update Progress') {
                const progressBar = this.parentElement.querySelector('.progress-fill');
                const progressText = this.parentElement.querySelector('.task-progress span');
                const currentProgress = parseInt(progressText.textContent);
                
                if (currentProgress < 100) {
                    const newProgress = Math.min(currentProgress + 25, 100);
                    progressBar.style.width = `${newProgress}%`;
                    progressText.textContent = `${newProgress}%`;
                    
                    if (newProgress === 100) {
                        this.textContent = 'Completed';
                        this.disabled = true;
                        const statusBadge = this.parentElement.querySelector('.status-badge');
                        if (statusBadge) {
                            statusBadge.textContent = 'Completed';
                            statusBadge.className = 'status-badge completed';
                        }
                    }
                }
            }
        });
    });
    
    // Announcement form submission
    const announcementForm = document.getElementById('announcement-form');
    if (announcementForm) {
        announcementForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const titleInput = document.getElementById('announcement-title');
            const contentTextarea = document.getElementById('announcement-description');
            
            if (titleInput.value.trim() && contentTextarea.value.trim()) {
                // Create new announcement item
                const announcementList = document.querySelector('.announcement-list');
                const newAnnouncement = document.createElement('div');
                newAnnouncement.className = 'announcement-item';
                newAnnouncement.innerHTML = `
                    <h4>${titleInput.value}</h4>
                    <p>${contentTextarea.value}</p>
                    <span class="timestamp">Just now</span>
                `;
                
                // Insert at the beginning
                const firstAnnouncement = announcementList.querySelector('.announcement-item');
                if (firstAnnouncement) {
                    announcementList.insertBefore(newAnnouncement, firstAnnouncement);
                } else {
                    announcementList.appendChild(newAnnouncement);
                }
                
                closeAnnouncementModal();
            } else {
                alert('Please fill in both title and content');
            }
        });
    }
    
    // Download report functionality
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reportType = this.parentElement.querySelector('h3').textContent;
            alert(`Downloading ${reportType}...`);
            
            // Simulate download
            this.textContent = 'Downloaded';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Download';
                this.disabled = false;
            }, 2000);
        });
    });
});

// Task Management Functions
function openTaskModal(taskId = null) {
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('task-form');
    
    editingTaskId = taskId;
    
    if (taskId) {
        // Edit mode
        const task = tasks.find(t => t.id === taskId);
        modalTitle.textContent = 'Edit Task';
        submitBtn.textContent = 'Save Changes';
        
        // Pre-fill form
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-assignee').value = task.assignedTo;
        document.getElementById('task-due-date').value = task.dueDate;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-status').value = task.status;
    } else {
        // Create mode
        modalTitle.textContent = 'Create New Task';
        submitBtn.textContent = 'Create Task';
        form.reset();
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('task-due-date').value = tomorrow.toISOString().split('T')[0];
    }
    
    modal.classList.add('active');
}

function closeTaskModal() {
    const modal = document.getElementById('task-modal');
    modal.classList.remove('active');
    editingTaskId = null;
}

function editTask(taskId) {
    openTaskModal(taskId);
}

function deleteTask(taskId) {
    taskToDelete = taskId;
    const modal = document.getElementById('delete-modal');
    modal.classList.add('active');
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('active');
    taskToDelete = null;
}

function confirmDelete() {
    if (taskToDelete) {
        tasks = tasks.filter(task => task.id !== taskToDelete);
        renderTasks();
        updateTaskCounters();
        closeDeleteModal();
    }
}

function getStatusClass(status, dueDate) {
    if (status === 'Completed') return 'completed';
    if (status === 'In Progress') return 'in-progress';
    if (status === 'Not Started') return 'pending';
    
    // Check if overdue
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today && status !== 'Completed') {
        return 'overdue';
    }
    
    return 'pending';
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;
    
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const statusClass = getStatusClass(task.status, task.dueDate);
        const statusText = statusClass === 'overdue' ? 'Overdue' : task.status;
        
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.setAttribute('data-task-id', task.id);
        
        taskElement.innerHTML = `
            <div class="task-content">
                <h4>${task.title}</h4>
                <p class="task-description">${task.description}</p>
                <p>Assigned to: <span class="assigned-to">${task.assignedTo}</span></p>
                <p>Due: <span class="due-date">${task.dueDate}</span></p>
                <p>Priority: <span class="priority">${task.priority}</span></p>
            </div>
            <span class="status-badge ${statusClass}">${statusText}</span>
            <div class="task-actions">
                <i class="fas fa-edit" onclick="editTask(${task.id})"></i>
                <i class="fas fa-trash" onclick="deleteTask(${task.id})"></i>
            </div>
        `;
        
        taskList.appendChild(taskElement);
    });
}

function updateTaskCounters() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
    const overdueTasks = tasks.filter(task => {
        const today = new Date();
        const due = new Date(task.dueDate);
        return due < today && task.status !== 'Completed';
    }).length;
    
    const totalEl = document.getElementById('total-tasks');
    const completedEl = document.getElementById('completed-tasks');
    const inProgressEl = document.getElementById('in-progress-tasks');
    const overdueEl = document.getElementById('overdue-tasks');
    
    if (totalEl) totalEl.textContent = totalTasks;
    if (completedEl) completedEl.textContent = completedTasks;
    if (inProgressEl) inProgressEl.textContent = inProgressTasks;
    if (overdueEl) overdueEl.textContent = overdueTasks;
}

// Attendance Center Tab Functions
function switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Leave Request Functions
function approveLeave(requestId) {
    const actionsDiv = document.getElementById(`actions-${requestId}`);
    actionsDiv.innerHTML = '<div class="leave-status-badge approved">Approved</div>';
}

function rejectLeave(requestId) {
    const actionsDiv = document.getElementById(`actions-${requestId}`);
    actionsDiv.innerHTML = '<div class="leave-status-badge rejected">Rejected</div>';
}

// Announcement Modal Functions
function openAnnouncementModal() {
    const modal = document.getElementById('announcement-modal');
    modal.classList.add('active');
    document.getElementById('announcement-form').reset();
}

function closeAnnouncementModal() {
    const modal = document.getElementById('announcement-modal');
    modal.classList.remove('active');
}

// Employee Profile Edit Functions
let isEditMode = false;
let originalProfileData = {};

function toggleEditMode() {
    if (!isEditMode) {
        enterEditMode();
    }
}

function enterEditMode() {
    isEditMode = true;
    
    // Store original data
    originalProfileData = {
        name: document.getElementById('display-name').textContent,
        title: document.getElementById('display-title').textContent,
        email: document.getElementById('display-email').textContent,
        phone: document.getElementById('display-phone').textContent,
        department: document.getElementById('display-department').textContent,
        address: document.getElementById('display-address').textContent
    };
    
    // Hide display elements
    document.getElementById('profile-name-display').style.display = 'none';
    document.getElementById('display-email').style.display = 'none';
    document.getElementById('display-phone').style.display = 'none';
    document.getElementById('display-department').style.display = 'none';
    document.getElementById('display-address').style.display = 'none';
    
    // Show edit elements
    document.getElementById('profile-name-edit').style.display = 'block';
    document.getElementById('edit-email').style.display = 'block';
    document.getElementById('edit-phone').style.display = 'block';
    document.getElementById('edit-department').style.display = 'block';
    document.getElementById('edit-address').style.display = 'block';
    
    // Hide edit button, show save/cancel
    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('edit-actions').style.display = 'flex';
}

function saveProfile() {
    // Get updated values
    const updatedData = {
        name: document.getElementById('edit-name').value,
        title: document.getElementById('edit-title').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        department: document.getElementById('edit-department').value,
        address: document.getElementById('edit-address').value
    };
    
    // Update display elements
    document.getElementById('display-name').textContent = updatedData.name;
    document.getElementById('display-title').textContent = updatedData.title;
    document.getElementById('display-email').textContent = updatedData.email;
    document.getElementById('display-phone').textContent = updatedData.phone;
    document.getElementById('display-department').textContent = updatedData.department;
    document.getElementById('display-address').textContent = updatedData.address;
    
    exitEditMode();
}

function cancelEdit() {
    // Restore original values to edit inputs
    document.getElementById('edit-name').value = originalProfileData.name;
    document.getElementById('edit-title').value = originalProfileData.title;
    document.getElementById('edit-email').value = originalProfileData.email;
    document.getElementById('edit-phone').value = originalProfileData.phone;
    document.getElementById('edit-department').value = originalProfileData.department;
    document.getElementById('edit-address').value = originalProfileData.address;
    
    exitEditMode();
}

function exitEditMode() {
    isEditMode = false;
    
    // Show display elements
    document.getElementById('profile-name-display').style.display = 'block';
    document.getElementById('display-email').style.display = 'block';
    document.getElementById('display-phone').style.display = 'block';
    document.getElementById('display-department').style.display = 'block';
    document.getElementById('display-address').style.display = 'block';
    
    // Hide edit elements
    document.getElementById('profile-name-edit').style.display = 'none';
    document.getElementById('edit-email').style.display = 'none';
    document.getElementById('edit-phone').style.display = 'none';
    document.getElementById('edit-department').style.display = 'none';
    document.getElementById('edit-address').style.display = 'none';
    
    // Show edit button, hide save/cancel
    document.getElementById('edit-btn').style.display = 'block';
    document.getElementById('edit-actions').style.display = 'none';
}

// Employee Attendance Tab Functions
function switchEmployeeTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.emp-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.emp-tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    document.getElementById('emp-' + tabName + '-tab').classList.add('active');
}

// Check In/Out Functions
let isCheckedIn = false;
let checkInTime = null;

function handleCheckIn() {
    const now = new Date();
    checkInTime = now;
    isCheckedIn = true;
    
    // Update UI
    document.getElementById('attendance-status').textContent = 'Present';
    document.getElementById('attendance-status').classList.add('present');
    document.getElementById('login-time').textContent = now.toLocaleTimeString();
    
    // Enable check out button
    const checkOutBtn = document.getElementById('checkout-btn');
    checkOutBtn.disabled = false;
    checkOutBtn.classList.remove('disabled');
    checkOutBtn.classList.add('enabled');
    
    // Disable check in button
    const checkInBtn = document.getElementById('checkin-btn');
    checkInBtn.disabled = true;
    checkInBtn.textContent = 'Checked In';
}

function handleCheckOut() {
    const now = new Date();
    isCheckedIn = false;
    
    // Calculate working hours
    if (checkInTime) {
        const workingMs = now - checkInTime;
        const hours = Math.floor(workingMs / (1000 * 60 * 60));
        const minutes = Math.floor((workingMs % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('working-hours').textContent = `${hours}h ${minutes}m`;
    }
    
    // Update UI
    document.getElementById('logout-time').textContent = now.toLocaleTimeString();
    
    // Reset buttons for next day
    const checkOutBtn = document.getElementById('checkout-btn');
    checkOutBtn.disabled = true;
    checkOutBtn.classList.add('disabled');
    checkOutBtn.classList.remove('enabled');
    
    const checkInBtn = document.getElementById('checkin-btn');
    checkInBtn.disabled = false;
    checkInBtn.textContent = 'Check In';
}

// Leave Modal Functions
function openLeaveModal() {
    const modal = document.getElementById('leave-modal');
    modal.classList.add('active');
    document.getElementById('leave-form').reset();
    
    // Set default dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('leave-from-date').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('leave-to-date').value = tomorrow.toISOString().split('T')[0];
}

function closeLeaveModal() {
    const modal = document.getElementById('leave-modal');
    modal.classList.remove('active');
}

function addLeaveRequest(title, description, fromDate, toDate) {
    const leaveList = document.getElementById('leave-requests-list');
    const newLeave = document.createElement('div');
    newLeave.className = 'leave-request-item';
    
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    const dateRange = fromDateObj.toLocaleDateString() + ' - ' + toDateObj.toLocaleDateString();
    
    newLeave.innerHTML = `
        <div class="leave-info">
            <h4>${title}</h4>
            <p class="leave-dates">${dateRange}</p>
            <p class="leave-desc">${description}</p>
        </div>
        <span class="leave-status-badge pending">Pending</span>
    `;
    
    // Insert at the beginning
    leaveList.insertBefore(newLeave, leaveList.firstChild);
}

// Helper Functions
function filterTasks(filterType) {
    const taskItems = document.querySelectorAll('.employee-task-item');
    
    taskItems.forEach(item => {
        const statusBadge = item.querySelector('.status-badge');
        const status = statusBadge.textContent.toLowerCase();
        
        if (filterType === 'all' || status.includes(filterType.replace(' ', '-'))) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function filterEmployeesByDepartment(department) {
    const employeeCards = document.querySelectorAll('.employee-card');
    
    employeeCards.forEach(card => {
        const deptElement = card.querySelector('.department');
        if (deptElement) {
            const cardDept = deptElement.textContent;
            
            if (department === 'All Departments' || cardDept === department) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

function searchEmployees(searchTerm) {
    const employeeCards = document.querySelectorAll('.employee-card');
    
    employeeCards.forEach(card => {
        const name = card.querySelector('h4').textContent.toLowerCase();
        const role = card.querySelector('.role').textContent.toLowerCase();
        const email = card.querySelector('.contact').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || role.includes(searchTerm) || email.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Notification handling
function markNotificationAsRead(notification) {
    notification.classList.remove('unread');
}

// Auto-mark notifications as read when clicked
document.addEventListener('click', function(e) {
    if (e.target.closest('.notification-item')) {
        const notification = e.target.closest('.notification-item');
        markNotificationAsRead(notification);
    }
});

// Simulate real-time updates
function simulateRealTimeUpdates() {
    // Update notification bell with count
    const notificationBells = document.querySelectorAll('.notification-bell');
    notificationBells.forEach(bell => {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        if (unreadCount > 0) {
            bell.style.color = '#FF4747';
            bell.style.animation = 'pulse 2s infinite';
        }
    });
    
    // Update dashboard numbers periodically
    setTimeout(() => {
        const cardNumbers = document.querySelectorAll('.card-number');
        cardNumbers.forEach(number => {
            if (number.textContent.includes('%')) {
                const currentValue = parseInt(number.textContent);
                const newValue = Math.min(currentValue + Math.floor(Math.random() * 3), 100);
                number.textContent = `${newValue}%`;
            }
        });
    }, 10000);
}

// Initialize real-time updates and task system
document.addEventListener('DOMContentLoaded', function() {
    simulateRealTimeUpdates();
    
    // Initialize task system if on task center page
    if (document.getElementById('task-list')) {
        renderTasks();
        updateTaskCounters();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key to go back
    if (e.key === 'Escape') {
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen && currentScreen.id !== 'welcome-screen') {
            const backBtn = currentScreen.querySelector('.back-btn');
            if (backBtn) {
                backBtn.click();
            }
        }
    }
    
    // Ctrl/Cmd + H for home
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        showWelcome();
    }
});

// Add smooth scrolling for long content
function addSmoothScrolling() {
    const scrollableElements = document.querySelectorAll('.screen');
    scrollableElements.forEach(element => {
        element.style.scrollBehavior = 'smooth';
    });
}

// Initialize smooth scrolling
document.addEventListener('DOMContentLoaded', addSmoothScrolling);

// Performance optimization - lazy load images if any
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);tton
            this.classList.add('active');
            
            // Filter tasks based on selection
            const filterType = this.textContent.toLowerCase();
            filterTasks(filterType);
        });
    });
    
    // Department filter functionality
    const departmentFilter = document.querySelector('.department-filter');
    if (departmentFilter) {
        departmentFilter.addEventListener('change', function() {
            const selectedDept = this.value;
            filterEmployeesByDepartment(selectedDept);
        });
    }
    
    // Search functionality
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchEmployees(searchTerm);
        });
    }
    
    // Leave request actions
    const approveButtons = document.querySelectorAll('.approve-btn');
    const rejectButtons = document.querySelectorAll('.reject-btn');
    
    approveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.textContent = 'Approved';
            this.style.background = 'rgba(60, 207, 78, 0.3)';
            this.disabled = true;
            
            // Hide reject button
            const rejectBtn = this.parentElement.querySelector('.reject-btn');
            if (rejectBtn) rejectBtn.style.display = 'none';
        });
    });
    
    rejectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.textContent = 'Rejected';
            this.style.background = 'rgba(255, 71, 71, 0.3)';
            this.disabled = true;
            
            // Hide approve button
            const approveBtn = this.parentElement.querySelector('.approve-btn');
            if (approveBtn) approveBtn.style.display = 'none';
        });
    });
    
    // Check-in/Check-out functionality
    const checkInBtn = document.querySelector('.check-in');
    const checkOutBtn = document.querySelector('.check-out');
    
    if (checkInBtn) {
        checkInBtn.addEventListener('click', function() {
            const currentTime = new Date().toLocaleTimeString();
            alert(`Checked in at ${currentTime}`);
            this.disabled = true;
            this.textContent = `Checked In (${currentTime})`;
            
            if (checkOutBtn) {
                checkOutBtn.disabled = false;
            }
        });
    }
    
    if (checkOutBtn) {
        checkOutBtn.addEventListener('click', function() {
            const currentTime = new Date().toLocaleTimeString();
            alert(`Checked out at ${currentTime}`);
            this.disabled = true;
            this.textContent = `Checked Out (${currentTime})`;
            
            if (checkInBtn) {
                checkInBtn.disabled = false;
                checkInBtn.textContent = 'Check In';
            }
        });
    }
    
    // Task progress update
    const taskActionBtns = document.querySelectorAll('.task-action-btn');
    taskActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === 'Start Task') {
                this.textContent = 'Update Progress';
                const progressBar = this.parentElement.querySelector('.progress-fill');
                if (progressBar) {
                    progressBar.style.width = '25%';
                }
                const progressText = this.parentElement.querySelector('.task-progress span');
                if (progressText) {
                    progressText.textContent = '25%';
                }
            } else if (this.textContent === 'Update Progress') {
                const progressBar = this.parentElement.querySelector('.progress-fill');
                const progressText = this.parentElement.querySelector('.task-progress span');
                const currentProgress = parseInt(progressText.textContent);
                
                if (currentProgress < 100) {
                    const newProgress = Math.min(currentProgress + 25, 100);
                    progressBar.style.width = `${newProgress}%`;
                    progressText.textContent = `${newProgress}%`;
                    
                    if (newProgress === 100) {
                        this.textContent = 'Completed';
                        this.disabled = true;
                        const statusBadge = this.parentElement.querySelector('.status-badge');
                        if (statusBadge) {
                            statusBadge.textContent = 'Completed';
                            statusBadge.className = 'status-badge completed';
                        }
                    }
                }
            }
        });
    });
    
    // Announcement form submission
    const announcementForm = document.getElementById('announcement-form');
    if (announcementForm) {
        announcementForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const titleInput = document.getElementById('announcement-title');
            const contentTextarea = document.getElementById('announcement-description');
            
            if (titleInput.value.trim() && contentTextarea.value.trim()) {
                // Create new announcement item
                const announcementList = document.querySelector('.announcement-list');
                const newAnnouncement = document.createElement('div');
                newAnnouncement.className = 'announcement-item';
                newAnnouncement.innerHTML = `
                    <h4>${titleInput.value}</h4>
                    <p>${contentTextarea.value}</p>
                    <span class="timestamp">Just now</span>
                `;
                
                // Insert at the beginning
                const firstAnnouncement = announcementList.querySelector('.announcement-item');
                if (firstAnnouncement) {
                    announcementList.insertBefore(newAnnouncement, firstAnnouncement);
                } else {
                    announcementList.appendChild(newAnnouncement);
                }
                
                closeAnnouncementModal();
            } else {
                alert('Please fill in both title and content');
            }
        });
    }
    
    // Download report functionality
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reportType = this.parentElement.querySelector('h3').textContent;
            alert(`Downloading ${reportType}...`);
            
            // Simulate download
            this.textContent = 'Downloaded';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Download';
                this.disabled = false;
            }, 2000);
        });
    });
});

// Helper Functions
function filterTasks(filterType) {
    const taskItems = document.querySelectorAll('.employee-task-item');
    
    taskItems.forEach(item => {
        const statusBadge = item.querySelector('.status-badge');
        const status = statusBadge.textContent.toLowerCase();
        
        if (filterType === 'all' || status.includes(filterType.replace(' ', '-'))) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function filterEmployeesByDepartment(department) {
    const employeeCards = document.querySelectorAll('.employee-card');
    
    employeeCards.forEach(card => {
        const deptElement = card.querySelector('.department');
        if (deptElement) {
            const cardDept = deptElement.textContent;
            
            if (department === 'All Departments' || cardDept === department) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

function searchEmployees(searchTerm) {
    const employeeCards = document.querySelectorAll('.employee-card');
    
    employeeCards.forEach(card => {
        const name = card.querySelector('h4').textContent.toLowerCase();
        const role = card.querySelector('.role').textContent.toLowerCase();
        const email = card.querySelector('.contact').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || role.includes(searchTerm) || email.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Notification handling
function markNotificationAsRead(notification) {
    notification.classList.remove('unread');
}

// Auto-mark notifications as read when clicked
document.addEventListener('click', function(e) {
    if (e.target.closest('.notification-item')) {
        const notification = e.target.closest('.notification-item');
        markNotificationAsRead(notification);
    }
});

// Simulate real-time updates
function simulateRealTimeUpdates() {
    // Update notification bell with count
    const notificationBells = document.querySelectorAll('.notification-bell');
    notificationBells.forEach(bell => {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        if (unreadCount > 0) {
            bell.style.color = '#FF4747';
            bell.style.animation = 'pulse 2s infinite';
        }
    });
    
    // Update dashboard numbers periodically
    setTimeout(() => {
        const cardNumbers = document.querySelectorAll('.card-number');
        cardNumbers.forEach(number => {
            if (number.textContent.includes('%')) {
                const currentValue = parseInt(number.textContent);
                const newValue = Math.min(currentValue + Math.floor(Math.random() * 3), 100);
                number.textContent = `${newValue}%`;
            }
        });
    }, 10000);
}

// Attendance Center Tab Functions
function switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Leave Request Functions
function approveLeave(requestId) {
    const actionsDiv = document.getElementById(`actions-${requestId}`);
    actionsDiv.innerHTML = '<div class="leave-status-badge approved">Approved</div>';
}

function rejectLeave(requestId) {
    const actionsDiv = document.getElementById(`actions-${requestId}`);
    actionsDiv.innerHTML = '<div class="leave-status-badge rejected">Rejected</div>';
}

// Announcement Modal Functions
function openAnnouncementModal() {
    const modal = document.getElementById('announcement-modal');
    modal.classList.add('active');
    document.getElementById('announcement-form').reset();
}

function closeAnnouncementModal() {
    const modal = document.getElementById('announcement-modal');
    modal.classList.remove('active');
}

// Employee Profile Edit Functions
let isEditMode = false;
let originalProfileData = {};

function toggleEditMode() {
    if (!isEditMode) {
        enterEditMode();
    }
}

function enterEditMode() {
    isEditMode = true;
    
    // Store original data
    originalProfileData = {
        name: document.getElementById('display-name').textContent,
        title: document.getElementById('display-title').textContent,
        email: document.getElementById('display-email').textContent,
        phone: document.getElementById('display-phone').textContent,
        department: document.getElementById('display-department').textContent,
        address: document.getElementById('display-address').textContent
    };
    
    // Hide display elements
    document.getElementById('profile-name-display').style.display = 'none';
    document.getElementById('display-email').style.display = 'none';
    document.getElementById('display-phone').style.display = 'none';
    document.getElementById('display-department').style.display = 'none';
    document.getElementById('display-address').style.display = 'none';
    
    // Show edit elements
    document.getElementById('profile-name-edit').style.display = 'block';
    document.getElementById('edit-email').style.display = 'block';
    document.getElementById('edit-phone').style.display = 'block';
    document.getElementById('edit-department').style.display = 'block';
    document.getElementById('edit-address').style.display = 'block';
    
    // Hide edit button, show save/cancel
    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('edit-actions').style.display = 'flex';
}

function saveProfile() {
    // Get updated values
    const updatedData = {
        name: document.getElementById('edit-name').value,
        title: document.getElementById('edit-title').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        department: document.getElementById('edit-department').value,
        address: document.getElementById('edit-address').value
    };
    
    // Update display elements
    document.getElementById('display-name').textContent = updatedData.name;
    document.getElementById('display-title').textContent = updatedData.title;
    document.getElementById('display-email').textContent = updatedData.email;
    document.getElementById('display-phone').textContent = updatedData.phone;
    document.getElementById('display-department').textContent = updatedData.department;
    document.getElementById('display-address').textContent = updatedData.address;
    
    exitEditMode();
}

function cancelEdit() {
    // Restore original values to edit inputs
    document.getElementById('edit-name').value = originalProfileData.name;
    document.getElementById('edit-title').value = originalProfileData.title;
    document.getElementById('edit-email').value = originalProfileData.email;
    document.getElementById('edit-phone').value = originalProfileData.phone;
    document.getElementById('edit-department').value = originalProfileData.department;
    document.getElementById('edit-address').value = originalProfileData.address;
    
    exitEditMode();
}

function exitEditMode() {
    isEditMode = false;
    
    // Show display elements
    document.getElementById('profile-name-display').style.display = 'block';
    document.getElementById('display-email').style.display = 'block';
    document.getElementById('display-phone').style.display = 'block';
    document.getElementById('display-department').style.display = 'block';
    document.getElementById('display-address').style.display = 'block';
    
    // Hide edit elements
    document.getElementById('profile-name-edit').style.display = 'none';
    document.getElementById('edit-email').style.display = 'none';
    document.getElementById('edit-phone').style.display = 'none';
    document.getElementById('edit-department').style.display = 'none';
    document.getElementById('edit-address').style.display = 'none';
    
    // Show edit button, hide save/cancel
    document.getElementById('edit-btn').style.display = 'block';
    document.getElementById('edit-actions').style.display = 'none';
}

// Employee Attendance Tab Functions
function switchEmployeeTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.emp-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.emp-tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    document.getElementById('emp-' + tabName + '-tab').classList.add('active');
}

// Check In/Out Functions
let isCheckedIn = false;
let checkInTime = null;

function handleCheckIn() {
    const now = new Date();
    checkInTime = now;
    isCheckedIn = true;
    
    // Update UI
    document.getElementById('attendance-status').textContent = 'Present';
    document.getElementById('attendance-status').classList.add('present');
    document.getElementById('login-time').textContent = now.toLocaleTimeString();
    
    // Enable check out button
    const checkOutBtn = document.getElementById('checkout-btn');
    checkOutBtn.disabled = false;
    checkOutBtn.classList.remove('disabled');
    checkOutBtn.classList.add('enabled');
    
    // Disable check in button
    const checkInBtn = document.getElementById('checkin-btn');
    checkInBtn.disabled = true;
    checkInBtn.textContent = 'Checked In';
}

function handleCheckOut() {
    const now = new Date();
    isCheckedIn = false;
    
    // Calculate working hours
    if (checkInTime) {
        const workingMs = now - checkInTime;
        const hours = Math.floor(workingMs / (1000 * 60 * 60));
        const minutes = Math.floor((workingMs % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('working-hours').textContent = `${hours}h ${minutes}m`;
    }
    
    // Update UI
    document.getElementById('logout-time').textContent = now.toLocaleTimeString();
    
    // Reset buttons for next day
    const checkOutBtn = document.getElementById('checkout-btn');
    checkOutBtn.disabled = true;
    checkOutBtn.classList.add('disabled');
    checkOutBtn.classList.remove('enabled');
    
    const checkInBtn = document.getElementById('checkin-btn');
    checkInBtn.disabled = false;
    checkInBtn.textContent = 'Check In';
}

// Leave Modal Functions
function openLeaveModal() {
    const modal = document.getElementById('leave-modal');
    modal.classList.add('active');
    document.getElementById('leave-form').reset();
    
    // Set default dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('leave-from-date').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('leave-to-date').value = tomorrow.toISOString().split('T')[0];
}

function closeLeaveModal() {
    const modal = document.getElementById('leave-modal');
    modal.classList.remove('active');
}

function addLeaveRequest(title, description, fromDate, toDate) {
    const leaveList = document.getElementById('leave-requests-list');
    const newLeave = document.createElement('div');
    newLeave.className = 'leave-request-item';
    
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    const dateRange = fromDateObj.toLocaleDateString() + ' - ' + toDateObj.toLocaleDateString();
    
    newLeave.innerHTML = `
        <div class="leave-info">
            <h4>${title}</h4>
            <p class="leave-dates">${dateRange}</p>
            <p class="leave-desc">${description}</p>
        </div>
        <span class="leave-status-badge pending">Pending</span>
    `;
    
    // Insert at the beginning
    leaveList.insertBefore(newLeave, leaveList.firstChild);
}

// Initialize real-time updates and task system
document.addEventListener('DOMContentLoaded', function() {
    simulateRealTimeUpdates();
    
    // Initialize task system if on task center page
    if (document.getElementById('task-list')) {
        renderTasks();
        updateTaskCounters();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key to go back
    if (e.key === 'Escape') {
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen && currentScreen.id !== 'welcome-screen') {
            const backBtn = currentScreen.querySelector('.back-btn');
            if (backBtn) {
                backBtn.click();
            }
        }
    }
    
    // Ctrl/Cmd + H for home
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        showWelcome();
    }
});

// Add smooth scrolling for long content
function addSmoothScrolling() {
    const scrollableElements = document.querySelectorAll('.screen');
    scrollableElements.forEach(element => {
        element.style.scrollBehavior = 'smooth';
    });
}

// Task Management Functions
function openTaskModal(taskId = null) {
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('task-form');
    
    editingTaskId = taskId;
    
    if (taskId) {
        // Edit mode
        const task = tasks.find(t => t.id === taskId);
        modalTitle.textContent = 'Edit Task';
        submitBtn.textContent = 'Save Changes';
        
        // Pre-fill form
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-assignee').value = task.assignedTo;
        document.getElementById('task-due-date').value = task.dueDate;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-status').value = task.status;
    } else {
        // Create mode
        modalTitle.textContent = 'Create New Task';
        submitBtn.textContent = 'Create Task';
        form.reset();
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('task-due-date').value = tomorrow.toISOString().split('T')[0];
    }
    
    modal.classList.add('active');
}

function closeTaskModal() {
    const modal = document.getElementById('task-modal');
    modal.classList.remove('active');
    editingTaskId = null;
}

function editTask(taskId) {
    openTaskModal(taskId);
}

function deleteTask(taskId) {
    taskToDelete = taskId;
    const modal = document.getElementById('delete-modal');
    modal.classList.add('active');
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('active');
    taskToDelete = null;
}

function confirmDelete() {
    if (taskToDelete) {
        tasks = tasks.filter(task => task.id !== taskToDelete);
        renderTasks();
        updateTaskCounters();
        closeDeleteModal();
    }
}

function getStatusClass(status, dueDate) {
    if (status === 'Completed') return 'completed';
    if (status === 'In Progress') return 'in-progress';
    if (status === 'Not Started') return 'pending';
    
    // Check if overdue
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today && status !== 'Completed') {
        return 'overdue';
    }
    
    return 'pending';
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const statusClass = getStatusClass(task.status, task.dueDate);
        const statusText = statusClass === 'overdue' ? 'Overdue' : task.status;
        
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.setAttribute('data-task-id', task.id);
        
        taskElement.innerHTML = `
            <div class="task-content">
                <h4>${task.title}</h4>
                <p class="task-description">${task.description}</p>
                <p>Assigned to: <span class="assigned-to">${task.assignedTo}</span></p>
                <p>Due: <span class="due-date">${task.dueDate}</span></p>
                <p>Priority: <span class="priority">${task.priority}</span></p>
            </div>
            <span class="status-badge ${statusClass}">${statusText}</span>
            <div class="task-actions">
                <i class="fas fa-edit" onclick="editTask(${task.id})"></i>
                <i class="fas fa-trash" onclick="deleteTask(${task.id})"></i>
            </div>
        `;
        
        taskList.appendChild(taskElement);
    });
}

function updateTaskCounters() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
    const overdueTasks = tasks.filter(task => {
        const today = new Date();
        const due = new Date(task.dueDate);
        return due < today && task.status !== 'Completed';
    }).length;
    
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('in-progress-tasks').textContent = inProgressTasks;
    document.getElementById('overdue-tasks').textContent = overdueTasks;
}

// Initialize smooth scrolling
document.addEventListener('DOMContentLoaded', addSmoothScrolling);

// Performance optimization - lazy load images if any
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Notification Dropdown Functions
const notifications = [
    {
        id: 1,
        category: '📅',
        title: 'Team Meeting Scheduled',
        preview: 'Weekly team sync meeting scheduled for tomorrow at 10 AM',
        time: '2 hours ago',
        read: false
    },
    {
        id: 2,
        category: '🔒',
        title: 'Security Update Required',
        preview: 'Please update your password to comply with new security policies',
        time: '4 hours ago',
        read: false
    },
    {
        id: 3,
        category: '🎉',
        title: 'Project Milestone Achieved',
        preview: 'Congratulations! The Q4 project has reached 90% completion',
        time: '1 day ago',
        read: false
    },
    {
        id: 4,
        category: '📢',
        title: 'Holiday Schedule Update',
        preview: 'Updated holiday schedule for December has been published',
        time: '2 days ago',
        read: true
    }
];

let isNotificationOpen = false;

function toggleNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    
    if (isNotificationOpen) {
        closeNotifications();
    } else {
        openNotifications();
        loadNotifications();
        markAllAsRead();
        updateBadge();
    }
}

function openNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    dropdown.classList.add('active');
    isNotificationOpen = true;
}

function closeNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    dropdown.classList.remove('active');
    isNotificationOpen = false;
}

function loadNotifications() {
    const notificationList = document.getElementById('notification-list');
    notificationList.innerHTML = '';
    
    // Show only recent 4 notifications
    const recentNotifications = notifications.slice(0, 4);
    
    recentNotifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item';
        notificationItem.innerHTML = `
            <div class="notification-meta">
                <span class="notification-icon">${notification.category}</span>
                <span class="notification-title">${notification.title}</span>
                <span class="notification-time">${notification.time}</span>
            </div>
            <div class="notification-preview">${notification.preview}</div>
        `;
        notificationList.appendChild(notificationItem);
    });
}

function markAllAsRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });
}

function updateBadge() {
    const badge = document.getElementById('notification-badge');
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Close notifications when clicking outside
document.addEventListener('click', function(e) {
    const notificationContainer = document.querySelector('.notification-container');
    if (notificationContainer && !notificationContainer.contains(e.target)) {
        closeNotifications();
    }
});

// Initialize notification badge on page load
document.addEventListener('DOMContentLoaded', function() {
    updateBadge();
});
// Profile Dropdown Functions
let isProfileMenuOpen = false;

function toggleProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    
    if (isProfileMenuOpen) {
        closeProfileMenu();
    } else {
        openProfileMenu();
    }
}

function openProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.add('active');
    isProfileMenuOpen = true;
}

function closeProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.remove('active');
    isProfileMenuOpen = false;
}

function showAdminProfile() {
    showScreen('admin-profile');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showWelcome();
        closeProfileMenu();
    }
}

// Edit Profile Modal Functions
function openEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.add('active');
    
    // Pre-fill form with current values
    document.getElementById('edit-admin-name').value = document.getElementById('admin-name').textContent;
    document.getElementById('edit-admin-email').value = document.getElementById('admin-email').textContent;
    document.getElementById('edit-admin-role').value = document.getElementById('admin-role').textContent;
}

function closeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.remove('active');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer && !profileContainer.contains(e.target)) {
        closeProfileMenu();
    }
});

// Edit Profile Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('edit-admin-name').value.trim();
            const email = document.getElementById('edit-admin-email').value.trim();
            const role = document.getElementById('edit-admin-role').value.trim();
            
            if (!name || !email || !role) {
                alert('Please fill in all fields');
                return;
            }
            
            // Update profile display
            document.getElementById('admin-name').textContent = name;
            document.getElementById('admin-email').textContent = email;
            document.getElementById('admin-role').textContent = role;
            
            closeEditProfileModal();
            alert('Profile updated successfully!');
        });
    }
});
// Profile Dropdown Functions
function toggleProfileDropdown() {
    const dropdown = document.getElementById("profileDropdown");
    dropdown.classList.toggle("hidden");
}

document.addEventListener('DOMContentLoaded', function() {
    // Profile icon click event
    document.getElementById("profileIcon")
        .addEventListener("click", toggleProfileDropdown);
    
    // Close when clicking outside
    document.addEventListener("click", function(e) {
        const dropdown = document.getElementById("profileDropdown");
        const icon = document.getElementById("profileIcon");
        
        if (!dropdown.contains(e.target) && !icon.contains(e.target)) {
            dropdown.classList.add("hidden");
        }
    });
    
    // Profile button navigation
    document.getElementById("profileBtn").onclick = () => {
        showScreen('admin-profile');
        document.getElementById("profileDropdown").classList.add("hidden");
    };
    
    // Logout button
    document.getElementById("logoutBtn").onclick = () => {
        if (confirm('Are you sure you want to logout?')) {
            showWelcome();
            document.getElementById("profileDropdown").classList.add("hidden");
        }
    };
});
// Profile Dropdown Functions
function toggleProfileDropdown() {
    const dropdown = document.getElementById("profileDropdown");
    dropdown.classList.toggle("hidden");
}

// Close when clicking outside
document.addEventListener("click", function(e) {
    const dropdown = document.getElementById("profileDropdown");
    const icon = document.getElementById("profileIcon");
    
    if (!dropdown.contains(e.target) && !icon.contains(e.target)) {
        dropdown.classList.add("hidden");
    }
});

// Profile and Logout button handlers
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("profileBtn").onclick = () => {
        showScreen('admin-profile');
        document.getElementById("profileDropdown").classList.add("hidden");
    };
    
    document.getElementById("logoutBtn").onclick = () => {
        if (confirm('Are you sure you want to logout?')) {
            showWelcome();
            document.getElementById("profileDropdown").classList.add("hidden");
        }
    };
});
