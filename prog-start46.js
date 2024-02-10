$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var examTimerInterval;
    var examEndTime;

    // Function to reset the accordion to its default state
    function resetAccordion() {
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
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

    // Send action requests to the backend
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
                    updateExamTimer(); // Initialize timer immediately
                    examTimerInterval = setInterval(updateExamTimer, 1000); // Update timer every second
                    refreshUI(); // Refresh UI components
                } else if (action === 'checkexamuserprogress') {
                    // Logic to handle response from checkexamuserprogress
                    // This could enable/disable UI components based on the response
                    refreshUI(); // Refresh UI components based on exam progress
                }
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                alert(`Failed to ${action} the exam. Please try again.`);
            }
        });
    }

    // Timer function to update the exam countdown
    function updateExamTimer() {
        var now = Date.now();
        if (examEndTime) { // Ensure examEndTime is defined
            var timeLeft = examEndTime.getTime() - now;

            if (timeLeft <= 0) {
                clearInterval(examTimerInterval);
                alert('Exam time has expired!');
                examStarted = false;
                disableUIComponents(); // Disable UI components when exam time expires
            } else {
                var hours = Math.floor(timeLeft / (1000 * 60 * 60));
                var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                $('#examTimer').text(`${hours < 10 ? '0' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`);
            }
        }
    }

    // Refresh UI components, enable or disable based on exam state
    function refreshUI() {
        if (examStarted) {
            enableUIComponents();
        } else {
            disableUIComponents();
        }
    }

    // Disable UI components - similar to disableUIComponents() in your provided script
    function disableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'The exam session is not active or has ended');
        resetAccordion();
    }

    // Enable UI components - reverse of disableUIComponents
    function enableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', false).css('opacity', '');
        $('input[type="text"]').attr('placeholder', 'Enter your answer here...');
        // Assuming there's logic here to expand accordions or other UI elements as needed
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
