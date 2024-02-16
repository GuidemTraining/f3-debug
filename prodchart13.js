$(document).ready(function() {
    let myChart = null; // Global reference to the chart

    function fetchAndDisplayScoreboard() {
        // Dummy courseData for the sake of the example
        var courseData = {
            courseId: "123",
            chapterId: "456",
            lessonId: "789",
            userId: "user123",
        };

        $.ajax({
            url: '/scoreboard',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(courseData),
            success: function(response) {
                console.log('Scoreboard data:', response);
                if (response && response.participants) {
                    const sortedParticipants = response.participants.sort((a, b) => b.score - a.score); // Sort by score in descending order
                    updateChart(sortedParticipants);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching scoreboard:', error);
            }
        });
    }

    function updateChart(participants) {
        const ctx = document.getElementById('lineChart').getContext('2d');
        const labels = participants.map(participant => participant.username);
        const scores = participants.map(participant => participant.score);

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
                    backgroundColor: 'rgb(75, 192, 192)',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Score'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Participants'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    window.openModalAndInitializeChart = function() {
        $('#chartModal').css('display', 'flex');
        fetchAndDisplayScoreboard();
    };

    window.closeModal = function() {
        $('#chartModal').hide();
    };

    // Example button to open modal and fetch scoreboard
    $('body').append('<button onclick="openModalAndInitializeChart()">Show Scoreboard</button>');

    if (typeof(CoursePlayerV2) !== 'undefined') {
         CoursePlayerV2.on('hooks:contentDidChange', fetchAndDisplayScoreboard);
     }
});
