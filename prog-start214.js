$(document).ready(function () {
    var courseId, chapterId, lessonId, userId, userFirstName;
    var labStarted = false;
    var labTimerInterval;
    var labEndTime;
    var labEnded = false;
    disableUIComponents();



    function resetAccordion() {
        $('.guidem-master-container .accordion-collapse').removeClass('show');
        $('.guidem-master-container .accordion-button').addClass('collapsed').attr('aria-expanded', "false");
    }

    function disableUIComponents() {
        $('.guidem-master-container .guidem-button, .guidem-master-container input[type="text"], .guidem-master-container .accordion-button')
    .prop('disabled', true).css('opacity', '0.5');
        $('.guidem-master-container  .guidem-lab input[type="text"]').attr('placeholder', `${userFirstName} your lab session is not valid or has ended`);
        $('.guidem-master-container .accordion-collapse').removeClass('show');
        $('.guidem-master-container .accordion-button').addClass('collapsed').attr('aria-expanded', "false");
        $('.guidem-master-container .btn-start-lab').prop('disabled', false).css('opacity', '');
    }


    function enableUIComponents() {
        $('#accordionguidem .accordion-button').css({
        'pointer-events': 'auto',
        'opacity': '1', 
        'user-select': 'auto' 
        });
        $('.guidem-master-container .guidem-button, .guidem-master-container input[type="text"], .accordion-button').prop('disabled', false).css('opacity', '');
        $('.guidem-master-container input[type="text"]').attr('placeholder', `${userFirstName} please submit your Answer Here ****`);
        $('.guidem-master-container .overlay').remove();
    }
    function markCompletedQuestionsAsFinal() {
        $('.guidem-form').each(function() {
            var $form = $(this);
            var isCompleted = $form.find('.guidem-button').text() === 'Completed';

            if (isCompleted) {
                // Disable input fields within the form marked as completed
                $form.find('input[type="text"]').prop('disabled', true)
                    .attr('placeholder', `Congratulations ${userFirstName}! You have completed this! Grit & Grind`)
                    .css({'color': 'silver', 'border': '1px solid rgba(40, 167, 69, 0.5)'});

                // Optionally, further style the button to indicate completion
                $form.find('.guidem-button').css({
                    'background-color': '#218838', // Green, adjust color as needed
                    'color': 'white'
                });

                // Disable any other interactive elements as needed
                $form.find('.guidem-hint-button').prop('disabled', true)
                    .css('background-color', '#3e4242'); // Adjust color as needed
            }
        });
    }


    function generateNonce(length = 16) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    function showNotificationModal(title, message,userFirstName) {
        $('#notificationModalLabel').text(title); // Set the title
        $('#notificationModalBody').text(message); // Set the message
		console.log(userFirstName);
        var notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
        notificationModal.show();
    }
    function endlab() {
        // Send request to end the lab session
        sendlabActionRequest('end');
    }
    function startlab() {
        if (labEnded) {
            // Optionally, show a message indicating the lab cannot be restarted
            $('.btn-start-lab').prop('disabled', true).css({'opacity': '1', 'color': 'white','background-color': '#6c757d'}).text('lab Ended');
            showNotificationModal('lab Ended', `GG! ${userFirstName} The lab duration has concluded. Please submit your report within 24 hours.`);
            $('#labTimer').text(`GG ${userFirstName}`);
            return; 
        }

        // If lab is already started, end the previous lab
        if (labStarted) {
            endlab(); // Call function to end the previous lab
        }

        // Start the new lab
        sendlabActionRequest('start');
    }


    function sendlabActionRequest(action) {
        const nonce = generateNonce();
        const requestData = {
            courseId: courseId,
            chapterId: chapterId,
            lessonId: lessonId,
            userId: userId,
            userFirstName: userFirstName,
            action: action,
            nonce: nonce,
            timestamp: Date.now()
        };


        const url = action === 'progress' ? 'https://sb1.guidem.ph/progress' : `https://sb1.guidem.ph/${action}`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
            credentials: 'include' // Ensure cookies are sent with the request
        })
        .then(response => response.json()) // Assuming the server responds with JSON
        .then(response => {
            console.log(`${action} action successful:`, response);
            if (action === 'start' && response.labSessionStatus === "yes") {
                handleStartlab(response);
                markCompletedQuestionsAsFinal();
            } else if (action === 'progress' && response.labSessionStatus === "yes") {
                handleActiveSession(response);
                markCompletedQuestionsAsFinal();
            } else if (response.labSessionStatus === "ended") {
                // Handle the 'ended' state here
                labEnded = true;
                disableUIComponents();
                $('.btn-start-lab').prop('disabled', true).css({
                    'opacity': '0.5', 
                    'color': 'white', 
                    'background-color': '#6c757d'
                }).text('Lab Ended');
                showNotificationModal('Lab Ended', `Hi ${userFirstName} your lab has ended. Please submit your report.`);
                $('#labTimer').text(`GG ${userFirstName}`);
            } else {
                console.log("No active lab session or user hasn't started a lab yet.");
                disableUIComponents();
            }
        })
        .catch(error => {
            console.error(`${action} action failed:`, error);
            disableUIComponents();
        });

    }
    function completedQuestions(questionId) {
        // Disable UI components based on the question ID
        $('.guidem-form').each(function() {
            var $form = $(this);
            var formQuestionId = $form.data('question-id').toString();
            if (formQuestionId === questionId) {
                // Disable UI components for this question
                $form.find('input[type="text"]').prop('disabled', true)
                    .attr('placeholder', `${userFirstName}, You already completed this. Grit & Grind!`)
                    .attr('style', 'color: silver !important; border: 1px solid rgba(40, 167, 69, 0.5) !important;');
                $form.find('.guidem-button').text('Completed')
                    .css({'background-color': '#218838 !important', 'color': 'white !important'})
                    .prop('disabled', true);
                $form.find('.guidem-hint-button')
                    .css('background-color', '#3e4242 !important')
                    .prop('disabled', true);
                console.log('Current questionId:', questionId);
                $('#node-' + questionId).removeClass('locked').addClass('unlocked');

            }
        });
    }

    function handleActiveSession(response) {
        if (response.labSessionStatus === "ended") {
            labEnded = true;
            labStarted = false; // Ensure consistency in state
            disableUIComponents(); // Disable UI components as the lab has ended
            // Update the "Start lab" button to indicate the lab has ended
            $('.btn-start-lab').prop('disabled', true).css({
                'opacity': '0.8', 
                'color': 'white', 
                'background-color': '#6c757d'
            }).text('lab Ended');
            showNotificationModal('lab Ended', `Hi ${userFirstName} your lab has ended. Please submit your report.`);
        } else if (response.labSessionStatus === "yes") {
            labStarted = true;
            $('.btn-start-lab').prop('disabled', true).css({'opacity': '1', 'color': 'white'}).text('Lab in Progress');
            $('.timer-container').removeClass('disabled');
            markCompletedQuestionsAsFinal();
            if (response.endTime) {
                labEndTime = new Date(response.endTime);
                updatelabTimer();
                if (response.completedItems && response.completedItems.length > 0) {
                    response.completedItems.forEach(questionId => {
                        $('#node-' + questionId).removeClass('locked').addClass('unlocked');
                        completedQuestions(questionId); // Disable UI components for completed questions
                    });
                }
                if (!labTimerInterval) {
                    labTimerInterval = setInterval(updatelabTimer, 1000);
                }
            } else {
                disableUIComponents();
            }
        } else {
            // Handle case for lab not started or other states
            disableUIComponents();
            $('.btn-start-lab').prop('disabled', false).css('opacity', '');
            console.log("No active lab session or user hasn't started an lab yet.");
        }
    }

function notifyLastFiveMinutes() {
    const currentTime = new Date();
    const remainingTimeInMinutes = (labEndTime - currentTime) / 1000 / 60;
    if (remainingTimeInMinutes <= 5) {
		showNotificationModal('lab is ending soon!', 'Only 5 minutes remaining in the lab. Please submit your flags');
    }
}
function updateUsername(userFirstName) {
    var usernameElement = document.querySelector('.username');
    if (usernameElement && userFirstName) {
        usernameElement.textContent = userFirstName;
    } else if (usernameElement && !userFirstName) {
        console.log("User first name is not available. Username not updated.");
    }
}


function handleStartlab(response) {
    if (response.message === "Lab started successfully" && response.labSessionStatus === "yes") {
        labStarted = true;
        $('.btn-start-lab').prop('disabled', true).css({ 'opacity': '1', 'color': 'black', 'background': 'mediumaquamarine', 'border-radius': '8px' }).text('🔓 Unlocked');
        $('.timer-container').removeClass('disabled');
        if (response.endtime) {
            const parsedEndTime = new Date(response.endtime);
            if (!isNaN(parsedEndTime.getTime()) && parsedEndTime > new Date()) {
                labEndTime = parsedEndTime;
                updatelabTimer();
                if (!labTimerInterval) {
                    labTimerInterval = setInterval(updatelabTimer, 1000);
                }
                enableUIComponents();
            } else {
                console.error('Parsed labEndTime is invalid or already passed.');
                alert('There was an issue with the lab timing. Please contact support.');
                disableUIComponents();
            }
        } else {
            // If endtime is null, update the labTimer with a custom message
            $('#labTimer').text(`Good Luck ${userFirstName}!`);
            $('#username').text(`${userFirstName}`);
            $('#node-0').removeClass('locked').addClass('unlocked');

            enableUIComponents();
        }
    } else if (response.labSessionStatus === "ended") {
        labEnded = true;
        labStarted = false; // Ensure consistency in state
        disableUIComponents(); // Disable UI components as the lab has ended
        // Update the "Start lab" button to indicate the lab has ended
        $('.btn-start-lab').prop('disabled', true).css({
            'opacity': '0.5',
            'color': 'white',
            'background-color': '#6c757d'
        }).text('Lab Ended');
        showNotificationModal('Lab Ended', `Hi ${userFirstName} your lab has ended. Please submit your report.`);
        $('#labTimer').text(`GG ${userFirstName}`);
    } else {
        console.error('Failed to retrieve lab end time from the server response.');
        alert('There was an error initializing the lab timer. Please contact support.');
        disableUIComponents();
    }
}
    function updatelabTimer() {
        if (!labEndTime || isNaN(labEndTime.getTime())) {
            console.log("lab end time not set or invalid.");
            $('#labTimer').text("00h 00m");
            return;
        }

        const now = new Date().getTime();
        const timeLeft = labEndTime.getTime() - now;

        if (timeLeft <= 0) {
            clearInterval(labTimerInterval);
            labStarted = false;
            labEnded = true;
            showNotificationModal('lab Ended', `Hi ${userFirstName} your lab has ended. Please submit your report.`);
            disableUIComponents();
            $('.btn-start-lab').prop('disabled', true).css({
			      'opacity': '0.5', 
			      'color': 'white', 
			      'background-color': '#6c757d'
		        }).text('lab Ended');
            resetAccordion();
        } else {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            $('#labTimer').text(`${hours < 10 ? '0' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`);
        }
    }

    function fetchlabSessionStatus() {
        sendlabActionRequest('progress');
    }

    if (typeof CoursePlayerV2 !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            chapterId = data.chapter.id;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userFirstName = data.user.first_name;
            fetchlabSessionStatus();
        });
    }

    $(document).on('click', '.btn-start-lab', startlab);
});


