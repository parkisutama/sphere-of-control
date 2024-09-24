// Function to calculate transparency based on percentage
function getTransparency(percentage) {
    return Math.min(Math.max(percentage, 0.2), 1); // Transparency between 0.2 and 1
}

// Initialize the chart using Chart.js
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        //labels: ['Circle of Concern', 'Circle of Influence', 'Circle of Control'], // Add labels for each category
        datasets: [{
            label: 'Circle of Concern',
            data: [5],
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            borderWidth: 0,
            cutout: '0%'
        }, {
            label: 'Circle of Influence',
            data: [5],
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            borderWidth: 0,
            cutout: '0%'
        }, {
            label: 'Circle of Control',
            data: [5],
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            borderWidth: 0,
            cutout: '0%'
        }]
    },
    options: {
        responsive: 'true',
        plugins: {
            //legend: {
                //position:'top',
                //display: 'true',
            //}
        },
        cutoutPercentage: 0,
        layout: {
            padding: 0
        }
    }
});

// Function to update the chart and provide actionable advice
function updateChart() {
    var control = parseFloat(document.getElementById('control').value);
    var influence = parseFloat(document.getElementById('influence').value);
    var concern = parseFloat(document.getElementById('concern').value);

    if (isNaN(control) || isNaN(influence) || isNaN(concern) || control <= 0 || influence <= 0 || concern <= 0) {
        alert("Please enter valid numbers for all categories.");
        return;
    }

    var totalData = control + influence + concern;
    var controlPercentage = (control / totalData) * 100;
    var influencePercentage = (influence / totalData) * 100;
    var concernPercentage = (concern / totalData) * 100;

    // Update chart data
    myChart.data.datasets[0].data = [concern];
    myChart.data.datasets[0].backgroundColor = `rgba(0, 0, 255, ${getTransparency(concernPercentage / 100)})`;
    myChart.data.datasets[1].data = [influence];
    myChart.data.datasets[1].backgroundColor = `rgba(0, 0, 255, ${getTransparency(influencePercentage / 100)})`;
    myChart.data.datasets[2].data = [control];
    myChart.data.datasets[2].backgroundColor = `rgba(0, 0, 255, ${getTransparency(controlPercentage / 100)})`;

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