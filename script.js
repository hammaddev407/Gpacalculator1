
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
    if(containerId === 'gpa-rows-container') {
        div.innerHTML = `<input type="number" placeholder="Marks(0-100)" class="gpa-marks"><input type="number" placeholder="Credits" class="gpa-credits">`;
    } else {
        div.innerHTML = `<input type="number" step="0.01" placeholder="Sem GPA" class="cgpa-val"><input type="number" placeholder="Sem Credits" class="cgpa-credits">`;
    }
    container.appendChild(div);
}

// RELATIVE GPA CALCULATION
function getRelativePoints(marks, threshold) {
    marks = parseFloat(marks);
    const scale = parseInt(threshold);
    
    if (marks >= scale) return 4.00;
    
    // Relative shift: Every 5 marks below threshold is roughly 0.5 points
    let points = 4.0 - ((scale - marks) * 0.1);
    return points > 0 ? points.toFixed(2) : 0.00;
}

function calculateGPA() {
    const marks = document.querySelectorAll('.gpa-marks');
    const credits = document.querySelectorAll('.gpa-credits');
    const threshold = document.querySelector('input[name="threshold"]:checked').value;
    
    let totalPoints = 0, totalCredits = 0;

    marks.forEach((m, i) => {
        let mv = parseFloat(m.value);
        let cv = parseFloat(credits[i].value);
        if(!isNaN(mv) && !isNaN(cv)) {
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
        if(!isNaN(gv) && !isNaN(cv)) {
            totalPoints += gv * cv;
            totalCredits += cv;
        }
    });

    showFinalResult(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00");
}

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
function returnToStart() {
    // 1. Hide the result popup
    closeResult();

    // 2. Clear all input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');

    // 3. Remove extra rows (optional: keeps only the first row)
    const subjectList = document.getElementById('subject-list');
    while (subjectList.children.length > 1) {
        subjectList.removeChild(subjectList.lastChild);
    }

    const semesterList = document.getElementById('semester-list');
    while (semesterList.children.length > 1) {
        semesterList.removeChild(semesterList.lastChild);
    }
    
    // 4. Reset result text on the main page
    document.getElementById('gpa-result').innerText = "Result: --";
    document.getElementById('cgpa-result').innerText = "Result: --";
}
function autoReset() {
    // 1. Hide the result popup
    document.getElementById('overlay').style.display = 'none';

    // 2. Clear all input fields
    document.querySelectorAll('input').forEach(input => input.value = '');

    // 3. Remove dynamically added rows (keep only the first row)
    const gpaList = document.getElementById('gpa-list');
    while (gpaList.children.length > 1) {
        gpaList.removeChild(gpaList.lastChild);
    }
}
