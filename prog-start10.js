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

    // Function to refresh UI components
    function refreshUI() {
        resetAccordion(); // Reset accordion
        updateButtonStates(); // Update button states
        // Add any additional refresh actions as needed
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
                    // Parse endTime as a Date object
                    examEndTime = new Date(response.examData.endTime);
                    // Assign examStartTime when the exam starts
                    examStartTime = new Date(response.examData.startTime);
                    updateExamTimer(); // Initialize timer immediately
                    examTimerInterval = setInterval(updateExamTimer, 1000); // Update timer every second
                    // Store exam start time in local storage
                    localStorage.setItem('examStartTime', examStartTime.getTime());
                    // Call the refreshUI function to refresh components
                    refreshUI();
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

    // Load exam start time from local storage if available
    var storedExamStartTime = localStorage.getItem('examStartTime');
    if (storedExamStartTime) {
        examStartTime = new Date(parseInt(storedExamStartTime));
        var now = Date.now();
        var timeLeft = examEndTime - now;
        if (timeLeft > 0) {
            examStarted = true;
            examTimerInterval = setInterval(updateExamTimer, 1000);
        }
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

    // Define the generateNonce function for security purposes
    function generateNonce(length = 16) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Function to disable UI components
    function disableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button, .btn-start-exam').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'The exam session is not active or has ended');
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
    }

    // Function to enable UI components
    function enableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button, .btn-start-exam').prop('disabled', false).css('opacity', '');
        $('input[type="text"]').attr('placeholder', 'Submit your Answer Here ****');
        $('.accordion-button').removeClass('collapsed').attr('aria-expanded', "true");
    }

    // Function to manage the start button based on exam session
    function manageStartButtonBasedOnSession(examSessionActive) {
        if (examSessionActive === "yes") {
            $('.btn-start-exam').prop('disabled', true).css('opacity', '0.5'); // Disable if exam is active
        } else {
            $('.btn-start-exam').prop('disabled', false).css('opacity', ''); // Enable if no active exam
        }
    }

    // Function to fetch exam session status
    function fetchExamSessionStatus() {
        var requestData = {
            userId: courseData.userId,
            courseId: courseData.courseId,
            chapterId: courseData.chapterId,
            lessonId: courseData.lessonId
        };

        $.ajax({
            url: 'https://sb1.guidem.ph/checkexamuserprogress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                if (response.examSessionActive === "yes") {
                    enableUIComponents(); // Enable UI if exam is active
                } else {
                    disableUIComponents(); // Disable UI if no active exam
                }
                manageStartButtonBasedOnSession(response.examSessionActive); // Manage "Start Exam" button separately
            },
            error: function() {
                console.error('Failed to fetch exam session status');
                disableUIComponents(); // Fallback action
            }
        });
    }

    // Function to handle content change
    function onContentChange(data) {
        courseData = {
            userId: data.user.id,
            courseId: data.course.id,
            chapterId: data.chapter.id,
            lessonId: data.lesson.id
        };
        fetchExamSessionStatus(); // Check exam session status whenever content changes
    }

    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', onContentChange);
    }

    // Disable accordion by default
    disableUIComponents();

    fetchExamSessionStatus(); // Initial check for exam session status
});
