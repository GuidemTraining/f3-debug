$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var examTimerInterval;
    var examEndTime;

    function resetAndDisableAccordion() {
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false").prop('disabled', true);
    }

    function generateNonce(length = 16) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function startExam() {
        if (!examStarted) {
            sendExamActionRequest('start');
        } else {
            alert('Exam has already started.');
        }
    }

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
            url: 'https://sb1.guidem.ph/checkexamuserprogress', // Use the same endpoint for simplicity
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                if (response.examData && response.examData.hasStarted) {
                    examStarted = true;
                    examEndTime = new Date(response.examData.endTime);
                    updateExamTimer();
                    $('.btn-start-exam').prop('disabled', true);
                    $('.accordion-button').prop('disabled', false);
                } else {
                    $('.btn-start-exam').prop('disabled', false);
                    resetAndDisableAccordion();
                }
            },
            error: function (xhr, status, error) {
                $('.btn-start-exam').prop('disabled', false);
                resetAndDisableAccordion();
            }
        });
    }

    function updateExamTimer() {
        var now = Date.now();
        if (examEndTime) {
            var timeLeft = examEndTime.getTime() - now;

            if (timeLeft <= 0) {
                clearInterval(examTimerInterval);
                alert('Exam time has expired!');
                examStarted = false;
                resetAndDisableAccordion();
            } else {
                var hours = Math.floor(timeLeft / (1000 * 60 * 60));
                var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                $('#examTimer').text(`${hours < 10 ? '0' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`);
            }
        }
    }

    // Fetches the current exam session status
    function fetchExamSessionStatus() {
        sendExamActionRequest('checkexamuserprogress');
    }

    // Initial setup and checks
    resetAndDisableAccordion();
    fetchExamSessionStatus(); // Check exam status on page load

    // Event listeners
    $(document).on('click', '.btn-start-exam', startExam);

    // Additional setup like CoursePlayerV2 hooks, if necessary
});
