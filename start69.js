$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userName, userFirstName;
    var examStarted = false;
    var revertCount = 2;
    var rebootCount = 3;
    var examTimerInterval;
    var examEndTime;

    // Hook into CoursePlayerV2 for dynamic content changes
    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            courseName = data.course.name;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userName = data.user.name; // Assuming 'name' is the correct property
            userFirstName = data.user.firstName; // Adjust according to actual property names
            console.log("Course data loaded:", courseId, courseName, lessonId, userId, userName, userFirstName);
        });
    }

    // Define the generateNonce function for security purposes
    function generateNonce(length = 16) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Function to start the exam and request exam data from the server
    function startExam() {
        if (!examStarted) {
            sendExamActionRequest('start');
        } else {
            alert('Exam has already started.');
        }
    }

    // Function to send action requests to the backend (start, revert, reboot)
    function sendExamActionRequest(action) {
        const nonce = generateNonce();
        const requestData = {
            courseId: courseId,
            courseName: courseName,
            lessonId: lessonId,
            userId: userId,
            userFirstName: userFirstName,
            action: action,
            nonce: nonce,
            timestamp: Date.now()
        };

        $.ajax({
            url: `https://sb1.guidem.ph/${action}-exam`, // Update with your server endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                console.log(`${action} action successful:`, response);
                if (action === 'start') {
                    examStarted = true;
                    // Assuming the response includes examDuration in milliseconds
                    examEndTime = Date.now() + response.examDuration;
                    updateExamTimer(); // Initialize timer immediately
                    examTimerInterval = setInterval(updateExamTimer, 1000); // Update timer every second
                }
                updateButtonStates(); // Reflect the new state in the UI
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                alert(`Failed to ${action} the exam. Please try again.`);
            }
        });
    }

    // Function to handle reverting the exam
    function revertExam() {
        if (examStarted && revertCount > 0) {
            sendExamActionRequest('revert');
            revertCount--;
            updateButtonStates();
        } else {
            alert('Unable to revert the exam.');
        }
    }

    // Function to handle rebooting the exam
    function rebootExam() {
        if (examStarted && rebootCount > 0) {
            sendExamActionRequest('reboot');
            rebootCount--;
            updateButtonStates();
        } else {
            alert('Unable to reboot the exam.');
        }
    }

    // Timer function to update the exam countdown
    function updateExamTimer() {
        var now = Date.now();
        var timeLeft = examEndTime - now;

        if (timeLeft <= 0) {
            clearInterval(examTimerInterval);
            alert('Exam time has expired!');
            examStarted = false;
            updateButtonStates();
        } else {
            var hours = Math.floor(timeLeft / (1000 * 60 * 60)); // Convert milliseconds to hours
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining milliseconds to minutes

            // Format the hours and minutes
            var formattedTime = '';
            if (hours > 0) {
                formattedTime += hours + "h ";
            }
            formattedTime += minutes + "m";

            // Update the examTimer element with the formatted time
            $('#examTimer').text(formattedTime);
        }
    }

    // Update UI elements based on the current state
    function updateButtonStates() {
        $('.btn-start-exam').prop('disabled', examStarted);
        $('.btn-revert-exam').text(`Revert (${revertCount} left)`).prop('disabled', !examStarted || revertCount <= 0);
        $('.btn-reboot-exam').text(`Reboot (${rebootCount} left)`).prop('disabled', !examStarted || rebootCount <= 0);
    }

    // Event listener for the start exam button
    $(document).on('click', '.btn-start-exam', startExam);
    $(document).on('click', '.btn-revert-exam', revertExam);
    $(document).on('click', '.btn-reboot-exam', rebootExam);
});
