$(document).ready(function () {
    var courseId;
    var courseName;
    var lessonId;
    var userId;
    var userName;
    var userFirstName;
    var revertCount = 2;
    var rebootCount = 3;
    var examStarted = false;

    // Event handler for starting the exam
    $(document).on('click', '.btn-start-exam', function () {
        $('#startExamModal').modal('show');
    });

    // Event handler for confirming to start the exam
    $('#confirmStartExam').on('click', function () {
        if (!examStarted) {
            startExam();
            $('#startExamModal').modal('hide');
        } else {
            alert('Exam has already started.');
        }
    });

    // Event handler for reverting the exam environment
    $(document).on('click', '.btn-revert-exam', function () {
        if (revertCount > 0 && examStarted) {
            if (!recentlyReverted()) {
                $('#revertModal').modal('show');
            } else {
                alert("You have recently reverted within the last 15 minutes. Try again later.");
            }
        } else {
            alert("Revert count exceeded or exam not started.");
        }
    });

    // Event handler for confirming to revert the exam environment
    $('#confirmRevert').on('click', function () {
        handleAction("Reverting", 5000); // Simulate reverting for 5 seconds
        revertCount--;
        updateButtonStates();
        $('#revertModal').modal('hide');
        sendExamActionRequest('revert');
    });

    // Event handler for rebooting the machines
    $(document).on('click', '.btn-reboot-exam', function () {
        if (rebootCount > 0 && examStarted) {
            $('#rebootModal').modal('show');
        } else {
            alert("Reboot count exceeded or exam not started.");
        }
    });

    // Event handler for confirming to reboot the machines
    $('#confirmReboot').on('click', function () {
        handleAction("Rebooting", 5000); // Simulate rebooting for 5 seconds
        rebootCount--;
        updateButtonStates();
        $('#rebootModal').modal('hide');
        sendExamActionRequest('reboot');
    });

    // Event handler for Thinkific course player event hooks:contentDidChange
    if (typeof CoursePlayerV2 !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            console.log('Thinkific course content changed:', data);
            courseId = data.courseId;
            courseName = data.courseName;
            lessonId = data.lessonId;
            startExam(); // Example of triggering the exam start on content change
        });
    }

    // Function to start the exam
    function startExam() {
        examStarted = true;
        updateButtonStates();
        sendExamActionRequest('start');
    }

    // Function to update the button states
    function updateButtonStates() {
        $('.btn-revert-exam').text("Revert (" + revertCount + " left)").prop('disabled', !examStarted || revertCount <= 0);
        $('.btn-reboot-exam').text("Reboot (" + rebootCount + " left)").prop('disabled', !examStarted || rebootCount <= 0);
        $('.btn-start-exam').prop('disabled', examStarted);
    }

    // Function to check if the exam was recently reverted within the last 15 minutes
    function recentlyReverted() {
        var lastRevertTime = sessionStorage.getItem('lastRevertTime');
        if (lastRevertTime) {
            var currentTime = new Date().getTime();
            var timeDifference = currentTime - parseInt(lastRevertTime);
            return timeDifference < 900000; // 15 minutes in milliseconds
        }
        return false;
    }

    // Function to handle an action (Revert/Reboot)
    function handleAction(action, duration) {
        console.log(action + "...");
        var clickedButton = $('.btn-' + action.toLowerCase() + '-exam');
        clickedButton.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ' + action + '...');
        setTimeout(function () {
            console.log(action + " completed.");
            clickedButton.prop('disabled', false).text(action);
        }, duration);
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
                if (action === 'start') {
                    // Handle successful exam start
                } else if (action === 'revert') {
                    // Handle successful revert action
                } else if (action === 'reboot') {
                    // Handle successful reboot action
                }
                updateButtonStates(); // Update UI based on the new state
            },
            error: function(xhr, status, error) {
                console.error(action + ' action failed:', error);
                alert('Failed to ' + action + ' the exam. Please try again.');
            }
        });
    }
});
