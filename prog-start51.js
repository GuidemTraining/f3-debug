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
            url: 'https://sb1.guidem.ph/checkexamuserprogress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                console.log(`${action} action successful:`, response);
                if (response.examData) {
                    if (response.examData.hasStarted === "yes") {
                        examStarted = true;
                        examEndTime = new Date(response.examData.endTime);
                        updateExamTimer(); // Initialize or update the timer
                        $('.btn-start-exam').prop('disabled', true);
                        $('.accordion-button').prop('disabled', false);
                    }
                } else {
                    $('.btn-start-exam').prop('disabled', false);
                    resetAndDisableAccordion();
                }
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                if (action === 'checkexamuserprogress') {
                    // Allow starting the exam if the progress check fails
                    $('.btn-start-exam').prop('disabled', false);
                } else {
                    alert(`Failed to ${action} the exam. Please try again.`);
                }
                resetAndDisableAccordion();
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
            $('.btn-start-exam').prop('disabled', false);
            resetAndDisableAccordion();
        } else {
            var hours = Math.floor(timeLeft / (1000 * 60 * 60));
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            $('#examTimer').text(`${hours < 10 ? '0' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`);
        }
    }

    // Function to fetch the exam session status
    function fetchExamSessionStatus() {
        sendExamActionRequest('checkexamuserprogress');
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
            fetchExamSessionStatus(); // Fetch exam session status when content changes
        });
    }

    resetAndDisableAccordion();
    fetchExamSessionStatus(); // Fetch exam session status on page load

    // Event listener for the start exam button
    $(document).on('click', '.btn-start-exam', startExam);
});
