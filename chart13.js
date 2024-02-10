// Sample data containing users' progress
var userData = [
    { name: "User 1", progress: 80 },
    { name: "User 2", progress: 65 },
    { name: "User 3", progress: 90 },
    { name: "User 4", progress: 55 },
    { name: "User 5", progress: 75 },
    { name: "User 6", progress: 70 },
    { name: "User 7", progress: 85 },
    { name: "User 8", progress: 60 },
    { name: "User 9", progress: 95 },
    { name: "User 10", progress: 50 },
    { name: "User 11", progress: 40 },
    // Add more users as needed
];

function createButton(id, text, onClick) {
    var button = $('<button>').attr('id', id).text(text).click(onClick);
    return button;
}

function createProgressBar(user) {
    var progressBar = $('<div>').addClass('progress', 'mb-2');

    var progressBarHTML = `
        <div class="progress-bar" role="progressbar" style="width: ${user.progress}%" aria-valuenow="${user.progress}" aria-valuemin="0" aria-valuemax="100">
            ${user.name} - ${user.progress}%
        </div>
    `;

    progressBar.html(progressBarHTML);
    return progressBar;
}

function showTopUsers(count) {
    var sortedUsers = userData.slice().sort((a, b) => b.progress - a.progress);
    var topUsers = sortedUsers.slice(0, count);
    displayProgressBars(topUsers);
}

function showAllUsers() {
    displayProgressBars(userData);
}

function displayProgressBars(users) {
    var progressBarsContainer = $('#progressBars');
    progressBarsContainer.empty();

    users.forEach(function(user) {
        var progressBar = createProgressBar(user);
        progressBarsContainer.append(progressBar);
    });
}

// Create buttons
var top3Button = createButton("top3Button", "Top 3 Users", function() { showTopUsers(3); });
var top10Button = createButton("top10Button", "Top 10 Users", function() { showTopUsers(10); });
var allUsersButton = createButton("allUsersButton", "All Users", showAllUsers);

// Append buttons to the DOM
$('body').append(top3Button, top10Button, allUsersButton);

// Create container for progress bars
var progressBarsContainer = $('<div>').attr('id', 'progressBars');
$('body').append(progressBarsContainer);

// Listen for clicks on the document using jQuery
$(document).on('click', '#top3Button', function() {
    showTopUsers(3);
});

$(document).on('click', '#top10Button', function() {
    showTopUsers(10);
});

$(document).on('click', '#allUsersButton', function() {
    showAllUsers();
});
