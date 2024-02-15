let myChart = null; // Global reference to the chart

function openModalAndInitializeChart() {
  document.getElementById('chartModal').style.display = 'flex';
  if (!myChart) { // Initialize chart only if it hasn't been initialized
    initializeChart();
  }
}

function closeModal() {
  document.getElementById('chartModal').style.display = 'none';
}

function refreshChart() {
  if (myChart) {
    myChart.destroy(); // Destroy existing chart
  }
  initializeChart(); // Initialize new chart
}

function initializeChart() {
  var ctx = document.getElementById('lineChart').getContext('2d');
  myChart = new Chart(ctx, {
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
}
