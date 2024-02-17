$(document).ready(function() {
    var courseId, chapterId, lessonId, userId,userFirstName;

    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            chapterId = data.chapter.id;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userFirstName = data.user.first_name;
        });
    }


    let myChart = null;

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

        $.ajax({
            url: 'https://sb1.guidem.ph/scoreboard',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                    courseId: courseId,
                    chapterId: chapterId,
                    lessonId: lessonId,
                    userId: userId,
            }),
            success: function(response) {
                if (response && response.participants) {
                    updateChart(response.participants);
                    updateScoreboardTable(response.participants);
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
        // Assuming each participant has a score history array under keys like 'user1', 'user2', etc.
        const datasets = participants.map((participant, index) => {
            const scores = Object.keys(participant)
                .filter(key => key.startsWith('user'))
                .map(key => participant[key]);

            return {
                label: participant.username,
                data: scores,
                fill: false,
                borderColor: getLineColor(index),
                tension: 0.4
            };
        });

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'line',
            data: { labels: ['00:00', '00:10', '00:20', '00:30', '00:40'], datasets },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: { display: true, position: 'bottom' }
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
            // Assuming the score is under a 'score' key
            row.append(`<td>${participant.score}</td>`);
            row.append(`<td>${participant.userId}</td>`);
            leaderboardTableBody.append(row);
        });
    }

    function getLineColor(index) {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        return colors[index % colors.length];
    }
});
