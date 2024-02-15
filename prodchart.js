document.getElementById("showScoreboardBtn").addEventListener("click", function() {
    // Dummy data for demonstration
    const labels = ['User1', 'User2', 'User3', 'User4', 'User5'];
    const scores = [80, 85, 90, 88, 92];

    // Create chart
    const ctx = document.getElementById('scoreChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Scores',
                data: scores,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
