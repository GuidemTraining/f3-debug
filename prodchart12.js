document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch scoreboard data
    async function fetchScoreboardData() {
        try {
            const response = await fetch('https://sb1.guidem.ph/scoreboard');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            updateScoreboardTable(data.participants); // Update the table with fetched data
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    // Function to update the scoreboard table
    function updateScoreboardTable(participants) {
        const tbody = document.querySelector("#chartModal .top-performers-container tbody");
        tbody.innerHTML = ''; // Clear existing rows

        participants.forEach((participant, index) => {
            const row = tbody.insertRow();
            const placeCell = row.insertCell(0);
            const usernameCell = row.insertCell(1);
            const scoreCell = row.insertCell(2);
            const awardCell = row.insertCell(3);

            placeCell.textContent = index + 1;
            usernameCell.textContent = participant.username;
            scoreCell.textContent = participant.score;
            // Example of adding an icon. Adjust based on your data or logic.
            awardCell.innerHTML = `<span class="icon star">🌟</span>`;
        });
    }

    // Function to open the modal and initialize or refresh the chart
    window.openModalAndInitializeChart = function() {
        document.getElementById('chartModal').style.display = 'flex';
        fetchScoreboardData(); // Fetch and display scoreboard data when modal opens
    };

    // Function to close the modal
    window.closeModal = function() {
        document.getElementById('chartModal').style.display = 'none';
    };

    // Function to refresh the chart data
    window.refreshChart = function() {
        fetchScoreboardData(); // Re-fetch and update the scoreboard data
    };
});
