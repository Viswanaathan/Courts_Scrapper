const API_BASE_URL = 'http://localhost:5000/api';

const themeToggle = document.getElementById('theme-toggle');
const checkTodayBtn = document.getElementById('check-today');
const checkTomorrowBtn = document.getElementById('check-tomorrow');
const downloadCauseListBtn = document.getElementById('download-cause-list');
const fetchCauseListBtn = document.getElementById('fetch-cause-list');
const resetBtn = document.getElementById('reset');
const downloadJsonBtn = document.getElementById('download-json');
const downloadPdfBtn = document.getElementById('download-pdf');
const closeErrorBtn = document.getElementById('close-error');

const loader = document.getElementById('loader');
const errorBox = document.getElementById('error-box');
const errorMessage = document.getElementById('error-message');
const caseResultsSection = document.getElementById('case-results-section');
const causeListResults = document.getElementById('cause-list-results');
const currentDateSpan = document.getElementById('current-date');

const cnrInput = document.getElementById('cnr');
const caseTypeInput = document.getElementById('case_type');
const caseNumberInput = document.getElementById('case_number');
const caseYearInput = document.getElementById('case_year');

const stateSelect = document.getElementById('state');
const districtSelect = document.getElementById('district');
const complexSelect = document.getElementById('court-complex');
const courtSelect = document.getElementById('court');
const causeListDate = document.getElementById('cause-list-date');

const resultCaseNumber = document.getElementById('result-case-number');
const resultCourtName = document.getElementById('result-court-name');
const resultSerialNumber = document.getElementById('result-serial-number');
const resultListingDate = document.getElementById('result-listing-date');
const resultStatus = document.getElementById('result-status');
const resultCheckedOn = document.getElementById('result-checked-on');

const resultCauseDate = document.getElementById('result-cause-date');
const resultTotalCases = document.getElementById('result-total-cases');
const causeListCases = document.getElementById('cause-list-cases');

const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let currentCaseData = null;
let currentCauseListData = null;

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    const now = new Date();
    currentDateSpan.textContent = now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    causeListDate.valueAsDate = now;

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ Light Mode';
    }

    initScrollAnimations();
    initCustomCursor();
    initNavbarScroll();
    initHoverEffects();
    initInputHandlers();

    setupEventListeners();
    loadStates();

    console.log('🚀 eCourts Scraper loaded successfully!');
    console.log('📍 Real API integration with eCourts Services');
}

function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    checkTodayBtn.addEventListener('click', () => checkCase('today'));
    checkTomorrowBtn.addEventListener('click', () => checkCase('tomorrow'));
    fetchCauseListBtn.addEventListener('click', fetchCauseList);
    downloadCauseListBtn.addEventListener('click', downloadCauseListPdf);
    downloadJsonBtn.addEventListener('click', downloadJson);
    downloadPdfBtn.addEventListener('click', downloadPdf);
    resetBtn.addEventListener('click', resetForm);
    closeErrorBtn.addEventListener('click', hideError);

    stateSelect.addEventListener('change', loadDistricts);
    districtSelect.addEventListener('change', loadCourtComplexes);
    complexSelect.addEventListener('change', loadCourts);

    [cnrInput, caseTypeInput, caseNumberInput, caseYearInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkCase('today');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!errorBox.contains(e.target) && e.target !== closeErrorBtn) {
            hideError();
        }
    });
}

function initInputHandlers() {
    cnrInput.addEventListener('input', function(e) {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });

    caseTypeInput.addEventListener('input', function(e) {
        this.value = this.value.toUpperCase().replace(/[^A-Z]/g, '');
    });

    caseYearInput.addEventListener('input', function(e) {
        const year = parseInt(this.value);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 1) {
            this.style.borderColor = 'var(--danger-color)';
        } else {
            this.style.borderColor = '';
        }
    });

    cnrInput.addEventListener('input', function() {
        if (this.value.trim()) {
            caseTypeInput.value = '';
            caseNumberInput.value = '';
            caseYearInput.value = '';
        }
    });

    [caseTypeInput, caseNumberInput, caseYearInput].forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                cnrInput.value = '';
            }
        });
    });
}

function initCustomCursor() {
    function moveCursor(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = mouseX + 'px';
            cursorFollower.style.top = mouseY + 'px';
        }, 100);
    }
    
    document.addEventListener('mousemove', moveCursor);
    
    const interactiveElements = document.querySelectorAll(
        'button, a, input, .btn, .nav-link, .glass, .result-field, select, textarea'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
            
            if (el.tagName === 'BUTTON' || el.classList.contains('btn')) {
                cursorFollower.style.width = '60px';
                cursorFollower.style.height = '60px';
            } else if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
                cursorFollower.style.width = '20px';
                cursorFollower.style.height = '20px';
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
            cursorFollower.style.width = '40px';
            cursorFollower.style.height = '40px';
        });
    });
    
    document.addEventListener('mousedown', () => {
        cursorFollower.classList.add('click');
        cursorFollower.style.transform = 'scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursorFollower.classList.remove('click');
        cursorFollower.style.transform = 'scale(1)';
    });
    
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initHoverEffects() {
    const cards = document.querySelectorAll('.glass, .result-card, .case-check-section, .cause-list-section, .about-section');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleY = (x - centerX) / 25;
            const angleX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('result-field')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    document.querySelectorAll('.result-field').forEach(el => {
        observer.observe(el);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    document.body.style.transition = 'all 0.5s ease';
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'true');
        themeToggle.textContent = '☀️ Light Mode';
        themeToggle.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    } else {
        localStorage.setItem('darkMode', 'false');
        themeToggle.textContent = '🌙 Dark Mode';
        themeToggle.style.background = 'rgba(255, 255, 255, 0.15)';
    }
    
    setTimeout(() => {
        document.body.style.transition = '';
    }, 500);
}

async function loadStates() {
    try {
        const response = await fetch(`${API_BASE_URL}/states`);
        const data = await response.json();
        
        if (data.success) {
            stateSelect.innerHTML = '<option value="">Select State</option>';
            for (const [code, name] of Object.entries(data.data)) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                stateSelect.appendChild(option);
            }
        }
    } catch (error) {
        showError('Failed to load states');
    }
}

async function loadDistricts() {
    const stateCode = stateSelect.value;
    if (!stateCode) return;
    
    try {
        districtSelect.disabled = true;
        complexSelect.disabled = true;
        courtSelect.disabled = true;
        
        districtSelect.innerHTML = '<option value="">Select District</option>';
        complexSelect.innerHTML = '<option value="">Select Court Complex</option>';
        courtSelect.innerHTML = '<option value="">Select Court</option>';
        
        const response = await fetch(`${API_BASE_URL}/districts`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({state_code: stateCode})
        });
        
        const data = await response.json();
        
        if (data.success) {
            districtSelect.innerHTML = '<option value="">Select District</option>';
            for (const [code, name] of Object.entries(data.data)) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                districtSelect.appendChild(option);
            }
            districtSelect.disabled = false;
        }
    } catch (error) {
        showError('Failed to load districts');
    }
}

async function loadCourtComplexes() {
    const stateCode = stateSelect.value;
    const distCode = districtSelect.value;
    if (!stateCode || !distCode) return;
    
    try {
        complexSelect.disabled = true;
        courtSelect.disabled = true;
        
        complexSelect.innerHTML = '<option value="">Select Court Complex</option>';
        courtSelect.innerHTML = '<option value="">Select Court</option>';
        
        const response = await fetch(`${API_BASE_URL}/court-complexes`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({state_code: stateCode, dist_code: distCode})
        });
        
        const data = await response.json();
        
        if (data.success) {
            complexSelect.innerHTML = '<option value="">Select Court Complex</option>';
            for (const [code, name] of Object.entries(data.data)) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                complexSelect.appendChild(option);
            }
            complexSelect.disabled = false;
        }
    } catch (error) {
        showError('Failed to load court complexes');
    }
}

async function loadCourts() {
    const stateCode = stateSelect.value;
    const distCode = districtSelect.value;
    const complexCode = complexSelect.value;
    if (!stateCode || !distCode || !complexCode) return;
    
    try {
        courtSelect.disabled = true;
        courtSelect.innerHTML = '<option value="">Select Court</option>';
        
        const response = await fetch(`${API_BASE_URL}/courts`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                state_code: stateCode,
                dist_code: distCode,
                complex_code: complexCode
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            courtSelect.innerHTML = '<option value="">Select Court</option>';
            for (const [code, name] of Object.entries(data.data)) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                courtSelect.appendChild(option);
            }
            courtSelect.disabled = false;
        }
    } catch (error) {
        showError('Failed to load courts');
    }
}

async function fetchCauseList() {
    const stateCode = stateSelect.value;
    const distCode = districtSelect.value;
    const complexCode = complexSelect.value;
    const courtCode = courtSelect.value;
    const date = causeListDate.value;
    
    if (!stateCode || !distCode || !complexCode || !courtCode || !date) {
        showError('Please select all court details and date');
        return;
    }
    
    hideError();
    showLoader();
    
    try {
        const formattedDate = new Date(date).toLocaleDateString('en-IN').split('/').reverse().join('-');
        
        const response = await fetch(`${API_BASE_URL}/cause-list`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                state_code: stateCode,
                dist_code: distCode,
                complex_code: complexCode,
                court_code: courtCode,
                date: formattedDate
            })
        });
        
        const data = await response.json();
        hideLoader();
        
        if (data.success) {
            currentCauseListData = data.data;
            displayCauseListResults(data.data);
            showError('Cause list fetched successfully!', 'success');
        } else {
            showError(data.message || 'Failed to fetch cause list');
        }
    } catch (error) {
        hideLoader();
        showError('Failed to fetch cause list from eCourts');
    }
}

function displayCauseListResults(data) {
    resultCauseDate.textContent = data.date;
    resultTotalCases.textContent = data.total_cases;
    
    causeListCases.innerHTML = '';
    
    if (data.cases && data.cases.length > 0) {
        data.cases.forEach(caseItem => {
            const caseElement = document.createElement('div');
            caseElement.className = 'case-item';
            caseElement.innerHTML = `
                <div class="case-header">
                    <span class="case-serial">${caseItem.serial_no}</span>
                    <span class="case-number">${caseItem.case_number}</span>
                </div>
                <div class="case-details">
                    <strong>Parties:</strong> ${caseItem.parties}<br>
                    <strong>Purpose:</strong> ${caseItem.purpose}<br>
                    <strong>Court Room:</strong> ${caseItem.court_room}
                </div>
            `;
            causeListCases.appendChild(caseElement);
        });
    } else {
        causeListCases.innerHTML = '<p>No cases found for the selected date.</p>';
    }
    
    causeListResults.classList.remove('hidden');
    causeListResults.scrollIntoView({ behavior: 'smooth' });
}

async function downloadCauseListPdf() {
    if (!currentCauseListData) {
        showError('No cause list data available to download');
        return;
    }
    
    const stateCode = stateSelect.value;
    const distCode = districtSelect.value;
    const complexCode = complexSelect.value;
    const courtCode = courtSelect.value;
    const date = causeListDate.value;
    const formattedDate = new Date(date).toLocaleDateString('en-IN').split('/').reverse().join('-');
    
    hideError();
    showLoader();
    
    try {
        const response = await fetch(`${API_BASE_URL}/download-causelist`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                state_code: stateCode,
                dist_code: distCode,
                complex_code: complexCode,
                court_code: courtCode,
                date: formattedDate
            })
        });
        
        hideLoader();
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cause_list_${formattedDate}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showError('Cause list PDF downloaded successfully!', 'success');
        } else {
            const errorData = await response.json();
            showError(errorData.message || 'Failed to download cause list PDF');
        }
    } catch (error) {
        hideLoader();
        showError('Failed to download cause list PDF');
    }
}

function showLoader() {
    loader.classList.remove('hidden');
    document.querySelectorAll('.btn').forEach(btn => {
        btn.disabled = true;
    });
}

function hideLoader() {
    loader.classList.add('hidden');
    document.querySelectorAll('.btn').forEach(btn => {
        btn.disabled = false;
    });
}

function showError(message, type = 'error') {
    errorMessage.textContent = message;
    errorBox.classList.remove('hidden');
    
    if (type === 'success') {
        errorBox.style.background = 'linear-gradient(135deg, var(--accent-color), #059669)';
    } else if (type === 'warning') {
        errorBox.style.background = 'linear-gradient(135deg, var(--warning-color), #d97706)';
    } else {
        errorBox.style.background = 'linear-gradient(135deg, var(--danger-color), #dc2626)';
    }
    
    if (type === 'success') {
        setTimeout(() => hideError(), 5000);
    }
}

function hideError() {
    errorBox.classList.add('hidden');
}

function validateCaseInput() {
    const cnr = cnrInput.value.trim();
    const caseType = caseTypeInput.value.trim();
    const caseNumber = caseNumberInput.value.trim();
    const caseYear = caseYearInput.value.trim();
    
    if (cnr) {
        if (cnr.length < 10 || cnr.length > 20) {
            showError('CNR number should be between 10-20 characters');
            return false;
        }
    } else {
        if (!caseType) {
            showError('Please enter Case Type');
            caseTypeInput.focus();
            return false;
        }
        if (!caseNumber) {
            showError('Please enter Case Number');
            caseNumberInput.focus();
            return false;
        }
        if (!caseYear) {
            showError('Please enter Case Year');
            caseYearInput.focus();
            return false;
        }
        
        const year = parseInt(caseYear);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 1) {
            showError(`Case year should be between 1900 and ${currentYear + 1}`);
            caseYearInput.focus();
            return false;
        }
    }
    
    return true;
}

async function checkCase(checkType) {
    if (!validateCaseInput()) return;
    
    hideError();
    showLoader();
    
    try {
        const params = {};
        if (cnrInput.value.trim()) {
            params.cnr = cnrInput.value.trim();
        } else {
            params.caseType = caseTypeInput.value.trim();
            params.caseNumber = caseNumberInput.value.trim();
            params.caseYear = caseYearInput.value.trim();
        }
        params.checkType = checkType;
        
        const response = await fetch(`${API_BASE_URL}/check-case`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        
        const data = await response.json();
        hideLoader();
        
        if (data.success) {
            displayCaseResults(data.data);
            showError(`Case found successfully for ${checkType}!`, 'success');
        } else {
            showError(data.message || `Case not found in ${checkType}'s listing`);
        }
    } catch (error) {
        hideLoader();
        showError('Failed to check case from eCourts');
    }
}

function displayCaseResults(data) {
    currentCaseData = data;
    
    resultCaseNumber.textContent = data.caseNumber || '-';
    resultCourtName.textContent = data.courtName || '-';
    resultSerialNumber.textContent = data.serialNumber || '-';
    resultListingDate.textContent = formatDate(data.listingDate) || '-';
    resultStatus.textContent = data.status || '-';
    resultCheckedOn.textContent = formatDate(data.checkedOn) || '-';
    
    const statusText = data.status?.toLowerCase() || '';
    if (statusText.includes('today') || statusText.includes('found') || statusText.includes('active') || statusText.includes('listed')) {
        resultStatus.style.color = "var(--accent-color)";
        resultStatus.style.fontWeight = "bold";
    } else if (statusText.includes('tomorrow')) {
        resultStatus.style.color = "var(--warning-color)";
        resultStatus.style.fontWeight = "bold";
    } else if (statusText.includes('not found') || statusText.includes('error')) {
        resultStatus.style.color = "var(--danger-color)";
        resultStatus.style.fontWeight = "bold";
    } else {
        resultStatus.style.color = "";
        resultStatus.style.fontWeight = "";
    }
    
    caseResultsSection.classList.remove('hidden');
    caseResultsSection.classList.add('fade-in', 'visible');
    
    const resultFields = document.querySelectorAll('#case-results-section .result-field');
    resultFields.forEach((field, index) => {
        field.style.opacity = '0';
        field.style.transform = 'translateX(-30px)';
        field.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        setTimeout(() => {
            field.style.opacity = '1';
            field.style.transform = 'translateX(0)';
        }, index * 150);
    });
    
    downloadJsonBtn.disabled = false;
    downloadPdfBtn.disabled = false;
    
    setTimeout(() => {
        caseResultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    
    try {
        let date;
        if (dateString.includes('-')) {
            const [day, month, year] = dateString.split('-');
            date = new Date(year, month - 1, day);
        } else {
            date = new Date(dateString);
        }
        
        if (isNaN(date.getTime())) {
            return dateString;
        }
        
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (e) {
        return dateString;
    }
}

function downloadJson() {
    if (!currentCaseData) {
        showError('No case information available to download');
        return;
    }
    
    try {
        const jsonData = {
            caseNumber: resultCaseNumber.textContent,
            courtName: resultCourtName.textContent,
            serialNumber: resultSerialNumber.textContent,
            listingDate: resultListingDate.textContent,
            status: resultStatus.textContent,
            checkedOn: resultCheckedOn.textContent,
            downloadedAt: new Date().toISOString(),
            rawData: currentCaseData
        };
        
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `case-${resultCaseNumber.textContent.replace(/\//g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showError('Case data downloaded as JSON!', 'success');
    } catch (error) {
        showError('Failed to download JSON file');
    }
}

async function downloadPdf() {
    if (!currentCaseData) {
        showError('No case information available to download');
        return;
    }
    
    hideError();
    showLoader();
    
    try {
        const caseData = {
            caseNumber: resultCaseNumber.textContent,
            courtName: resultCourtName.textContent,
            serialNumber: resultSerialNumber.textContent,
            listingDate: resultListingDate.textContent,
            status: resultStatus.textContent,
            checkedOn: resultCheckedOn.textContent
        };
        
        const response = await fetch(`${API_BASE_URL}/download-case-pdf`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ caseData: caseData })
        });
        
        hideLoader();
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `case-${caseData.caseNumber.replace(/\//g, '-')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showError('Case PDF downloaded successfully!', 'success');
        } else {
            const errorData = await response.json();
            showError(errorData.message || 'Failed to generate PDF');
        }
    } catch (error) {
        hideLoader();
        showError('Failed to download PDF');
    }
}

function resetForm() {
    cnrInput.value = '';
    caseTypeInput.value = '';
    caseNumberInput.value = '';
    caseYearInput.value = '';
    
    [cnrInput, caseTypeInput, caseNumberInput, caseYearInput].forEach(input => {
        input.style.borderColor = '';
    });
    
    hideError();
    caseResultsSection.classList.add('hidden');
    currentCaseData = null;
    
    downloadJsonBtn.disabled = false;
    downloadPdfBtn.disabled = false;
    
    showError('Form reset successfully!', 'success');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(initNavbarScroll, 10);
});

window.app = {
    validateCaseInput,
    checkCase,
    fetchCauseList,
    downloadCauseListPdf,
    downloadJson,
    downloadPdf,
    resetForm,
    showError,
    hideError
};

console.log('💡 Real eCourts Integration Features:');
console.log('   - Live data from eCourts Services');
console.log('   - Real cause list scraping');
console.log('   - Actual case search functionality');
console.log('   - Real-time court data hierarchy');