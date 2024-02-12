$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var examEnded = false;
    var examTimerInterval;
    var examEndTime;
    var examBaseSchedule;

    disableUIComponents();

    function disableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'The exam session is not active or has ended');
        $('.btn-start-exam').prop('disabled', true).css('opacity', '0.5').text('Exam Ended');
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

    function showModalNotification(message) {
        $('#examNotificationText').text(message);
        var examNotificationModal = new bootstrap.Modal(document.getElementById('examNotificationModal'));
        examNotificationModal.show();
    }

    function startExam() {
        if (!examStarted && !examEnded) {
            examStarted = true;
            sendExamActionRequest('start');
        } else if (examEnded) {
            showModalNotification('The exam has ended and cannot be restarted.');
        } else {
            showModalNotification('An exam is already in progress.');
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
                if (action === 'checkexamuserprogress') {
                    handleCheckExamUserProgress(response);
                } else if (action === 'start' && response.examSessionActive === "yes") {
                    handleStartExam(response);
                } else {
                    disableUIComponents();
                }
            },
            error: function () {
                disableUIComponents();
            }
        });
    }

    function handleCheckExamUserProgress(response) {
        if (response.examBaseSchedule) {
            examBaseSchedule = new Date(response.examBaseSchedule);
            const now = new Date();
            if (now >= examBaseSchedule || response.examSessionActive === "yes") {
                if (response.examSessionActive === "yes") {
                    handleActiveSession(response);
                } else {
                    startExam();
                }
            } else {
                showModalNotification('The exam is scheduled to start at: ' + examBaseSchedule.toLocaleString());
                disableUIComponents();
            }
        } else {
            disableUIComponents();
        }
    }

    function handleActiveSession(response) {
        examStarted = true;
        $('.btn-start-exam').prop('disabled', true).css({'opacity': '1', 'color': 'white'}).text('Exam in Progress');
        if (response.endTime) {
            examEndTime = new Date(response.endTime);
            updateExamTimer();
            enableUIComponents();
            if (!examTimerInterval) {
                examTimerInterval = setInterval(updateExamTimer, 1000);
            }
        } else {
            disableUIComponents();
        }
    }

    function handleStartExam(response) {
        if (response.examSessionActive === "yes") {
            examStarted = true;
            $('.btn-start-exam').prop('disabled', true).css({'opacity': '1', 'color': 'white'}).text('Exam in Progress');
            if (response.endTime) {
                examEndTime = new Date(response.endTime);
                updateExamTimer();
                enableUIComponents();
                if (!examTimerInterval) {
                    examTimerInterval = setInterval(updateExamTimer, 1000);
                }
            } else {
                disableUIComponents();
            }
        } else {
            disableUIComponents();
        }
    }

    function updateExamTimer() {
        if (!examEndTime || isNaN(examEndTime.getTime())) {
            $('#examTimer').text("00h 00m");
            return;
        }
        const now = new Date().getTime();
        const timeLeft = examEndTime.getTime() - now;
        if (timeLeft <= 0) {
            clearInterval(examTimerInterval);
            examStarted = false;
            examEnded = true;
            $('#examTimer').text("Exam Ended");
            disableUIComponents();
        } else {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            $('#examTimer').text(`${hours < 10 ? '0' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`);
        }
    }

    if (typeof CoursePlayerV2 !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            courseName = data.course.name;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userFirstName = data.user.firstName;
            sendExamActionRequest('checkexamuserprogress');
        });
    }

    $(document).on('click', '.btn-start-exam', startExam);
});
