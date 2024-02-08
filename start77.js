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
                }
                updateButtonStates(); // Reflect the new state in the UI
            },
            error: function (xhr, status, error) {
                console.error(`${action} action failed:`, error);
                alert(`Failed to ${action} the exam. Please try again.`);
            }
        });
    }

    // Function to handle reverting the exam
    function revertExam() {
        if (examStarted && revertCount > 0) {
            // Check if exam started
            const currentTime = new Date();
            if (currentTime < examStartTime || currentTime > examEndTime) {
                toastr.error('Exam has not started or has ended');
                return;
            }

            // Check if at least 1 hour has passed since the exam started
            const oneHourAfterStart = new Date(examStartTime);
            oneHourAfterStart.setHours(oneHourAfterStart.getHours() + 1);
            if (currentTime < oneHourAfterStart) {
                toastr.error('Cannot revert within 1 hour after the exam started');
                return;
            }

            // Check if there is a recent revert attempt within the last hour
            if (lastRevertTime) {
                const oneHourBeforeNow = new Date(currentTime);
                oneHourBeforeNow.setHours(oneHourBeforeNow.getHours() - 1);
                if (lastRevertTime > oneHourBeforeNow) {
                    toastr.error('Cannot revert again within 1 hour after the last revert');
                    return;
                }
            }

            // Send revert action request
            sendExamActionRequest('revert');
            revertCount--;
            updateButtonStates();
        } else {
            toastr.error('Unable to revert the exam.');
        }
    }

    // Function to handle rebooting the exam
    function rebootExam() {
        if (examStarted && rebootCount > 0) {
            // Check if exam started
            const currentTime = new Date();
            if (currentTime < examStartTime || currentTime > examEndTime) {
                toastr.error('Exam has not started or has ended');
                return;
            }

            // Check if at least 1 hour has passed since the exam started
            const oneHourAfterStart = new Date(examStartTime);
            oneHourAfterStart.setHours(oneHourAfterStart.getHours() + 1);
            if (currentTime < oneHourAfterStart) {
                toastr.error('Cannot reboot within 1 hour after the exam started');
                return;
            }

            // Check if there is a recent reboot attempt within the last 30 minutes
            if (rebootAttempttime) {
                const lastRebootTime = new Date(rebootAttempttime);
                const thirtyMinutesBeforeNow = new Date(currentTime);
                thirtyMinutesBeforeNow.setMinutes(thirtyMinutesBeforeNow.getMinutes() - 30);
                if (lastRebootTime > thirtyMinutesBeforeNow) {
                    toastr.error('Cannot reboot again within 30 minutes after the last reboot');
                    return;
                }
            }

            // Send reboot action request
            sendExamActionRequest('reboot');
            rebootCount--;
            updateButtonStates();
        } else {
            toastr.error('Unable to reboot the exam.');
        }
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
    $(document).on('click', '.btn-revert-exam', revertExam);
    $(document).on('click', '.btn-reboot-exam', rebootExam);
});
