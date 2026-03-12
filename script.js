/* =========================================
   1. NAVIGATION & UI LOGIC
   ========================================= */

function switchTab(mode) {
    document.getElementById('gpa-section').style.display = mode === 'gpa' ? 'block' : 'none';
    document.getElementById('cgpa-section').style.display = mode === 'cgpa' ? 'block' : 'none';
    document.getElementById('gpaTabBtn').classList.toggle('active', mode === 'gpa');
    document.getElementById('cgpaTabBtn').classList.toggle('active', mode === 'cgpa');
    document.getElementById('result-card').style.display = 'none';
}

function addRow(containerId) {
    const container = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'input-group';
    
    if (containerId === 'gpa-rows-container') {
        div.innerHTML = `<input type="number" placeholder="Marks(0-100)" class="gpa-marks">
                         <input type="number" placeholder="Credits" class="gpa-credits">`;
    } else {
        div.innerHTML = `<input type="number" step="0.01" placeholder="Sem GPA" class="cgpa-val">
                         <input type="number" placeholder="Sem Credits" class="cgpa-credits">`;
    }
    container.appendChild(div);
}

/* =========================================
   2. CORE CALCULATION LOGIC
   ========================================= */

function getRelativePoints(marks, threshold) {
    marks = Math.floor(parseFloat(marks));
    const scale = parseInt(threshold);
    
    if (isNaN(marks) || marks < 50) return 0.00;

    // Shift logic: Baseline is 85. 
    // If threshold is 80, we add 5 to marks (easier 4.0).
    // If threshold is 90, we subtract 5 from marks (harder 4.0).
    let adjustedMarks = marks;
    if (scale === 80) adjustedMarks = marks + 5;
    if (scale === 90) adjustedMarks = marks - 5;

    if (adjustedMarks >= 85) return 4.00;

    // Exact data from your provided scale images (Baseline 85 scale)
    const baseScale85 = {
        84: 3.90, 83: 3.80, 82: 3.70, 81: 3.60, 80: 3.50,
        79: 3.42, 78: 3.33, 77: 3.25, 76: 3.17, 75: 3.08, 74: 3.00,
        73: 2.92, 72: 2.83, 71: 2.75, 70: 2.67, 69: 2.58, 68: 2.50,
        67: 2.42, 66: 2.33, 65: 2.25, 64: 2.17, 63: 2.08, 62: 2.00,
        61: 1.92, 60: 1.83, 59: 1.75, 58: 1.67, 57: 1.58, 56: 1.50,
        55: 1.42, 54: 1.33, 53: 1.25, 52: 1.17, 51: 1.08, 50: 1.00 
    };

    return baseScale85[adjustedMarks] || 0.00;
}

function calculateGPA() {
    const marksInputs = document.querySelectorAll('.gpa-marks');
    const creditsInputs = document.querySelectorAll('.gpa-credits');
    const threshold = document.querySelector('input[name="threshold"]:checked').value;

    let totalPoints = 0, totalCredits = 0;

    marksInputs.forEach((m, i) => {
        let mv = parseFloat(m.value);
        let cv = parseFloat(creditsInputs[i].value);
        if(!isNaN(mv) && !isNaN(cv) && cv > 0) {
            totalPoints += getRelativePoints(mv, threshold) * cv;
            totalCredits += cv;
        }
    });
    showFinalResult(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00");
}

function calculateCGPA() {
    const gpas = document.querySelectorAll('.cgpa-val');
    const credits = document.querySelectorAll('.cgpa-credits');
    let totalPoints = 0, totalCredits = 0;

    gpas.forEach((g, i) => {
        let gv = parseFloat(g.value);
        let cv = parseFloat(credits[i].value);
        if(!isNaN(gv) && !isNaN(cv) && cv > 0) {
            totalPoints += gv * cv;
            totalCredits += cv;
        }
    });
    showFinalResult(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00");
}

/* =========================================
   3. RESULT DISPLAY
   ========================================= */

function showFinalResult(score) {
    const card = document.getElementById('result-card');
    const scoreEl = document.getElementById('final-result');
    const msgEl = document.getElementById('congrats-msg');
    
    card.style.display = 'block';
    scoreEl.innerText = score;
    
    if (parseFloat(score) >= 3.5) {
        msgEl.innerHTML = `<span style="color:#10b981">🎉 Congratulations! Good Job! 🌟</span>`;
        card.style.borderColor = "#10b981";
    } else {
        msgEl.innerHTML = "Keep striving for excellence!";
        card.style.borderColor = "#e2e8f0";
    }
    card.scrollIntoView({ behavior: 'smooth' });
}
