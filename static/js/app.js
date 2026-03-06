/**
 * AI Vision Classifier — Frontend Logic
 * Handles file upload, webcam capture, and prediction display.
 */

// ── DOM Elements ───────────────────────────────────────────────
const tabUpload = document.getElementById('tabUpload');
const tabWebcam = document.getElementById('tabWebcam');
const uploadZone = document.getElementById('uploadZone');
const uploadContent = document.getElementById('uploadContent');
const webcamZone = document.getElementById('webcamZone');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const clearBtn = document.getElementById('clearBtn');
const predictBtn = document.getElementById('predictBtn');
const captureBtn = document.getElementById('captureBtn');
const webcamVideo = document.getElementById('webcamVideo');
const webcamCanvas = document.getElementById('webcamCanvas');

const resultsEmpty = document.getElementById('resultsEmpty');
const resultsLoading = document.getElementById('resultsLoading');
const resultsDisplay = document.getElementById('resultsDisplay');
const topClass = document.getElementById('topClass');
const topConfidence = document.getElementById('topConfidence');
const ringFill = document.getElementById('ringFill');
const breakdownBars = document.getElementById('breakdownBars');
const confidenceRing = document.getElementById('confidenceRing');
const historyList = document.getElementById('historyList');
const downloadBtn = document.getElementById('downloadBtn');

// State
let currentFile = null;
let webcamStream = null;
let currentPrediction = null;

const HISTORY_KEY = 'vision_classifier_history';
const MAX_HISTORY = 10;

// ── SVG Gradient for Ring (can't use CSS gradient on SVG stroke) ──
(function injectRingGradient() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="50%" stop-color="#a855f7"/>
            <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>`;
    confidenceRing.insertBefore(defs, confidenceRing.firstChild);
    ringFill.setAttribute('stroke', 'url(#ringGradient)');
    loadHistory();
})();

// ── Download Results ───────────────────────────────────────────
downloadBtn.addEventListener('click', () => {
    if (!currentPrediction) return;

    const content = `AI Vision Classification Result\n` +
        `==============================\n` +
        `Timestamp: ${new Date().toLocaleString()}\n` +
        `Detected: ${currentPrediction.class}\n` +
        `Confidence: ${currentPrediction.confidence}%\n\n` +
        `All Predictions:\n` +
        currentPrediction.all_predictions.map(p => `- ${p.class}: ${p.confidence}%`).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prediction-${currentPrediction.class.toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
});

// ── Tab Switching ──────────────────────────────────────────────
tabUpload.addEventListener('click', () => switchTab('upload'));
tabWebcam.addEventListener('click', () => switchTab('webcam'));

function switchTab(tab) {
    if (tab === 'upload') {
        tabUpload.classList.add('tab--active');
        tabWebcam.classList.remove('tab--active');
        uploadZone.classList.remove('hidden');
        webcamZone.classList.add('hidden');
        stopWebcam();
    } else {
        tabWebcam.classList.add('tab--active');
        tabUpload.classList.remove('tab--active');
        uploadZone.classList.add('hidden');
        webcamZone.classList.remove('hidden');
        startWebcam();
    }
}

// ── File Upload ────────────────────────────────────────────────
uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});
uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
});
uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
});

function handleFile(file) {
    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewSection.classList.remove('hidden');
        uploadZone.classList.add('hidden');
        predictBtn.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// ── Clear ──────────────────────────────────────────────────────
clearBtn.addEventListener('click', resetInput);

function resetInput() {
    currentFile = null;
    previewSection.classList.add('hidden');
    predictBtn.classList.add('hidden');
    uploadZone.classList.remove('hidden');
    fileInput.value = '';
    showState('empty');
}

// ── Webcam ─────────────────────────────────────────────────────
async function startWebcam() {
    try {
        webcamStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 640, height: 480 }
        });
        webcamVideo.srcObject = webcamStream;
    } catch (err) {
        console.error('Webcam access denied:', err);
        alert('Unable to access webcam. Please allow camera permissions.');
        switchTab('upload');
    }
}

function stopWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach(t => t.stop());
        webcamStream = null;
    }
}

captureBtn.addEventListener('click', () => {
    const canvas = webcamCanvas;
    canvas.width = webcamVideo.videoWidth;
    canvas.height = webcamVideo.videoHeight;
    canvas.getContext('2d').drawImage(webcamVideo, 0, 0);

    canvas.toBlob((blob) => {
        currentFile = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
        previewImage.src = canvas.toDataURL('image/jpeg');
        previewSection.classList.remove('hidden');
        predictBtn.classList.remove('hidden');
        stopWebcam();
        webcamZone.classList.add('hidden');
    }, 'image/jpeg', 0.92);
});

// ── Prediction ─────────────────────────────────────────────────
predictBtn.addEventListener('click', classify);

async function classify() {
    if (!currentFile) return;

    showState('loading');
    predictBtn.classList.add('hidden');

    const formData = new FormData();
    formData.append('image', currentFile);

    try {
        const res = await fetch('/predict', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.error) {
            alert('Error: ' + data.error);
            showState('empty');
            predictBtn.classList.remove('hidden');
            return;
        }

        currentPrediction = data;
        saveToHistory(data);
        renderResults(data);
    } catch (err) {
        console.error(err);
        alert('Failed to reach the server. Is Flask running?');
        showState('empty');
        predictBtn.classList.remove('hidden');
    }
}

// ── Render Results ─────────────────────────────────────────────
function renderResults(data) {
    showState('display');

    // Top prediction
    topClass.textContent = data.class;

    // Animate confidence number
    animateNumber(topConfidence, 0, data.confidence, 1000);

    // Ring
    const circumference = 326.73;
    const offset = circumference - (data.confidence / 100) * circumference;
    requestAnimationFrame(() => {
        ringFill.style.strokeDashoffset = circumference; // reset
        requestAnimationFrame(() => {
            ringFill.style.strokeDashoffset = offset;
        });
    });

    // Colour-code top prediction ring
    const hue = data.confidence > 80 ? 145 : data.confidence > 50 ? 45 : 0;

    // Breakdown bars
    breakdownBars.innerHTML = '';
    data.all_predictions.forEach((pred, i) => {
        const row = document.createElement('div');
        row.className = 'bar-row';
        row.innerHTML = `
            <span class="bar-row__label">${pred.class}</span>
            <div class="bar-row__track">
                <div class="bar-row__fill" id="barFill${i}"></div>
            </div>
            <span class="bar-row__value">${pred.confidence.toFixed(1)}%</span>`;
        breakdownBars.appendChild(row);

        // Animate bar width
        requestAnimationFrame(() => {
            setTimeout(() => {
                document.getElementById(`barFill${i}`).style.width = pred.confidence + '%';
            }, 100 + i * 100);
        });
    });

    // Show predict button again
    predictBtn.classList.remove('hidden');
}

// ── Helpers ────────────────────────────────────────────────────
function showState(state) {
    resultsEmpty.classList.toggle('hidden', state !== 'empty');
    resultsLoading.classList.toggle('hidden', state !== 'loading');
    resultsDisplay.classList.toggle('hidden', state !== 'display');
}

function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);    // ease-out cubic
        el.textContent = (from + (to - from) * eased).toFixed(1);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// ── History Logic ──────────────────────────────────────────────
function saveToHistory(data) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const item = {
        class: data.class,
        confidence: data.confidence,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add to start, limit length
    history.unshift(item);
    if (history.length > MAX_HISTORY) history.pop();

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    if (history.length === 0) {
        historyList.innerHTML = '<p class="results-empty p" style="padding: 1rem 0;">No recent activity</p>';
        return;
    }

    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-item__info">
                <span class="history-item__class">${item.class}</span>
                <span class="history-item__time">${item.time}</span>
            </div>
            <span class="history-item__conf">${item.confidence.toFixed(1)}%</span>
        </div>
    `).join('');
}
