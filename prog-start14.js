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
                    // Update UI components
                    updateUI();
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
            updateUI();
        } else {
            var hours = Math.floor(timeLeft / (1000 * 60 * 60)); // Convert milliseconds to hours
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining milliseconds to minutes

            // Update the examTimer element with the remaining hours and minutes
            $('#examTimer').text(hours + "h " + minutes + "m");
        }
    }

    // Function to update UI components based on exam state
    function updateUI() {
        if (examStarted) {
            $('.btn-start-exam').prop('disabled', true).text('Good Luck!'); // Disable and change text of Start Exam button
            $('.accordion-button, .accordion-collapse').prop('disabled', false); // Enable accordion elements
            updateExamTimer(); // Update exam timer
            examTimerInterval = setInterval(updateExamTimer, 1000); // Start timer interval
        } else {
            $('.btn-start-exam').prop('disabled', false).text('Start Exam'); // Enable and change text of Start Exam button
            $('.accordion-button, .accordion-collapse').prop('disabled', true); // Disable accordion elements
            clearInterval(examTimerInterval); // Stop timer interval
            $('#examTimer').text('00h 00m'); // Reset exam timer
        }
    }

    // Event listener for the start exam button
    $(document).on('click', '.btn-start-exam', startExam);

    // Load exam data and update UI components on page load
    function initializeExam() {
        // Load exam data from the server
        // Assuming you have a function called fetchExamData() to fetch exam data from the server
        fetchExamData().then(function(response) {
            examStarted = response.examStarted;
            examEndTime = new Date(response.examEndTime);
            updateUI(); // Update UI components based on loaded exam data
        }).catch(function(error) {
            console.error('Failed to load exam data:', error);
        });
    }

    // Function to fetch exam data from the server
    function fetchExamData() {
        return new Promise(function(resolve, reject) {
            // Make an AJAX call to fetch exam data
            $.ajax({
                url: 'https://sb1.guidem.ph/checkexamuserprogress', // Update with your server endpoint
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ userId: userId, courseId: courseId, lessonId: lessonId }),
                success: function(response) {
                    resolve(response);
                },
                error: function(xhr, status, error) {
                    reject(error);
                }
            });
        });
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
            initializeExam(); // Initialize exam data and UI components whenever content changes
        });
    } else {
        initializeExam(); // Initialize exam data and UI components if CoursePlayerV2 is not available
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
});
