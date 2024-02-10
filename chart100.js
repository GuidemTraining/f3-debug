// Wait for the DOM to fully load before accessing elements
document.addEventListener('DOMContentLoaded', function() {
    var ctx = document.getElementById('racingChart').getContext('2d');
    var racingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`), // Initial labels from Item 1 to Item 20
            datasets: [{
                label: 'Scores',
                data: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)), // Initial random data for each label
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false // Optionally hide the legend
                }
            },
            animation: {
                duration: 0 // Optionally remove animation
            }
        }
    });

    document.getElementById('startRaceButton').addEventListener('click', function() {
        setInterval(function() {
            // Generate new data
            racingChart.data.datasets.forEach(dataset => {
                dataset.data = dataset.data.map(() => Math.floor(Math.random() * 100));
            });

            // Sort the data (and labels accordingly) in descending order
            racingChart.data.labels.sort((a, b) => {
                const aValue = racingChart.data.datasets[0].data[racingChart.data.labels.indexOf(a)];
                const bValue = racingChart.data.datasets[0].data[racingChart.data.labels.indexOf(b)];
                return bValue - aValue;
            });
            racingChart.data.datasets[0].data.sort((a, b) => b - a);

            racingChart.update();
        }, 1000);
    });
});
