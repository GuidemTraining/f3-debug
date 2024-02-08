$(document).ready(function () {
    var examStarted = false;
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

    // Function to send action requests to the backend (start, revert, reboot)
    function sendExamActionRequest(action) {
        const requestData = {
            action: action
            // Include other required data like courseId, courseName, etc.
        };

        $.ajax({
            url: `https://sb1.guidem.ph/${action}-exam`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                console.log(`${action} action successful:`, response);
                if (action === 'start') {
                    try {
                        examEndTime = new Date(response.endTime).getTime();
                        console.log('Exam end time:', examEndTime);
                        if (isNaN(examEndTime)) {
                            throw new Error('Invalid end time received');
                        }
                        examStarted = true;
                        updateExamTimer();
                        examTimerInterval = setInterval(updateExamTimer, 1000);
                    } catch (error) {
                        console.error('Error parsing end time:', error);
                        alert('Error starting exam. Please try again.');
                    }
                }
                updateButtonStates();
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
            var hours = Math.floor(timeLeft / (1000 * 60 * 60));
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            $('#examTimer').text(hours + "h " + minutes + "m");
        }
    }

    // Update UI elements based on the current state
    function updateButtonStates() {
        $('.btn-start-exam').prop('disabled', examStarted);
    }

    // Event listener for the start exam button
    $(document).on('click', '.btn-start-exam', startExam);
});
