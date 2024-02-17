$(document).ready(function() {
    let myChart = null; // Global reference to the chart

    // Function to fetch and display scoreboard data
    function fetchAndDisplayScoreboard() {
        // Here, adjust to use the correct courseData or get it dynamically as needed
        var courseData = {
            courseId: "2660455",
            chapterId: "12146992",
            lessonId: "52595165",
            userId: "51725422",
        };

        // Adjust this to your backend endpoint that returns the scoreboard data
        $.ajax({
            url: 'https://sb1.guidem.ph/scoreboard',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(courseData),
            success: function(response) {
                console.log('Scoreboard data:', response);
                if (response && response.participants) {
                    const sortedParticipants = response.participants.sort((a, b) => b.score - a.score);
                    updateChart(sortedParticipants);
                    updateScoreboardTable(sortedParticipants);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching scoreboard:', error);
            }
        });
    }

    // Function to update the chart with new data
    function updateChart(participants) {
        const ctx = document.getElementById('lineChart').getContext('2d');
        const labels = participants.map(p => p.username);
        const scores = participants.map(p => p.score);

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
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
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Function to update the scoreboard table
    function updateScoreboardTable(participants) {
        const leaderboardTableBody = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
        leaderboardTableBody.innerHTML = ''; // Clear existing rows

        participants.forEach((participant, index) => {
            const row = leaderboardTableBody.insertRow();
            const rankCell = row.insertCell(0);
            const usernameCell = row.insertCell(1);
            const scoreCell = row.insertCell(2);
            const userIdCell = row.insertCell(3);

            rankCell.textContent = index + 1;
            usernameCell.textContent = participant.username;
            scoreCell.textContent = participant.score;
            userIdCell.textContent = participant.userId;
        });
    }

    // Attach the functions to the window object to make them globally accessible
    window.openModalAndInitializeChart = openModalAndInitializeChart;
    window.closeModal = closeModal;
    window.refreshChart = refreshChart;

    // Function to open the modal and initialize the chart
    function openModalAndInitializeChart() {
        $('#chartModal').css('display', 'flex');
        fetchAndDisplayScoreboard();
    }

    // Function to close the modal
    function closeModal() {
        $('#chartModal').hide();
    }

    // Function to refresh the chart and the scoreboard table
    function refreshChart() {
        fetchAndDisplayScoreboard();
    }
});
