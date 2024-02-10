$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var examTimerInterval;
    var examEndTime; // Holds the exam end time

    // Resets the accordion to its default state and ensures it's initially disabled
    function resetAndDisableAccordion() {
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false").prop('disabled', true);
    }

    // Generates a nonce for security purposes
    function generateNonce(length = 16) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Starts the exam and requests exam data from the server
    function startExam() {
        if (!examStarted) {
            sendExamActionRequest('start');
        } else {
            alert('Exam has already started.');
        }
    }

    // Sends action requests to the backend (start, checkexamuserprogress)
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

        const url = action === 'checkexamuserprogress' ? 'https://sb1.guidem.ph/checkexamuserprogress' : `https://sb1.guidem.ph/${action}-exam`;

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                console.log(`${action} action successful:`, response);
                if (action === 'start') {
                    examStarted = true;
                    examEndTime = new Date(response.examData.endTime);
                    updateExamTimer(); // Initialize timer
                    if (!examTimerInterval) {
                        examTimerInterval = setInterval(updateExamTimer, 1000);
                    }
                    $('.accordion-button').prop('disabled', false); // Enable accordion on exam start
                } else if (action === 'checkexamuserprogress' && response.examData) {
                    // Handle exam progress: update timer and UI based on the response
                    examStarted = true; // Assuming examData indicates the exam is ongoing
                    examEndTime = new Date(response.examData.endTime);
                    updateExamTimer(); // Update timer based on ongoing exam status
                    if (!examTimerInterval) {
                        examTimerInterval = setInterval(updateExamTimer, 1000);
                    }
                    $('.accordion-button').prop('disabled', false); // Enable accordion if exam is ongoing
                }
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                // Handle start exam failure more gracefully
                if (action === 'checkexamuserprogress') {
                    // If checking exam progress fails, allow starting the exam
                    // This is useful when the page is loaded for the first time
                    examStarted = false;
                    $('.btn-start-exam').prop('disabled', false); // Ensure start button is enabled
                    resetAndDisableAccordion(); // Keep accordion disabled until exam starts
                } else {
                    alert(`Failed to ${action} the exam. Please try again.`);
                }
            }
        });
    }

    // Updates the exam countdown timer
    function updateExamTimer() {
        var now = Date.now();
        if (examEndTime) { // Ensure examEndTime is defined
            var timeLeft = examEndTime.getTime() - now;

            if (timeLeft <= 0) {
                clearInterval(examTimerInterval);
                alert('Exam time has expired!');
                examStarted = false;
                resetAndDisableAccordion(); // Reset and disable accordion after exam ends
            } else {
                var hours = Math.floor(timeLeft / (1000 * 60 * 60));
                var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                $('#examTimer').text(`${hours < 10 ? '0' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`);
            }
        }
    }

    // Initial setup
    resetAndDisableAccordion(); // Ensures accordion is reset and disabled on load
    sendExamActionRequest('checkexamuserprogress'); // Checks exam progress initially

    // Event listener for the start exam button
    $(document).on('click', '.btn-start-exam', startExam);
});
