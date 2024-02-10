$(document).ready(function () {
    // Declare all global variables
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false, revertCount = 2, rebootCount = 3;
    var examTimerInterval, examEndTime, examStartTime;

    // Disable accordion elements initially
    $('.accordion-button').prop('disabled', true);

    // Hook into CoursePlayerV2 for dynamic content changes
    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            courseName = data.course.name;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userFirstName = data.user.firstName;
            console.log("Course data loaded:", courseId, courseName, lessonId, userId, userFirstName);
        });
    }

    // Define the generateNonce function for security purposes
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

    // Function to send action requests to the backend (start, revert, reboot)
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
            url: `https://sb1.guidem.ph/${action}-exam`, // Update with your server endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                console.log(`${action} action successful:`, response);
                if (action === 'start') {
                    examStarted = true;
                    examEndTime = new Date(response.examData.endTime);
                    examStartTime = new Date(response.examData.startTime);
                    updateExamTimer();
                    examTimerInterval = setInterval(updateExamTimer, 1000);
                    // Enable accordion elements
                    $('.accordion-button').prop('disabled', false);
                }
                updateButtonStates();
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                alert(`Failed to ${action} the exam. Please try again.`);
            }
        });
    }

    // Timer function to update the exam countdown
    function updateExamTimer() {
        var now = new Date().getTime();
        var timeLeft = examEndTime.getTime() - now;

        if (timeLeft <= 0) {
            clearInterval(examTimerInterval);
            alert('Exam time has expired!');
            examStarted = false;
            updateButtonStates();
        } else {
            var hours = Math.floor((timeLeft / (1000 * 60 * 60)));
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            $('#examTimer').text(hours + "h " + minutes + "m");
        }
    }

    // Update UI elements based on the current state
    function updateButtonStates() {
        $('.btn-start-exam').prop('disabled', examStarted);
        $('.btn-revert-exam').prop('disabled', !examStarted || revertCount <= 0);
        $('.btn-reboot-exam').prop('disabled', !examStarted || rebootCount <= 0);
    }

    // Fetch exam end time when the page loads
    function fetchExamEndTime() {
        $.ajax({
            url: 'https://sb1.guidem.ph/checkexamuserprogress', // Update with your server endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ userId: userId, courseId: courseId, lessonId: lessonId }),
            success: function (response) {
                if (response.endTime) {
                    examEndTime = new Date(response.endTime);
                    // Optionally, set examStartTime if returned and needed
                } else {
                    console.log('Exam end time not available.');
                }
            },
            error: function (xhr, status, error) {
                console.error('Failed to fetch exam end time:', error);
            }
        });
    }

    // Event listeners for the exam control buttons
    $(document).on('click', '.btn-start-exam', startExam);
    // Additional event listeners for revert and reboot would go here

    fetchExamEndTime(); // Ensure this is called after all variables are defined
});
