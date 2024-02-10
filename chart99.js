var ctx = document.getElementById('racingChart').getContext('2d');
var racingChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [], // Labels will be added dynamically
        datasets: [{
            label: 'Scores',
            data: [], // Data will be added dynamically
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
        }]
    },
    options: {
        indexAxis: 'y', // Bars will be horizontal
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true
            }
        },
        animation: {
            duration: 0 // Turn off animation for performance
        }
    }
});

document.getElementById('startRaceButton').onclick = function() {
    setInterval(updateChartData, 1000); // Update the chart data every second
};

function updateChartData() {
    // Generate new data
    var newData = Array.from({ length: racingChart.data.labels.length }, () => Math.floor(Math.random() * 100));

    // Sort the data in descending order and update chart
    racingChart.data.datasets[0].data.sort((a, b) => b - a);
    racingChart.data.datasets[0].data = newData;

    racingChart.update();
}

// Initialize with some data
function initializeChartData() {
    // Setup initial data
    racingChart.data.labels = Array.from({ length: 20 }, (v, k) => `Item ${k + 1}`);
    racingChart.data.datasets[0].data = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));

    racingChart.update();
}

initializeChartData();
