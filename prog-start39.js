$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var examTimerInterval;
    var examEndTime;
    var examStartTime;

    // Hook into CoursePlayerV2 and other preliminary setups

    // Correctly defined updateExamTimer function at a scope accessible by all functions
    function updateExamTimer() {
        if (!examEndTime) {
            console.error('Exam end time is not set.');
            return;
        }
        var now = new Date().getTime();
        var timeLeft = examEndTime.getTime() - now;

        if (timeLeft <= 0) {
            clearInterval(examTimerInterval);
            alert('Exam time has expired!');
            examStarted = false;
            // Any additional logic to handle exam expiration
        } else {
            var hours = Math.floor((timeLeft / (1000 * 60 * 60)));
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            $('#examTimer').text(hours + "h " + minutes + "m remaining");
        }
    }

    // Ensure the updateExamTimer function is defined before any AJAX calls that might use it

    // AJAX call setup and success/error handling
    function sendExamActionRequest(action) {
        // AJAX setup including the URL and requestData

        $.ajax({
            // AJAX configuration
            success: function (response) {
                console.log(`${action} action successful:`, response);
                if (action === 'start' || action === 'checkExamUserProgress') {
                    // Handle response and update exam status
                    examStartTime = new Date(response.examData.startTime);
                    examEndTime = new Date(response.examData.endTime);
                    updateExamTimer(); // Call this function on successful response
                    if (!examTimerInterval) {
                        examTimerInterval = setInterval(updateExamTimer, 1000);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                // Handle error
            }
        });
    }

    // Other functionalities (startExam, revertExam, rebootExam, etc.)

    // Event binding for buttons
    $(document).on('click', '.btn-start-exam', startExam);
    // Bind other buttons as necessary
});
