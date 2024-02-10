$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var examTimerInterval;
    var examEndTime;

    // Reset accordion to its default state and disable it
    function resetAndDisableAccordion() {
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false").prop('disabled', true);
    }

    // Generate a nonce for security purposes
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

    // Send action requests to the backend (start, revert, reboot, checkexamuserprogress)
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
                if (action === 'start' || (action === 'checkexamuserprogress' && response.examData)) {
                    examStarted = true;
                    examEndTime = new Date(response.examData.endTime);
                    updateExamTimer(); // Initialize timer immediately
                    if (!examTimerInterval) {
                        examTimerInterval = setInterval(updateExamTimer, 1000); // Update timer every second
                    }
                    $('.btn-start-exam').prop('disabled', true); // Disable start button if exam is ongoing
                    $('.accordion-button').prop('disabled', false); // Enable accordion if exam has started
                }
            },
            error: function (xhr, status, error) {
                if (action === 'checkexamuserprogress') {
                    console.log('Exam has not started yet or failed to fetch progress.');
                    $('.btn-start-exam').prop('disabled', false); // Ensure start button is enabled if checking progress fails
                } else {
                    console.error(`${action} action failed:`, error);
                    alert(`Failed to ${action} the exam. Please try again.`);
                }
            }
        });
    }

    // Update the exam countdown timer
    function updateExamTimer() {
        var now = Date.now();
        var timeLeft = examEndTime.getTime() - now;

        if (timeLeft <= 0) {
            clearInterval(examTimerInterval);
            alert('Exam time has expired!');
            examStarted = false;
            $('.btn-start-exam').prop('disabled', false); // Re-enable the start button if exam has expired
            resetAndDisableAccordion(); // Reset and disable accordion again
        } else {
            var hours = Math.floor(timeLeft / (1000 * 60 * 60));
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            $('#examTimer').text(`${hours < 10 ? '0' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`);
        }
    }

    // Event listener for the start exam button
    $(document).on('click', '.btn-start-exam', startExam);

    // Initial actions
    resetAndDisableAccordion(); // Reset and disable accordion on initial load
    sendExamActionRequest('checkexamuserprogress'); // Check exam progress on page load
});
