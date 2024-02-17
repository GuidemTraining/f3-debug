$(document).ready(function() {
    let myChart = null; // Global reference to the chart

    function fetchAndDisplayScoreboard() {
        var courseData = {
            courseId: "2660455",
            chapterId: "12146992",
            lessonId: "52595165",
            userId: "51725422",
        };

        console.log('Fetching scoreboard data...'); // Debugging statement

        $.ajax({
            url: 'https://sb1.guidem.ph/scoreboard',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(courseData),
            success: function(response) {
                console.log('Scoreboard data received:', response); // Debugging statement
                if (response && response.participants) {
                    const sortedParticipants = response.participants.sort((a, b) => b.score - a.score);
                    console.log('Sorted participants:', sortedParticipants); // Debugging statement
                    updateChart(sortedParticipants);
                    updateScoreboardTable(sortedParticipants);
                } else {
                    console.error('Invalid data structure:', response); // Debugging statement
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching scoreboard:', error); // Debugging statement
            }
        });
    }

    // ... (rest of your updateChart function)

    function updateScoreboardTable(participants) {
        const leaderboardTableBody = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
        if (!leaderboardTableBody) {
            console.error('Leaderboard table body not found!'); // Debugging statement
            return;
        }
        leaderboardTableBody.innerHTML = ''; // Clear existing rows

        console.log('Updating scoreboard table...'); // Debugging statement

        participants.forEach((participant, index) => {
            console.log('Adding participant to table:', participant); // Debugging statement
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

    // ... (rest of your functions and window bindings)
});
