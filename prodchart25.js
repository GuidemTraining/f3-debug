$(document).ready(function() {
    let myChart = null; // Global reference to the chart

    window.openModalAndInitializeChart = function() {
        $('#chartModal').css('display', 'flex');
        fetchAndDisplayScoreboard();
    };

    window.closeModal = function() {
        $('#chartModal').hide();
    };

    window.refreshChart = function() {
        if (myChart) {
            myChart.destroy();
        }
        fetchAndDisplayScoreboard();
    };

    function fetchAndDisplayScoreboard() {
        // Note: Update the courseData with actual IDs or other required data
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
                if (response && response.participants) {
                    // Assuming response.participants is an array of participant objects
                    const sortedParticipants = response.participants.sort((a, b) => b.score - a.score);
                    updateChart(sortedParticipants);
                    updateScoreboardTable(sortedParticipants);
                } else {
                    console.error('Unexpected response format:', response);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching scoreboard:', error);
            }
        });
    }

    function updateChart(participants) {
        const ctx = document.getElementById('lineChart').getContext('2d');
        const labels = participants.map(p => p.username); // This should be the time labels if you have time-based data

        // Create datasets for each participant with a unique color
        const datasets = participants.map((participant, index) => ({
            label: participant.username,
            data: [participant.score], // This should be an array of scores over time
            fill: false,
            borderColor: getLineColor(index),
            tension: 0.4
        }));

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function updateScoreboardTable(participants) {
        const leaderboardTableBody = $('#leaderboardTable tbody');
        leaderboardTableBody.empty();

        participants.forEach((participant, index) => {
            const row = $('<tr></tr>');
            row.append(`<td>${index + 1}</td>`);
            row.append(`<td>${participant.username}</td>`);
            row.append(`<td>${participant.score}</td>`);
            row.append(`<td>${participant.userId}</td>`);
            leaderboardTableBody.append(row);
        });
    }

    function getLineColor(index) {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];
        return colors[index % colors.length];
    }

    // Initialize the chart on page load for testing
    openModalAndInitializeChart();
});
