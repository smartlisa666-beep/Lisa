// ================================
// 하하매스 교육 플랫폼 메인 JavaScript
// ================================

// Calendar functionality
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;

    calendarGrid.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const todayDate = today.getDate();

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = daysInPrevMonth - i;
        calendarGrid.appendChild(dayDiv);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;

        // Mark today
        if (isCurrentMonth && day === todayDate) {
            dayDiv.classList.add('today');
        }

        // Add random activities for demo
        const random = Math.random();
        if (random > 0.7) {
            dayDiv.classList.add('has-activity');
        } else if (random > 0.5) {
            dayDiv.classList.add('has-activity', 'has-assignment');
        } else if (random > 0.3) {
            dayDiv.classList.add('has-activity', 'has-evaluation');
        }

        calendarGrid.appendChild(dayDiv);
    }

    // Next month days
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = day;
        calendarGrid.appendChild(dayDiv);
    }

    // Update month display
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const calendarMonth = document.getElementById('calendar-month');
    if (calendarMonth) {
        calendarMonth.textContent = `${currentYear}년 ${monthNames[currentMonth]}`;
    }
}

function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
}

// Initialize calendar on page load
if (document.getElementById('calendar-grid')) {
    generateCalendar();
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effect to cards
document.querySelectorAll('.card, .item-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === 'success' ? 'var(--green)' : type === 'error' ? 'var(--red)' : 'var(--primary-blue)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease-in-out;
        font-weight: 500;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Student action button handlers
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const title = this.getAttribute('title');
        showToast(`${title} 기능은 개발 중입니다.`, 'info');
    });
});

// Quick action button handlers
document.querySelectorAll('.quick-action-btn').forEach(btn => {
    if (!btn.hasAttribute('onclick')) {
        btn.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            showToast(`${text} 기능은 개발 중입니다.`, 'info');
        });
    }
});

// Icon button handlers
document.querySelectorAll('.icon-btn').forEach(btn => {
    if (!btn.hasAttribute('onclick') && !btn.querySelector('.fa-heart')) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const title = this.getAttribute('title');
            if (title) {
                showToast(`${title} 기능은 개발 중입니다.`, 'info');
            }
        });
    }
});

// Item card click handlers
document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Don't trigger if clicking on buttons
        if (e.target.closest('.item-actions') || e.target.closest('button')) {
            return;
        }
        const title = this.querySelector('.item-title')?.textContent || '항목';
        showToast(`"${title}" 상세 페이지는 개발 중입니다.`, 'info');
    });
});

// Loading animation
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    loading.innerHTML = `
        <div style="text-align: center;">
            <div style="
                width: 50px;
                height: 50px;
                border: 5px solid var(--gray-200);
                border-top-color: var(--primary-blue);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <p style="margin-top: 1rem; color: var(--gray-600); font-weight: 500;">로딩 중...</p>
        </div>
    `;
    document.body.appendChild(loading);

    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

// Search functionality (if search input exists)
const searchInput = document.querySelector('input[type="search"]');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.item-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.item-title')?.textContent.toLowerCase() || '';
            if (title.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Responsive menu toggle
function createMobileMenu() {
    if (window.innerWidth <= 768) {
        const gnbMenu = document.querySelector('.gnb-menu');
        if (gnbMenu && !document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.style.cssText = `
                display: block;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
            `;
            
            const gnbContainer = document.querySelector('.gnb-container');
            gnbContainer.insertBefore(menuToggle, gnbMenu);
            
            menuToggle.addEventListener('click', function() {
                gnbMenu.style.display = gnbMenu.style.display === 'flex' ? 'none' : 'flex';
                gnbMenu.style.position = 'absolute';
                gnbMenu.style.top = '70px';
                gnbMenu.style.left = '0';
                gnbMenu.style.width = '100%';
                gnbMenu.style.backgroundColor = 'var(--primary-navy)';
                gnbMenu.style.flexDirection = 'column';
                gnbMenu.style.padding = '1rem';
            });
        }
    }
}

// Initialize on load
window.addEventListener('load', function() {
    createMobileMenu();
    
    // Add fade-in animation to all cards
    document.querySelectorAll('.card, .item-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.animation = 'fadeIn 0.5s ease-in-out forwards';
            card.style.animationDelay = `${index * 0.05}s`;
        }, 100);
    });
});

// Window resize handler
window.addEventListener('resize', function() {
    createMobileMenu();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals (if implemented)
    if (e.key === 'Escape') {
        // Close any open modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});

// Auto-save functionality for forms (if needed)
function autoSave() {
    const forms = document.querySelectorAll('form[data-autosave]');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                localStorage.setItem(`autosave-${form.id}`, JSON.stringify(data));
                showToast('자동 저장되었습니다.', 'success');
            });
        });
    });
}

// Initialize autosave
autoSave();

// Page visibility API - pause activities when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page is hidden');
    } else {
        console.log('Page is visible');
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`페이지 로드 시간: ${pageLoadTime}ms`);
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
    // In production, you might want to send this to a logging service
});

// Console welcome message
console.log('%c하하매스 교육 플랫폼', 'font-size: 24px; font-weight: bold; color: #4A90E2;');
console.log('%c버전 1.0.0', 'font-size: 14px; color: #6B7280;');
console.log('%c개발자 도구를 사용하시는군요! 👋', 'font-size: 12px; color: #2C3E7B;');

// Export functions for global use
window.changeMonth = changeMonth;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;