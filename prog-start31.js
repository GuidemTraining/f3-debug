$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var examTimerInterval;
    var examEndTime;
    var examStartTime;

    // Function to reset the accordion to its default state
    function resetAccordion() {
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'The exam session is not active or has ended');
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");

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
                    // Parse endTime as a Date object
                    examStartTime = new Date(response.startTime);
                    examEndTime = new Date(response.endTime);
                    // Call the refreshUI function to refresh components
                    refreshUI();
                    // Initialize and start the exam timer
                    updateExamTimer();
                    examTimerInterval = setInterval(updateExamTimer, 1000); // Update timer every second
                }
                updateButtonStates(); // Reflect the new state in the UI

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
        var timeLeft = examEndTime - now;

        if (timeLeft <= 0) {
            clearInterval(examTimerInterval);
            alert('Exam time has expired!');
            examStarted = false;
            updateButtonStates();
        } else {
            var hours = Math.floor(timeLeft / (1000 * 60 * 60)); // Convert milliseconds to hours
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining milliseconds to minutes

            // Update the examTimer element with the remaining hours and minutes
            $('#examTimer').text(hours + "h " + minutes + "m");
        }
    }

    // Update UI elements based on the current state
    function updateButtonStates() {
        $('.btn-start-exam').prop('disabled', examStarted);
    }

    // Event listener for the start exam button
    $(document).on('click', '.btn-start-exam', startExam);

    // Function to fetch the exam end time from the server
    function fetchExamEndTime() {
        var requestData = {
            userId: userId,
            courseId: courseId,
            lessonId: lessonId
        };

        $.ajax({
            url: 'https://sb1.guidem.ph/checkexamuserprogress', // Update with your server endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                if (response.endTime) {
                    // Parse the startTime and endTime values into Date objects
                    examStartTime = new Date(response.startTime);
                    examEndTime = new Date(response.endTime);
                    // Call the refreshUI function to refresh components
                    refreshUI();
                    // Initialize and start the exam timer
                    updateExamTimer();
                    examTimerInterval = setInterval(updateExamTimer, 1000); // Update timer every second
                } else {
                    alert('Exam end time not available. Please try again later.');
                }
            },
            error: function (xhr, status, error) {
                console.error('Failed to fetch exam end time:', error);
                alert('Failed to fetch exam end time. Please try again.');
            }
        });
    }

    // Function to refresh UI components
    function refreshUI() {
        updateButtonStates();
        resetAccordion();
    }

    // Hook into CoursePlayerV2 for dynamic content changes
    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            courseName = data.course.name;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userFirstName = data.user.firstName; // Assuming 'firstName' is the correct property
            console.log("Course data loaded:", courseId, courseName, lessonId, userId, userFirstName);
        });
    }

    // Disable accordion by default
    resetAccordion();

    fetchExamEndTime(); // Fetch the exam end time when the page loads
});
