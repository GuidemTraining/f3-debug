// Chart Data
var ctx = document.getElementById('myChart').getContext('2d');
var myChart;

function generateRandomData() {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 50));
}

function toggleTime(interval) {
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

$(document).ready(function() {
    // Event listener for button clicks
    $(document).on('click', '.toggle-buttons button', function() {
        var interval = $(this).data('interval');
        toggleTime(interval);
    });
});
