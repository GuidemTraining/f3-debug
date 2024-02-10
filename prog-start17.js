$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var revertCount = 2;
    var rebootCount = 3;
    var examTimerInterval;
    var examEndTime;
    var examStartTime;

    // Function to reset the accordion to its default state
    function resetAccordion() {
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
    }

    // Function to start the exam and request exam data from the server
    function startExam() {
        if (!examStarted) {
            sendExamActionRequest('start');
            resetAccordion(); // Reset accordion when exam starts
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
                    // Parse endTime as a Date object
                    examEndTime = new Date(response.examData.endTime);
                    // Assign examStartTime when the exam starts
                    examStartTime = new Date(response.examData.startTime);
                    updateExamTimer(); // Initialize timer immediately
                    examTimerInterval = setInterval(updateExamTimer, 1000); // Update timer every second
                    // Store exam start time in local storage
                    localStorage.setItem('examStartTime', examStartTime.getTime());
                    // Enable accordions and buttons
                    enableAccordionsAndButtons();
                    // Disable the start exam button after exam has started
                    $('.btn-start-exam').prop('disabled', true);
                }
                updateButtonStates(); // Reflect the new state in the UI
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                alert(`Failed to ${action} the exam. Please try again.`);
            }
        });
    }

    // Function to enable accordions and buttons
    function enableAccordionsAndButtons() {
        $('.accordion-collapse, .accordion-button, .btn-start-exam').prop('disabled', false);
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
        $('.btn-revert-exam').text(`Revert (${revertCount} left)`).prop('disabled', !examStarted || revertCount <= 0);
        $('.btn-reboot-exam').text(`Reboot (${rebootCount} left)`).prop('disabled', !examStarted || rebootCount <= 0);
    }

    // Event listener for the start exam button
    $(document).on('click', '.btn-start-exam', startExam);

    // Load exam start time from local storage or fetch from server if not available
    var storedExamStartTime = localStorage.getItem('examStartTime');
    if (storedExamStartTime) {
        examStartTime = new Date(parseInt(storedExamStartTime));
        var now = Date.now();
        var timeLeft = examEndTime - now;
        if (timeLeft > 0) {
            examStarted = true;
            examTimerInterval = setInterval(updateExamTimer, 1000);
            // Enable accordions and buttons
            enableAccordionsAndButtons();
            // Update exam timer
            updateExamTimer();
        }
    } else {
        // Fetch exam start time from server if not available in local storage
        fetchExamStartTimeFromServer();
    }

    // Function to fetch exam start time from the server
    function fetchExamStartTimeFromServer() {
        // Implement logic to fetch exam start time from the server using checkexamuserprogress endpoint
        // Update examStartTime and examEndTime accordingly
        // Once fetched, start the exam timer if the exam has started
        // Handle errors appropriately
        var requestData = {
            userId: userId,
            courseId: courseId,
            lessonId: lessonId
        };

        $.ajax({
            url: 'https://sb1.guidem.ph/checkexamuserprogress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                if (response.examSessionActive === "yes") {
                    examStartTime = new Date(response.examStartTime);
                    examEndTime = new Date(response.examEndTime);
                    var now = Date.now();
                    var timeLeft = examEndTime - now;
                    if (timeLeft > 0) {
                        examStarted = true;
                        examTimerInterval = setInterval(updateExamTimer, 1000);
                        // Enable accordions and buttons
                        enableAccordionsAndButtons();
                        // Disable the start exam button after exam has started
                        $('.btn-start-exam').prop('disabled', true);
                        // Update exam timer
                        updateExamTimer();
                    }
                }
            },
            error: function() {
                console.error('Failed to fetch exam start time from server');
                // Handle error
            }
        });
    }
});
