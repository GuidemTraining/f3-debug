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
                    updateExamTimer();
                    if (!examTimerInterval) {
                        examTimerInterval = setInterval(updateExamTimer, 1000);
                    }
                    $('.btn-start-exam').prop('disabled', true).text('Good Luck');
                    $('.accordion-button').prop('disabled', false);
                } else if (action === 'checkexamuserprogress') {
                    if (response.examData && response.examData.hasStarted === "yes") {
                        examStarted = true;
                        examEndTime = new Date(response.examData.endTime);
                        updateExamTimer();
                        if (!examTimerInterval) {
                            examTimerInterval = setInterval(updateExamTimer, 1000);
                        }
                        $('.btn-start-exam').prop('disabled', true).text('Good Luck');
                        $('.accordion-button').prop('disabled', false);
                    } else {
                        $('.btn-start-exam').prop('disabled', false).text('Start Exam');
                        resetAccordion();
                    }
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
        if (!examEndTime) {
            console.log("Exam end time not set.");
            return;
        }
        var now = Date.now();
        var timeLeft = examEndTime.getTime() - now;

        if (timeLeft <= 0) {
            clearInterval(examTimerInterval);
            alert('Exam time has expired!');
            examStarted = false;
            $('.btn-start-exam').prop('disabled', false).text('Start Exam');
            resetAccordion();
        } else {
            var hours = Math.floor(timeLeft / (1000 * 60 * 60));
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            $('#examTimer').text(`${hours < 10 ? '0' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`);
        }
    }

    // Hook into CoursePlayerV2 for dynamic content changes
    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            courseName = data.course.name;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userFirstName = data.user.firstName;
            console.log("Course data loaded:", courseId, courseName, lessonId, userId, userFirstName);
            sendExamActionRequest('checkexamuserprogress'); // Check exam progress when content changes
        });
    }

    // Event listener for the start exam button
    $(document).on('click', '.btn-start-exam', startExam);

    // Initial check for exam progress
    sendExamActionRequest('checkexamuserprogress');
});
