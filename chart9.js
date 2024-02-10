    function randomData() {
        return Array.from({length: 7}, () => Math.floor(Math.random() * 50));
    }

    function loadChart() {
        var ctx = document.getElementById('myChart').getContext('2d');

        var data = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: []
        };

        for (var i = 1; i <= 50; i++) {
            var color = 'rgba(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',0.5)';
            data.datasets.push({
                label: 'Player ' + i,
                data: randomData(),
                backgroundColor: color,
                borderColor: color,
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                lineTension: 0,
            });
        }

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
                    display: true,
                    position: 'right',
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
