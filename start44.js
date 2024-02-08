$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userName, userFirstName;
    var examStarted = false;
    var revertCount = 2; // Set the initial revert count
    var rebootCount = 3; // Set the initial reboot count

    // Hook into the course player changes
    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            courseName = data.course.name;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userName = data.user.name;
            userFirstName = data.user.firstName;
            // Optionally, trigger VPN generation here or enable the button
        });
    }

    // Function to start the exam
    function startExam() {
        if (!examStarted) {
            examStarted = true;
            sendExamActionRequest('start');
        } else {
            alert('Exam has already started.');
        }
    }

    // Function to revert the exam environment
    function revertExam() {
        if (revertCount > 0 && examStarted) {
            sendExamActionRequest('revert');
            revertCount--; // Decrement revert count
            updateButtonStates(); // Update button states after action
        } else {
            alert("Revert count exceeded or exam not started.");
        }
    }

    // Function to reboot the machines
    function rebootMachines() {
        if (rebootCount > 0 && examStarted) {
            sendExamActionRequest('reboot');
            rebootCount--; // Decrement reboot count
            updateButtonStates(); // Update button states after action
        } else {
            alert("Reboot count exceeded or exam not started.");
        }
    }

    // Function to send exam action request to Express.js server
    function sendExamActionRequest(action) {
        var requestData = {
            courseId: courseId,
            courseName: courseName,
            lessonId: lessonId,
            userId: userId,
            userName: userName,
            userFirstName: userFirstName,
            action: action
        };

        $.ajax({
            url: `https://sb1.guidem.ph/${action}`, // Update URL with your Express server URL
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                console.log(action + ' action successful:', response);
                // Handle success response if needed
                updateButtonStates(); // Update UI based on the new state
            },
            error: function(xhr, status, error) {
                console.error(action + ' action failed:', error);
                alert('Failed to ' + action + ' the exam. Please try again.');
            }
        });
    }

    // Function to update the button states
    function updateButtonStates() {
        // Update UI based on exam state and counts
        $('.btn-start-exam').prop('disabled', examStarted);
        $('.btn-revert-exam').text("Revert (" + revertCount + " left)").prop('disabled', !examStarted || revertCount <= 0);
        $('.btn-reboot-exam').text("Reboot (" + rebootCount + " left)").prop('disabled', !examStarted || rebootCount <= 0);
    }

    // Event listener for the "Start Exam" button click
    $('.btn-start-exam').click(startExam);

    // Event listener for the "Revert Exam" button click
    $('.btn-revert-exam').click(revertExam);

    // Event listener for the "Reboot Machines" button click
    $('.btn-reboot-exam').click(rebootMachines);
});
