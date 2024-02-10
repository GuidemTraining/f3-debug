// JavaScript to initialize the chart and handle the button click

var ctx = document.getElementById('racingChart').getContext('2d');
var racingChart = new Chart(ctx, {
    type: 'line', // You can change the type to 'bar' if you prefer a bar racing chart
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Number of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
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

function raceChart() {
    racingChart.data.datasets.forEach((dataset) => {
        dataset.data = dataset.data.map(() => Math.floor(Math.random() * 100));
    });
    racingChart.update();
}

document.getElementById('startButton').addEventListener('click', function() {
    setInterval(raceChart, 1000); // Update the chart every second
});
