$(document).ready(function() {
    let myChart = null; // Global reference to the chart

    function openModalAndInitializeChart() {
    document.getElementById('chartModal').style.display = 'flex';
    if (!myChart) { // Initialize chart only if it hasn't been initialized
        initializeChart();
    }
    }
    function updateScoreboardTable(participants) {
        const leaderboardTableBody = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
        leaderboardTableBody.innerHTML = ''; // Clear existing rows
        
        // Iterate over the participants to create table rows
        participants.forEach((participant, index) => {
          const row = leaderboardTableBody.insertRow();
          const rankCell = row.insertCell(0);
          const usernameCell = row.insertCell(1);
          const scoreCell = row.insertCell(2);
          const userIdCell = row.insertCell(3);
      
          rankCell.textContent = index + 1; // Assuming the participants array is already sorted
          usernameCell.textContent = participant.username;
          scoreCell.textContent = participant.score;
          userIdCell.textContent = participant.userId;
      
          // Add any additional styling or icons as needed
        });
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
      


    function fetchAndDisplayScoreboard() {
        // Dummy courseData for the sake of the example
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
