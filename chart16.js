// Chart Data
var ctx = document.getElementById('myChart').getContext('2d');
var myChart;

// Generate random data for the chart
function generateRandomData() {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 50));
}

// Update the chart based on the selected week
function updateChart(week) {
    if (myChart) {
        myChart.destroy();
    }

    var data = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                label: 'Player 1 Progress',
                data: generateRandomData(),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                lineTension: 0,
            },
            {
                label: 'Player 2 Progress',
                data: generateRandomData(),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                lineTension: 0,
            },
            // Add more datasets for additional players as needed
        ]
    };

    var options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// Initial chart render
updateChart(1);

// Slider event listener
document.getElementById('timeSlider').addEventListener('input', function() {
    var week = parseInt(this.value);
    updateChart(week);
});
