$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var examTimerInterval;
    var examEndTime;

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

    function startExam() {
        if (!examStarted) {
            sendExamActionRequest('start');
        } else {
            alert('An exam is already in progress.');
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
                console.log(`${action} action successful:`, response);
                if (response.examSessionActive === "yes") {
                    examStarted = true;
                    // Check if examEndTime is not set or invalid, then set it from the response
                    if (!examEndTime || isNaN(examEndTime.getTime())) {
                        examEndTime = new Date(response.endTime);
                    }
                    updateExamTimer();
                    if (!examTimerInterval) {
                        examTimerInterval = setInterval(updateExamTimer, 1000);
                    }
                    $('.btn-start-exam').prop('disabled', true).text('Good Luck');
                    $('.accordion-button').prop('disabled', false);
                } else if (action === 'start') {
                    // This branch is for the specific case of starting the exam
                    examEndTime = new Date(response.examData.endTime);
                } else {
                    examStarted = false;
                    $('.btn-start-exam').prop('disabled', false).text('Start Exam');
                    resetAccordion();
                }
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                alert(`Failed to ${action} the exam. Please try again.`);
                $('.btn-start-exam').prop('disabled', false).text('Start Exam');
                resetAccordion();
            }
        });
    }

    function updateExamTimer() {
        if (!examEndTime || isNaN(examEndTime.getTime())) {
            console.log("Exam end time not set or invalid.");
            $('#examTimer').text("00h 00m");
            return;
        }

        var now = new Date().getTime();
        var timeLeft = examEndTime.getTime() - now;

        if (timeLeft <= 0) {
            clearInterval(examTimerInterval);
            alert('Exam time has expired!');
            examStarted = false;
            $('.btn-start-exam').prop('disabled', false).text('Start Exam');
            resetAccordion();
            $('#examTimer').text("00h 00m");
        } else {
            var hours = Math.floor(timeLeft / (1000 * 60 * 60));
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            $('#examTimer').text(`${hours < 10 ? '0' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`);
        }
    }

    function fetchExamSessionStatus() {
        sendExamActionRequest('checkexamuserprogress');
    }

    if (typeof CoursePlayerV2 !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            courseName = data.course.name;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userFirstName = data.user.firstName;
            console.log("Course data loaded:", courseId, courseName, lessonId, userId, userFirstName);
            fetchExamSessionStatus(); // Check exam progress when content changes
        });
    }

    $(document).on('click', '.btn-start-exam', startExam);

    fetchExamSessionStatus();
});
