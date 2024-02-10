$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var examTimerInterval;
    var examEndTime;

    disableUIComponents();

    function resetAccordion() {
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
    }

    function disableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'The exam session is not active or has ended');
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
        $('.btn-start-exam').prop('disabled', false).css('opacity', '');
    }

    function enableUIComponents() {
        $('#accordionguidem .accordion-button').css({
        'pointer-events': 'auto',
        'opacity': '1', 
        'user-select': 'auto' 
        });
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', false).css('opacity', '');
        $('input[type="text"]').attr('placeholder', 'Submit your Answer Here ****');
        $('.overlay').remove();
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
                if (action === 'start' && response.message === "Exam started successfully") {
                    handleStartExam(response);
                } else if (response.examSessionActive === "yes") {
                    handleActiveSession(response);
                } else {
                    console.log("No active exam session or user hasn't started an exam yet.");
                    disableUIComponents();
                }
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                disableUIComponents();
            }
        });
    }

    function handleActiveSession(response) {
        examStarted = true;
        $('.btn-start-exam').prop('disabled', true).css({'opacity': '1', 'color': 'white'}).text('Exam in Progress');
        $('.timer-container').removeClass('disabled');
        if (response.endTime) {
            examEndTime = new Date(response.endTime);
        }
        updateExamTimer();
        enableUIComponents();
        if (!examTimerInterval) {
            examTimerInterval = setInterval(updateExamTimer, 1000);
        }
    }

    function handleStartExam(response) {
        examStarted = true;
        var matchedExam = null;
        if (response.userExamData && Array.isArray(response.userExamData.currentexam)) {
             matchedExam = response.userExamData.currentexam.find(exam => 
                exam.courseId === courseId && 
                exam.lessonId === lessonId && 
                response.userExamData.userId === userId);
        }
        if (matchedExam && matchedExam.endTime) {
        examEndTime = new Date(matchedExam.endTime);
        updateExamTimer();
        enableUIComponents();
        $('.overlay').remove();
        $('.btn-start-exam').prop('disabled', true).css({'opacity': '1', 'color': 'white'}).text('Exam in Progress');
        $('.timer-container').removeClass('disabled');
        if (!examTimerInterval) {
            examTimerInterval = setInterval(updateExamTimer, 1000);
        }
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
            disableUIComponents();
            $('.btn-start-exam').prop('disabled', false).text('Start Exam');
            resetAccordion();
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
            fetchExamSessionStatus();
        });
    }

    $(document).on('click', '.btn-start-exam', startExam);
});
