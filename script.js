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

function updateTable() {
    var tableBody = document.getElementById('concernsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";

    concerns.forEach((concern, index) => {
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

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
        };
        cell2.appendChild(select);
    });

    updateChart();
}

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
    document.getElementById('controlPercent').textContent = `Circle of Control: ${controlPercentage.toFixed(2)}%`;
    document.getElementById('influencePercent').textContent = `Circle of Influence: ${influencePercentage.toFixed(2)}%`;
    document.getElementById('concernPercent').textContent = `Circle of Concern: ${concernPercentage.toFixed(2)}%`;

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