    function showTopUsers(count) {
        // Assuming `topUsersData` is an array containing top users' progress data
        var topUsers = topUsersData.slice(0, count);

        displayProgressBars(topUsers);
    }

    function showAllUsers() {
        // Assuming `allUsersData` is an array containing all users' progress data
        displayProgressBars(allUsersData);
    }

    function displayProgressBars(users) {
        var progressBarsContainer = document.getElementById('progressBars');
        progressBarsContainer.innerHTML = '';

        users.forEach(function(user, index) {
            var progressBar = document.createElement('div');
            progressBar.classList.add('progress', 'mb-2');

            var progressBarHTML = `
                <div class="progress-bar" role="progressbar" style="width: ${user.progress}%" aria-valuenow="${user.progress}" aria-valuemin="0" aria-valuemax="100">
                    ${user.name} - ${user.progress}%
                </div>
            `;

            progressBar.innerHTML = progressBarHTML;
            progressBarsContainer.appendChild(progressBar);
        });
    }
