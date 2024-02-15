document.addEventListener('DOMContentLoaded', function() {
    var initializeChart = function() {
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
                    data: [0, 10, 5, 2, 20, 30, 45],
                }, {
                    label: 'Ti',
                    fill: false,
                    backgroundColor: '#2596be',
                    borderColor: '#2596be',
                    data: [0, 10, 3, 15, 25, 35, 40],
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
    };

    // Initialize chart when modal is shown
    $('#chartModal').on('shown.bs.modal', function() {
        initializeChart();
    });

    // Refresh chart data on button click
    document.getElementById('refreshChartBtn').addEventListener('click', function() {
        // Ideally, here you would fetch new data and update the chart instead of re-initializing
        // For demonstration, we're just calling initializeChart again
        initializeChart();
    });
});
