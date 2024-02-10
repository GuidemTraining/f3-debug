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
        indexAxis: 'y', // Change the bars to be horizontal
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

document.getElementById('startButton').onclick = function() {
    setInterval(updateChartData, 1000); // Update the chart data every second
};

function updateChartData() {
    // Generate new data and labels
    var newData = Array.from({ length: racingChart.data.labels.length }, () => Math.floor(Math.random() * 100));
    var newLabels = racingChart.data.labels.map((label, index) => `Label ${index}`);

    // Sort the data and labels by the data values in descending order
    var combined = newLabels.map((label, index) => {
        return { label: label, data: newData[index] };
    });
    combined.sort((a, b) => b.data - a.data);

    // Update the chart data
    racingChart.data.labels = combined.map(item => item.label);
    racingChart.data.datasets.forEach((dataset) => {
        dataset.data = combined.map(item => item.data);
    });

    racingChart.update();
}

// Initial setup
function initializeChartData() {
    // Setup initial data
    racingChart.data.labels = Array.from({ length: 20 }, (v, k) => `Label ${k}`); // Create 20 labels
    racingChart.data.datasets[0].data = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));

    racingChart.update();
}

initializeChartData();
