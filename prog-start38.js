$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var revertCount = 2;
    var rebootCount = 3;
    var examTimerInterval;
    var examEndTime;
    var examStartTime; // Define examStartTime variable

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

        const url = action === 'checkExamUserProgress' ? 'https://sb1.guidem.ph/checkExamUserProgress' : `https://sb1.guidem.ph/${action}-exam`;

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
                console.log(`${action} action successful:`, response);
                if (action === 'start' || action === 'checkExamUserProgress') {
                    examStarted = true;
                    examEndTime = new Date(response.examData.endTime);
                    examStartTime = new Date(response.examData.startTime);
                    updateExamTimer(); // Initialize timer immediately
                    if (!examTimerInterval) {
                        examTimerInterval = setInterval(updateExamTimer, 1000); // Update timer every second
                    }
                    updateButtonStates(); // Reflect the new state in the UI
                }
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                alert(`Failed to ${action} the exam. Please try again.`);
            }
        });
    }

    // Adjusted event listeners to use $document for dynamic elements
    $(document).on('click', '.btn-start-exam', startExam);
    $(document).on('click', '.btn-revert-exam', function() {
        revertExam();
    });
    $(document).on('click', '.btn-reboot-exam', function() {
        rebootExam();
    });

    // Implement the revertExam and rebootExam functions as needed based on your application's logic

    // Timer function to update the exam countdown (implementation remains the same)

    // Function to check exam user progress on page load or as needed (implementation remains the same)

    // Update UI elements based on the current state (implementation remains the same)

    // Function to handle reverting and rebooting the exam (implement as needed based on your application's logic)
});
