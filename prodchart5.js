document.addEventListener('DOMContentLoaded', function() {
    // Get the modal element
    var scoreboardModal = document.getElementById('scoreboardModal');

    // Get the chart canvas element
    var chartCanvas = scoreboardModal.querySelector('#lineChart');

    // Create a variable to hold the chart instance
    var chart;

    // Function to initialize the chart
    function initializeChart() {
        var chartDot = new Image();
        chartDot.src = 'https://cdn.icon-icons.com/icons2/1879/PNG/512/iconfinder-8-avatar-2754583_120515.png';
        chartDot.width = 25;
        chartDot.height = 25;

        var ctx = chartCanvas.getContext("2d");
        chart = new Chart(ctx, {
            type: 'line',
            responsive: false,
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                        label: 'Teo',
                        fill: false,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: [0, 10, 5, 2, 20, 30],
                        pointStyle: chartDot,
                        pointRadius: [0, 0, 0, 0, 0, 1] // Last dot
                    },
                    {
                        label: 'Ti',
                        fill: false,
                        backgroundColor: '#2596be',
                        borderColor: '#2596be',
                        data: [0, 10, 3, 15, 25],
                        pointStyle: chartDot,
                        pointRadius: [0, 0, 0, 0, 1] // Last dot
                    }
                ]
            },
            options: {}
        });
    }

    // Function to destroy the chart
    function destroyChart() {
        if (chart) {
            chart.destroy();
        }
    }

    // Event listener for modal show event
    scoreboardModal.addEventListener('show.bs.modal', function() {
        initializeChart();
    });

    // Event listener for modal hidden event
    scoreboardModal.addEventListener('hidden.bs.modal', function() {
        destroyChart();
    });

    // Event listener for button click to show modal
    document.getElementById('showScoreboardBtn').addEventListener('click', function() {
        // Show the modal
        var modal = new bootstrap.Modal(scoreboardModal);
        modal.show();
    });
});
