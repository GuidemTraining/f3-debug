    function randomData() {
        return Array.from({length: 7}, () => Math.floor(Math.random() * 50));
    }

    function loadChart() {
        var ctx = document.getElementById('myChart').getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(255, 0, 150, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

        var data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Player 1 Progress',
                    data: randomData(),
                    backgroundColor: gradient,
                    borderColor: 'rgba(255, 0, 150, 1)',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(255, 0, 150, 1)',
                    pointBorderColor: 'rgba(255, 255, 255, 1)',
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: 'rgba(255, 0, 150, 1)',
                    pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
                },
                {
                    label: 'Player 2 Progress',
                    data: randomData(),
                    backgroundColor: 'rgba(0, 255, 255, 0.5)',
                    borderColor: 'rgba(0, 255, 255, 1)',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(0, 255, 255, 1)',
                    pointBorderColor: 'rgba(255, 255, 255, 1)',
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: 'rgba(0, 255, 255, 1)',
                    pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
                },
                // Add more datasets for additional players as needed
            ]
        };

        var options = {
            animation: {
                duration: 2000, // Animation duration in milliseconds
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)'
                    }
                }
            }
        };

        var myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });
    }
