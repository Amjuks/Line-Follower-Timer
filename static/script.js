let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let lastRunningState = null;

const timerDisplay = document.getElementById("timer");
const statusDisplay = document.getElementById("status");

function updateDisplay(time) {
    const ms = String(time % 1000).padStart(3, '0');
    const totalSeconds = Math.floor(time / 1000);
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}.${ms}`;
}

function setStatus(text, color = "#555") {
    statusDisplay.textContent = `Status: ${text}`;
    statusDisplay.style.color = color;
}

function startTimer(sync = false) {
    if (!timerInterval) {
        if (!sync) fetch('/start');
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay(elapsedTime);
        }, 10);
        setStatus("Running", "#28a745");
    }
}

function stopTimer(sync = false) {
    if (timerInterval) {
        if (!sync) fetch('/stop');
        clearInterval(timerInterval);
        timerInterval = null;
        setStatus("Stopped", "#dc3545");
    }
}

function resetTimer() {
    fetch('/reset');
    stopTimer(true);
    elapsedTime = 0;
    updateDisplay(0);
    setStatus("Idle", "#555");
}

window.onload = () => {
    document.getElementById("startBtn").addEventListener("click", () => startTimer(false));
    document.getElementById("stopBtn").addEventListener("click", () => stopTimer(false));
    document.getElementById("resetBtn").addEventListener("click", resetTimer);
    
    setInterval(async () => {
        try {
            const res = await fetch('/status');
            const data = await res.json();
            const isRunning = data.running;

            if (isRunning && !timerInterval) {
                startTimer(true); 
            } else if (!isRunning && timerInterval) {
                stopTimer(true);  
            }

            lastRunningState = isRunning;
        } catch (e) {
            console.error("Failed to poll status:", e);
        }
    }, 1000);
};
