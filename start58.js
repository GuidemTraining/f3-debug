$(document).ready(function () {
    var examStarted = false;
    var revertCount = 2;
    var rebootCount = 3;
    var examTimerInterval;
    var examEndTime;

    // Function to start the exam and request exam data from the server
    function startExam() {
        if (!examStarted) {
            sendExamActionRequest('start');
        } else {
            alert('Exam has already started.');
        }
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

    // Function to send action requests to the backend (start, revert, reboot)
    function sendExamActionRequest(action) {
        // Assuming you have the necessary data available
        const requestData = {
            action: action,
            // Include other required data like courseId, courseName, etc.
        };

        // Assuming you have the necessary endpoint
        $.ajax({
            url: `https://example.com/${action}-exam`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                console.log(`${action} action successful:`, response);
                if (action === 'start') {
                    examStarted = true;
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

            // Update the examTimer element with the remaining hours and minutes
            $('#examTimer').text(hours + "h " + minutes + "m");
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
