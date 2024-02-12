$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var examTimerInterval;
    var examEndTime;
    var examEnded = false;

    disableUIComponents();
    fetchExamSessionStatus(); // Initial status check

    function disableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'The exam session is not active or has ended');
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
        $('.btn-start-exam').css('opacity', '0.5').prop('disabled', true);
    }

    function enableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', false).css('opacity', '');
        $('input[type="text"]').attr('placeholder', 'Submit your Answer Here ****');
        $('.overlay').remove();
    }

    function resetAccordion() {
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
    }

    function generateNonce(length = 16) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function showNotificationModal(title, message) {
        $('#notificationModalLabel').text(title);
        $('#notificationModalBody').text(message);
        var notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
        notificationModal.show();
    }

    function startExam() {
        if (examEnded) {
            showNotificationModal('Exam Ended', 'The exam has already ended and cannot be restarted.');
            return;
        }
        if (!examStarted) {
            sendExamActionRequest('start');
        } else {
            showNotificationModal('Notice', 'An exam is already in progress.');
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

        const url = action === 'checkexamuserprogress' ? 'https://sb1.guidem.ph/checkexamuserprogress' : `https://sb1.guidem.ph/${action}-exam`;

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                if (action === 'start' && response.examSessionActive === "yes") {
                    handleStartExam(response);
                } else if (action === 'checkexamuserprogress') {
                    handleActiveSession(response);
                } else {
                    disableUIComponents();
                    console.log("No active exam session or user hasn't started an exam yet.");
                }
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                disableUIComponents();
            }
        });
    }

    function handleActiveSession(response) {
        if (response.examSessionActive === "ended") {
            examEnded = true;
            disableUIComponents();
            showNotificationModal('Exam Ended', 'The exam has ended. Please submit your report.');
        } else if (response.examSessionActive === "yes") {
            examStarted = true;
            enableUIComponents();
            $('.btn-start-exam').prop('disabled', true).css({'opacity': '1', 'color': 'white'}).text('Exam in Progress');
            if (response.endTime) {
                examEndTime = new Date(response.endTime);
                updateExamTimer();
            }
        } else {
            disableUIComponents();
        }
    }

    function handleStartExam(response) {
        examStarted = true;
        enableUIComponents();
        $('.btn-start-exam').prop('disabled', true).css({'opacity': '1', 'color': 'white'}).text('Exam in Progress');
        examEndTime = new Date(response.endTime);
        updateExamTimer();
    }

    function updateExamTimer() {
        if (!examEndTime || isNaN(examEndTime.getTime())) {
            console.log("Exam end time not set or invalid.");
            return;
        }
        const now = new Date().getTime();
        const timeLeft = examEndTime.getTime() - now;

        if (timeLeft <= 0) {
            clearInterval(examTimerInterval);
            examStarted = false;
            examEnded = true;
            disableUIComponents();
            $('.btn-start-exam').text('Exam Ended');
            showNotificationModal('Exam Ended', 'The exam time has expired!');
        } else {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            $('#examTimer').text(`${hours < 10 ? '0' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`);
            if (!examTimerInterval) {
                examTimerInterval = setInterval(updateExamTimer, 1000);
            }
        }
    }

    if (typeof CoursePlayerV2 !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            courseName = data.course.name;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userFirstName = data.user.firstName;
            fetchExamSessionStatus();
        });
    }

    $(document).on('click', '.btn-start-exam', startExam);
});
