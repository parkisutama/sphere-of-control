// Function to calculate transparency based on percentage
function getTransparency(percentage) {
    return Math.min(Math.max(percentage, 0.2), 1); // Transparency between 0.2 and 1
}

// Initialize the chart using Chart.js
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Circle of Concern', 'Circle of Influence', 'Circle of Control'],
        datasets: [
            {
                label: 'Circle of Concern',
                data: [2],
                backgroundColor: 'rgba(173, 238, 227, 0.2)', // Control
                borderWidth: 0,
                cutout: '0%'
            },
            {
                label: 'Circle of Influence',
                data: [4],
                backgroundColor: 'rgba(173, 238, 227, 0.2)', // Influence
                borderWidth: 0,
                cutout: '0%'
            },
            {
                label: 'Circle of Control',
                data: [6],
                backgroundColor: 'rgba(173, 238, 227, 0.2)', // Concern
                borderWidth: 0,
                cutout: '0%'
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            }
        },
        layout: {
            padding: 0
        }
    }
});

var concerns = [];

function addConcern() {
    var concernInput = document.getElementById('concernInput').value;
    if (concernInput.trim() === "") {
        alert("Please enter a valid concern.");
        return;
    }

    concerns.push({ text: concernInput, category: 'Uncategorized' });
    document.getElementById('concernInput').value = "";
    updateTable();
}

// ... existing code ...

function updateTable() {
    var tableBody = document.getElementById('concernsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";

    concerns.forEach((concern, index) => {
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2); // New cell for edit, delete, and move buttons

        cell1.textContent = concern.text;

        var select = document.createElement('select');
        select.innerHTML = `
            <option value="Uncategorized">Uncategorized</option>
            <option value="Control">Control</option>
            <option value="Influence">Influence</option>
            <option value="Concern">Concern</option>
        `;
        select.value = concern.category;
        select.onchange = function () {
            concerns[index].category = this.value;
            updateChart();
            saveConcerns();
        };
        cell2.appendChild(select);

        var actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        var editButton = document.createElement('button');
        editButton.className = 'action-button';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.onclick = function () {
            editConcern(index);
        };
        actionButtons.appendChild(editButton);

        var deleteButton = document.createElement('button');
        deleteButton.className = 'action-button';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = function () {
            deleteConcern(index);
        };
        actionButtons.appendChild(deleteButton);

        var upButton = document.createElement('button');
        upButton.className = 'action-button';
        upButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        upButton.onclick = function () {
            moveConcernUp(index);
        };
        actionButtons.appendChild(upButton);

        var downButton = document.createElement('button');
        downButton.className = 'action-button';
        downButton.innerHTML = '<i class="fas fa-arrow-down"></i>';
        downButton.onclick = function () {
            moveConcernDown(index);
        };
        actionButtons.appendChild(downButton);

        cell3.appendChild(actionButtons);
    });

    updateChart();
}

// ... existing code ...

function updateChart() {
    var controlCount = concerns.filter(c => c.category === 'Control').length;
    var influenceCount = concerns.filter(c => c.category === 'Influence').length;
    var concernCount = concerns.filter(c => c.category === 'Concern').length;
    var totalCount = concerns.length;

    var controlPercentage = (controlCount / totalCount) * 100;
    var influencePercentage = (influenceCount / totalCount) * 100;
    var concernPercentage = (concernCount / totalCount) * 100;

    // Update chart data
    myChart.data.datasets[0].data = [concernCount];
    myChart.data.datasets[0].backgroundColor = `rgba(173, 238, 227, ${getTransparency(concernPercentage / 100)})`;
    myChart.data.datasets[1].data = [influenceCount];
    myChart.data.datasets[1].backgroundColor = `rgba(134, 222, 183, ${getTransparency(influencePercentage / 100)})`;
    myChart.data.datasets[2].data = [controlCount];
    myChart.data.datasets[2].backgroundColor = `rgba(99, 185, 149, ${getTransparency(controlPercentage / 100)})`;
    
    myChart.update();

    // Update percentage text
    document.getElementById('controlPercent').textContent = `Things you can control : ${controlCount} (${controlPercentage.toFixed(2)}%)`;
    document.getElementById('influencePercent').textContent = `Things you Influence : ${influenceCount} (${influencePercentage.toFixed(2)}%)`;
    document.getElementById('concernPercent').textContent = `Things outside your control and influence : ${concernCount} (${concernPercentage.toFixed(2)}%)`;

    // Update total concerns text
    document.getElementById('totalConcerns').textContent = `Total Concerns: ${totalCount}`;

    // Provide actionable advice based on percentages
    var advice = "";
    if (concernPercentage > 50) {
        advice = "You're spending too much time worrying about things outside of your control. Focus on actions you can influence.";
    } else if (controlPercentage > 50) {
        advice = "Great! You're focusing on things you can directly control. Keep up the good work!";
    } else if (influencePercentage > 50) {
        advice = "You're focusing on areas where you have influence, which is a good balance. Keep working on strengthening your direct control.";
    } else {
        advice = "Your attention is spread out fairly evenly. Try to focus more on what you can control for better results.";
    }

    document.getElementById('advice').textContent = advice;
}

//local data
// Load concerns from local storage
function loadConcerns() {
    var storedConcerns = localStorage.getItem('concerns');
    if (storedConcerns) {
        concerns = JSON.parse(storedConcerns);
        updateTable();
    }
}

// Save concerns to local storage
function saveConcerns() {
    localStorage.setItem('concerns', JSON.stringify(concerns));
}

// Tambahkan event listener untuk mendeteksi tombol "Enter"
document.getElementById('concernInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addConcern();
    }
});

function addConcern() {
    var concernInput = document.getElementById('concernInput').value;
    if (concernInput.trim() === "") {
        alert("Please enter a valid concern.");
        return;
    }

    concerns.push({ text: concernInput, category: 'Uncategorized' });
    document.getElementById('concernInput').value = "";
    updateTable();
    saveConcerns();
}

function editConcern(index) {
    var newText = prompt("Edit your concern:", concerns[index].text);
    if (newText !== null && newText.trim() !== "") {
        concerns[index].text = newText;
        updateTable();
        saveConcerns();
    }
}

function deleteConcern(index) {
    concerns.splice(index, 1);
    updateTable();
    saveConcerns();
}

function moveConcernUp(index) {
    if (index > 0) {
        [concerns[index], concerns[index - 1]] = [concerns[index - 1], concerns[index]];
        updateTable();
        saveConcerns();
    }
}

function moveConcernDown(index) {
    if (index < concerns.length - 1) {
        [concerns[index], concerns[index + 1]] = [concerns[index + 1], concerns[index]];
        updateTable();
        saveConcerns();
    }
}

// Load concerns when the page loads
window.onload = loadConcerns;