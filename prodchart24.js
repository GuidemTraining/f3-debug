$(document).ready(function() {
    let myChart = null; // Global reference to the chart

    function openModalAndInitializeChart() {
        $('#chartModal').css('display', 'flex');
        fetchAndDisplayScoreboard();
    }

    function closeModal() {
        $('#chartModal').hide();
    }

    function refreshChart() {
        if (myChart) {
            myChart.destroy(); // Destroy the existing chart instance before creating a new one
        }
        fetchAndDisplayScoreboard(); // Fetch new data and create a new chart instance
    }

    function fetchAndDisplayScoreboard() {
        // Replace with your actual data fetching logic
        // Example: Fetch data via Ajax and update the chart and table
        console.log("Fetching data from the server...");

        // Simulating an AJAX response with dummy data
        setTimeout(function() {
            var response = {
                participants: [
                    // Simulated data; replace with actual server response
                    { userId: 'user1_id', username: 'user1', score: 100 },
                    { userId: 'user2_id', username: 'user2', score: 90 },
                    // ... more participants
                ]
            };
            console.log("Data fetched successfully: ", response);
            updateChart(response.participants);
            updateScoreboardTable(response.participants);
        }, 1000);
    }

    function updateChart(participants) {
        const ctx = document.getElementById('lineChart').getContext('2d');
        const data = {
            labels: participants.map(p => p.username),
            datasets: [{
                label: 'Score',
                data: participants.map(p => p.score),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };

        myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateScoreboardTable(participants) {
        const leaderboardTableBody = $('#leaderboardTable tbody');
        leaderboardTableBody.empty(); // Clear existing rows

        participants.forEach(function(participant, index) {
            const row = $('<tr></tr>');
            row.append(`<td>${index + 1}</td>`);
            row.append(`<td>${participant.username}</td>`);
            row.append(`<td>${participant.score}</td>`);
            row.append(`<td>${participant.userId}</td>`);
            leaderboardTableBody.append(row);
        });
    }

    // Expose the modal control functions to the global scope
    window.openModalAndInitializeChart = openModalAndInitializeChart;
    window.closeModal = closeModal;
    window.refreshChart = refreshChart;

    // Optionally, trigger the chart initialization on page load
    // openModalAndInitializeChart();
});
