function loadChart() {
        var ctx = document.getElementById('myChart').getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(255, 0, 150, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Player Progress',
                    data: [10, 20, 30, 25, 35, 45, 40],
                    backgroundColor: gradient,
                    borderColor: 'rgba(255, 0, 150, 1)',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(255, 0, 150, 1)',
                    pointBorderColor: 'rgba(255, 255, 255, 1)',
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: 'rgba(255, 0, 150, 1)',
                    pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
                }]
            },
            options: {
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
            }
        });
    }
