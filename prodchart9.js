// Function to initialize the line chart
function initializeChart() {
    var ctx = document.getElementById('lineChart').getContext('2d');
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'Teo',
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30],
            }, {
                label: 'Ti',
                fill: false,
                backgroundColor: '#2596be',
                borderColor: '#2596be',
                data: [0, 10, 3, 15, 25],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to handle click on the "Show Scoreboard" button
document.getElementById('showScoreboardBtn').addEventListener('click', function() {
    initializeChart();
});

// Function to handle click on the "Refresh" button
document.getElementById('refreshChartBtn').addEventListener('click', function() {
    // Call initializeChart() function to refresh the chart
    initializeChart();
});
