/**
 * ================================
 * 하하매스 교육 플랫폼 메인 JavaScript v2.0
 * ================================
 * Claude Pro 스타일 리팩토링
 */

// ============================================
// 상수 정의
// ============================================
const CONSTANTS = {
    CALENDAR_CELLS: 42,
    TOAST_DURATION: 3000,
    MONTH_NAMES: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    ACTIVITY_THRESHOLDS: {
        high: 0.7,
        medium: 0.5,
        low: 0.3
    },
    DEBOUNCE_DELAY: 300,
    ANIMATION_DELAY: 50
};

// ============================================
// 상태 관리
// ============================================
const CalendarState = {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),

    /**
     * 월을 변경하고 상태 업데이트
     * @param {number} delta - 변경할 월의 차이
     */
    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
    },

    /**
     * 현재 상태를 리셋
     */
    reset() {
        const now = new Date();
        this.currentMonth = now.getMonth();
        this.currentYear = now.getFullYear();
    }
};

// ============================================
// 달력 기능 모듈
// ============================================
const CalendarModule = {
    /**
     * 이전 달의 날짜를 캘린더 그리드에 추가
     * @param {HTMLElement} calendarGrid - 캘린더 그리드 요소
     * @param {number} firstDay - 첫 번째 요일
     */
    addPreviousMonthDays(calendarGrid, firstDay) {
        try {
            const daysInPrevMonth = new Date(CalendarState.currentYear, CalendarState.currentMonth, 0).getDate();
            
            for (let i = firstDay - 1; i >= 0; i--) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day other-month';
                dayDiv.textContent = daysInPrevMonth - i;
                dayDiv.setAttribute('aria-label', `이전 달 ${daysInPrevMonth - i}일`);
                calendarGrid.appendChild(dayDiv);
            }
        } catch (error) {
            console.error('이전 달 날짜 추가 중 오류:', error);
        }
    },

    /**
     * 현재 달의 날짜를 캘린더 그리드에 추가
     * @param {HTMLElement} calendarGrid - 캘린더 그리드 요소
     */
    addCurrentMonthDays(calendarGrid) {
        try {
            const daysInMonth = new Date(CalendarState.currentYear, CalendarState.currentMonth + 1, 0).getDate();
            const today = new Date();
            const isCurrentMonth = today.getMonth() === CalendarState.currentMonth && 
                                  today.getFullYear() === CalendarState.currentYear;
            const todayDate = today.getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day';
                dayDiv.textContent = day;
                dayDiv.setAttribute('aria-label', `${day}일`);

                if (isCurrentMonth && day === todayDate) {
                    dayDiv.classList.add('today');
                    dayDiv.setAttribute('aria-current', 'date');
                }

                this.addActivityClass(dayDiv);
                calendarGrid.appendChild(dayDiv);
            }
        } catch (error) {
            console.error('현재 달 날짜 추가 중 오류:', error);
        }
    },

    /**
     * 다음 달의 날짜를 캘린더 그리드에 추가
     * @param {HTMLElement} calendarGrid - 캘린더 그리드 요소
     */
    addNextMonthDays(calendarGrid) {
        try {
            const totalCells = calendarGrid.children.length;
            const remainingCells = CONSTANTS.CALENDAR_CELLS - totalCells;

            for (let day = 1; day <= remainingCells; day++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day other-month';
                dayDiv.textContent = day;
                dayDiv.setAttribute('aria-label', `다음 달 ${day}일`);
                calendarGrid.appendChild(dayDiv);
            }
        } catch (error) {
            console.error('다음 달 날짜 추가 중 오류:', error);
        }
    },

    /**
     * 랜덤 활동 클래스를 날짜에 추가
     * @param {HTMLElement} dayDiv - 날짜 요소
     */
    addActivityClass(dayDiv) {
        const random = Math.random();
        const { high, medium, low } = CONSTANTS.ACTIVITY_THRESHOLDS;

        if (random > high) {
            dayDiv.classList.add('has-activity');
        } else if (random > medium) {
            dayDiv.classList.add('has-activity', 'has-assignment');
        } else if (random > low) {
            dayDiv.classList.add('has-activity', 'has-evaluation');
        }
    },

    /**
     * 월 제목 업데이트
     */
    updateMonthDisplay() {
        try {
            const calendarMonth = document.getElementById('calendar-month');
            if (!calendarMonth) return;

            const monthText = `${CalendarState.currentYear}년 ${CONSTANTS.MONTH_NAMES[CalendarState.currentMonth]}`;
            calendarMonth.textContent = monthText;
        } catch (error) {
            console.error('월 표시 업데이트 중 오류:', error);
        }
    },

    /**
     * 전체 캘린더 생성 및 렌더링
     */
    generate() {
        try {
            const calendarGrid = document.getElementById('calendar-grid');
            if (!calendarGrid) return;

            calendarGrid.innerHTML = '';

            const firstDay = new Date(CalendarState.currentYear, CalendarState.currentMonth, 1).getDay();

            this.addPreviousMonthDays(calendarGrid, firstDay);
            this.addCurrentMonthDays(calendarGrid);
            this.addNextMonthDays(calendarGrid);
            this.updateMonthDisplay();
        } catch (error) {
            console.error('캘린더 생성 중 오류:', error);
        }
    }
};

/**
 * 월을 변경하고 캘린더 재생성
 * @param {number} delta - 변경할 월의 차이
 */
function changeMonth(delta) {
    try {
        if (typeof delta !== 'number') {
            throw new TypeError('delta는 숫자여야 합니다.');
        }
        CalendarState.changeMonth(delta);
        CalendarModule.generate();
    } catch (error) {
        console.error('월 변경 중 오류:', error);
        showToast('달력을 변경할 수 없습니다.', 'error');
    }
}

// ============================================
// UI 상호작용 모듈
// ============================================
const UIModule = {
    /**
     * 부드러운 스크롤 초기화
     */
    initSmoothScroll() {
        try {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        } catch (error) {
            console.error('부드러운 스크롤 초기화 중 오류:', error);
        }
    },

    /**
     * 카드 호버 효과 추가
     */
    addCardHoverEffect() {
        try {
            document.querySelectorAll('.card, .item-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-2px)';
                    card.style.transition = 'var(--transition-base)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                });
            });
        } catch (error) {
            console.error('카드 호버 효과 추가 중 오류:', error);
        }
    },

    /**
     * 초기화
     */
    init() {
        this.initSmoothScroll();
        this.addCardHoverEffect();
    }
};

// ============================================
// 알림 및 로딩 모듈
// ============================================
const NotificationModule = {
    /**
     * 애니메이션 스타일 주입
     * @private
     */
    _injectAnimationStyles() {
        if (document.getElementById('app-animations')) return;

        const style = document.createElement('style');
        style.id = 'app-animations';
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
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * 토스트 알림 표시
     * @param {string} message - 표시할 메시지
     * @param {string} type - 알림 유형 ('success', 'error', 'info')
     */
    showToast(message, type = 'info') {
        try {
            if (!message) {
                throw new Error('메시지가 필요합니다.');
            }

            this._injectAnimationStyles();

            const colorMap = {
                'success': 'var(--green)',
                'error': 'var(--red)',
                'info': 'var(--primary-blue)'
            };

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background-color: ${colorMap[type] || colorMap.info};
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
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, CONSTANTS.TOAST_DURATION);
        } catch (error) {
            console.error('토스트 알림 표시 중 오류:', error);
        }
    },

    /**
     * 로딩 화면 표시
     */
    showLoading() {
        try {
            if (document.getElementById('loading-overlay')) return;

            this._injectAnimationStyles();

            const loading = document.createElement('div');
            loading.id = 'loading-overlay';
            loading.setAttribute('role', 'status');
            loading.setAttribute('aria-live', 'polite');
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
        } catch (error) {
            console.error('로딩 화면 표시 중 오류:', error);
        }
    },

    /**
     * 로딩 화면 숨김
     */
    hideLoading() {
        try {
            const loading = document.getElementById('loading-overlay');
            if (loading) {
                loading.remove();
            }
        } catch (error) {
            console.error('로딩 화면 숨기는 중 오류:', error);
        }
    }
};

/**
 * 토스트 알림 표시 (전역 함수)
 * @param {string} message - 표시할 메시지
 * @param {string} type - 알림 유형
 */
function showToast(message, type = 'info') {
    NotificationModule.showToast(message, type);
}

/**
 * 로딩 화면 표시 (전역 함수)
 */
function showLoading() {
    NotificationModule.showLoading();
}

/**
 * 로딩 화면 숨김 (전역 함수)
 */
function hideLoading() {
    NotificationModule.hideLoading();
}

// ============================================
// 이벤트 핸들러 모듈
// ============================================
const EventHandlerModule = {
    /**
     * 액션 버튼 이벤트 초기화
     */
    initActionButtons() {
        try {
            document.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const title = btn.getAttribute('title') || '기능';
                    showToast(`"${title}" 기능은 개발 중입니다.`, 'info');
                });
            });
        } catch (error) {
            console.error('액션 버튼 초기화 중 오류:', error);
        }
    },

    /**
     * 빠른 작업 버튼 이벤트 초기화
     */
    initQuickActionButtons() {
        try {
            document.querySelectorAll('.quick-action-btn').forEach(btn => {
                if (!btn.hasAttribute('onclick')) {
                    btn.addEventListener('click', () => {
                        const text = btn.querySelector('span')?.textContent || '기능';
                        showToast(`"${text}" 기능은 개발 중입니다.`, 'info');
                    });
                }
            });
        } catch (error) {
            console.error('빠른 작업 버튼 초기화 중 오류:', error);
        }
    },

    /**
     * 아이콘 버튼 이벤트 초기화
     */
    initIconButtons() {
        try {
            document.querySelectorAll('.icon-btn').forEach(btn => {
                if (!btn.hasAttribute('onclick') && !btn.querySelector('.fa-heart')) {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const title = btn.getAttribute('title') || '기능';
                        if (title) {
                            showToast(`"${title}" 기능은 개발 중입니다.`, 'info');
                        }
                    });
                }
            });
        } catch (error) {
            console.error('아이콘 버튼 초기화 중 오류:', error);
        }
    },

    /**
     * 아이템 카드 이벤트 초기화
     */
    initItemCards() {
        try {
            document.querySelectorAll('.item-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.item-actions') || e.target.closest('button')) {
                        return;
                    }
                    const title = card.querySelector('.item-title')?.textContent || '항목';
                    showToast(`"${title}" 상세 페이지는 개발 중입니다.`, 'info');
                });
            });
        } catch (error) {
            console.error('아이템 카드 초기화 중 오류:', error);
        }
    },

    /**
     * 검색 입력 이벤트 초기화
     */
    initSearch() {
        try {
            const searchInput = document.querySelector('input[type="search"]');
            if (!searchInput) return;

            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    const searchTerm = e.target.value.toLowerCase();
                    const cards = document.querySelectorAll('.item-card');
                    
                    cards.forEach(card => {
                        const title = card.querySelector('.item-title')?.textContent.toLowerCase() || '';
                        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
                    });
                }, CONSTANTS.DEBOUNCE_DELAY);
            });
        } catch (error) {
            console.error('검색 초기화 중 오류:', error);
        }
    },

    /**
     * 키보드 단축키 초기화
     */
    initKeyboardShortcuts() {
        try {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + K for search
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    const searchInput = document.querySelector('input[type="search"]');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }

                // Escape to close modals
                if (e.key === 'Escape') {
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.style.display = 'none';
                    });
                }
            });
        } catch (error) {
            console.error('키보드 단축키 초기화 중 오류:', error);
        }
    },

    /**
     * 달력 네비게이션 버튼 초기화
     */
    initCalendarNavigation() {
        try {
            document.querySelectorAll('.calendar-nav[data-action]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = btn.getAttribute('data-action');
                    if (action === 'prev-month') {
                        changeMonth(-1);
                    } else if (action === 'next-month') {
                        changeMonth(1);
                    }
                });
            });
        } catch (error) {
            console.error('달력 네비게이션 초기화 중 오류:', error);
        }
    },
};

// ============================================
// 반응형 및 애니메이션 모듈
// ============================================
const ResponsiveModule = {
    /**
     * 모바일 메뉴 생성 및 토글
     */
    createMobileMenu() {
        try {
            if (window.innerWidth > 768) return;

            const gnbMenu = document.querySelector('.gnb-menu');
            const gnbContainer = document.querySelector('.gnb-container');

            if (!gnbMenu || !gnbContainer) return;
            if (document.querySelector('.menu-toggle')) return;

            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.setAttribute('aria-label', '메뉴 토글');
            menuToggle.setAttribute('aria-expanded', 'false');
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

            gnbContainer.insertBefore(menuToggle, gnbMenu);

            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                gnbMenu.style.display = isExpanded ? 'none' : 'flex';
                gnbMenu.style.position = 'absolute';
                gnbMenu.style.top = '70px';
                gnbMenu.style.left = '0';
                gnbMenu.style.width = '100%';
                gnbMenu.style.backgroundColor = 'var(--primary-navy)';
                gnbMenu.style.flexDirection = 'column';
                gnbMenu.style.padding = '1rem';
            });
        } catch (error) {
            console.error('모바일 메뉴 생성 중 오류:', error);
        }
    },

    /**
     * 카드 페이드인 애니메이션 추가
     */
    addCardFadeInAnimation() {
        try {
            const cards = document.querySelectorAll('.card, .item-card');
            if (cards.length === 0) return;

            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.animation = `fadeIn 0.5s ease-in-out forwards`;
                    card.style.animationDelay = `${index * CONSTANTS.ANIMATION_DELAY}ms`;
                }, 100);
            });
        } catch (error) {
            console.error('카드 애니메이션 추가 중 오류:', error);
        }
    }
};

/**
 * 윈도우 리사이즈 이벤트 핸들러
 */
function handleWindowResize() {
    try {
        ResponsiveModule.createMobileMenu();
    } catch (error) {
        console.error('윈도우 리사이즈 처리 중 오류:', error);
    }
}

// ============================================
// 자동 저장 모듈
// ============================================
const AutoSaveModule = {
    /**
     * 폼 자동 저장 초기화
     */
    init() {
        try {
            const forms = document.querySelectorAll('form[data-autosave]');
            if (forms.length === 0) return;

            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.addEventListener('change', (e) => {
                        this.saveForm(form);
                    });
                });
            });
        } catch (error) {
            console.error('자동 저장 초기화 중 오류:', error);
        }
    },

    /**
     * 폼 데이터 저장
     * @param {HTMLFormElement} form - 저장할 폼
     */
    saveForm(form) {
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            const key = `autosave-${form.id}`;
            localStorage.setItem(key, JSON.stringify(data));
            showToast('자동 저장되었습니다.', 'success');
        } catch (error) {
            console.error('폼 저장 중 오류:', error);
        }
    }
};

// ============================================
// 진단 및 모니터링
// ============================================
const DiagnosticsModule = {
    /**
     * 페이지 성능 모니터링
     */
    monitorPerformance() {
        try {
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`📊 페이지 로드 시간: ${pageLoadTime}ms`);
                
                if (pageLoadTime > 3000) {
                    console.warn('⚠️ 페이지 로드 시간이 깁니다. 최적화가 필요할 수 있습니다.');
                }
            });
        } catch (error) {
            console.error('성능 모니터링 중 오류:', error);
        }
    },

    /**
     * 전역 에러 핸들링
     */
    handleGlobalErrors() {
        try {
            window.addEventListener('error', (e) => {
                console.error('❌ JavaScript Error:', {
                    message: e.message,
                    filename: e.filename,
                    line: e.lineno,
                    column: e.colno
                });
            });

            window.addEventListener('unhandledrejection', (event) => {
                console.error('❌ 처리되지 않은 Promise 거부:', event.reason);
            });
        } catch (error) {
            console.error('에러 핸들링 초기화 중 오류:', error);
        }
    },

    /**
     * 페이지 표시 상태 모니터링
     */
    monitorPageVisibility() {
        try {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    console.log('👁️ 페이지가 숨겨졌습니다.');
                } else {
                    console.log('👁️ 페이지가 표시되었습니다.');
                }
            });
        } catch (error) {
            console.error('페이지 표시 상태 모니터링 중 오류:', error);
        }
    },

    /**
     * 콘솔 인사말
     */
    showWelcomeMessage() {
        console.log('%c하하매스 교육 플랫폼', 'font-size: 24px; font-weight: bold; color: #4A90E2;');
        console.log('%c버전 2.0.0 (Claude Pro 리팩토링)', 'font-size: 14px; color: #6B7280;');
        console.log('%c개발자 도구를 사용하시는군요! 👋', 'font-size: 12px; color: #2C3E7B;');
    }
};

// ============================================
// 페이지별 함수 (다른 HTML 페이지용)
// ============================================

/**
 * 새로운 평가 생성
 */
function createNewEvaluation() {
    try {
        showToast('새로운 평가 생성 기능은 개발 중입니다.', 'info');
    } catch (error) {
        console.error('평가 생성 중 오류:', error);
    }
}

/**
 * 새로운 과제 생성
 */
function createNewAssignment() {
    try {
        showToast('새로운 과제 생성 기능은 개발 중입니다.', 'info');
    } catch (error) {
        console.error('과제 생성 중 오류:', error);
    }
}
/**
 * 애플리케이션 초기화
 */
function initializeApp() {
    try {
        // 캘린더 초기화
        if (document.getElementById('calendar-grid')) {
            CalendarModule.generate();
        }

        // UI 모듈 초기화
        UIModule.init();

        // 이벤트 핸들러 초기화
        EventHandlerModule.initAll();

        // 반응형 메뉴 초기화
        ResponsiveModule.createMobileMenu();

        // 자동 저장 초기화
        AutoSaveModule.init();

        // 진단 및 모니터링 초기화
        DiagnosticsModule.monitorPerformance();
        DiagnosticsModule.handleGlobalErrors();
        DiagnosticsModule.monitorPageVisibility();
        DiagnosticsModule.showWelcomeMessage();

        // 페이드인 애니메이션 추가
        ResponsiveModule.addCardFadeInAnimation();

        console.log('✅ 애플리케이션 초기화 완료');
    } catch (error) {
        console.error('❌ 애플리케이션 초기화 중 오류:', error);
        showToast('애플리케이션 초기화 중 오류가 발생했습니다.', 'error');
    }
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// 윈도우 리사이즈 이벤트
window.addEventListener('resize', handleWindowResize);

// ============================================
// 전역 함수 내보내기
// ============================================
window.changeMonth = changeMonth;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;