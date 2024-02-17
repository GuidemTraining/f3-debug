$(document).ready(function() {
    let myChart = null; // Global reference to the chart

    // Function to fetch and display scoreboard data
    function fetchAndDisplayScoreboard() {
        var courseData = {
            courseId: "2660455",
            chapterId: "12146992",
            lessonId: "52595165",
            userId: "51725422",
        };

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
        // Prepare the labels and data arrays
        const labels = participants.map(p => p.username);
        const scores = participants.map(p => p.score);

        if (myChart) {
            myChart.destroy(); // Destroy the existing chart before creating a new one
        }

        // Create a new chart
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

    // Function to update the leaderboard table
    function updateScoreboardTable(participants) {
        const leaderboardTableBody = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
        leaderboardTableBody.innerHTML = ''; // Clear existing rows

        // Create and append rows for each participant
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

    // Attach the openModalAndInitializeChart function to the window object
    window.openModalAndInitializeChart = function() {
        $('#chartModal').css('display', 'flex');
        fetchAndDisplayScoreboard(); // Fetch data and update the chart and table
    };

    // Attach the closeModal function to the window object
    window.closeModal = function() {
        $('#chartModal').hide();
    };

    // Attach the refreshChart function to the window object
    window.refreshChart = function() {
        if (myChart) {
            myChart.destroy(); // Destroy existing chart
        }
        fetchAndDisplayScoreboard(); // Fetch new data and reinitialize the chart and table
    };
});
