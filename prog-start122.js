$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
    var examStarted = false;
    var examTimerInterval;
    var examEndTime;
    var examEnded = false;
    disableUIComponents();

    function resetAccordion() {
        $('.guidem-master-container .accordion-collapse').removeClass('show');
        $('.guidem-master-container .accordion-button').addClass('collapsed').attr('aria-expanded', "false");
    }

    function disableUIComponents() {
        $('.guidem-master-container .guidem-button, .guidem-master-container input[type="text"], .guidem-master-container .accordion-button')
    .prop('disabled', true).css('opacity', '0.5');
        $('.guidem-master-container  .guidem-exam input[type="text"]').attr('placeholder', 'The exam session is not active or has ended');
        $('.guidem-master-container .accordion-collapse').removeClass('show');
        $('.guidem-master-container .accordion-button').addClass('collapsed').attr('aria-expanded', "false");
        $('.guidem-master-container .btn-start-exam').prop('disabled', false).css('opacity', '');
    }


    function enableUIComponents() {
        $('#accordionguidem .accordion-button').css({
        'pointer-events': 'auto',
        'opacity': '1', 
        'user-select': 'auto' 
        });
        $('.guidem-master-container .guidem-button, .guidem-master-container input[type="text"], .accordion-button').prop('disabled', false).css('opacity', '');
        $('.guidem-master-container input[type="text"]').attr('placeholder', 'Hi ${userFirstName}, Submit your Answer Here ****');
        $('.guidem-master-container .overlay').remove();
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

    function startExam() {
    if (examEnded) {
        // Optionally, show a message indicating the exam cannot be restarted
        $('.btn-start-exam').prop('disabled', true).css({'opacity': '1', 'color': 'white','background-color': '#6c757d'}).text('Exam Ended');
        showNotificationModal('Exam Ended', 'The exam duration has concluded. Please submit your report within 24 hours.');
        return; 
    }

    if (!examStarted) {
        sendExamActionRequest('start');
    } else {
        alert('An exam is already in progress.');
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

        const url = action === 'checkexamuserprogress' ? 'https://sb1.guidem.ph/checkexamuserprogress' : `https://sb1.guidem.ph/${action}-exam`;

$.ajax({
	url: url,
	type: 'POST',
	contentType: 'application/json',
	data: JSON.stringify(requestData),
	success: function (response) {
		console.log(`${action} action successful:`, response);
		if (action === 'start' && response.examSessionActive === "yes") {
			handleStartExam(response);
		} else if (action === 'checkexamuserprogress' && response.examSessionActive === "yes") {
			handleActiveSession(response);
		} else if (response.examSessionActive === "ended") {
			// Handle the 'ended' state here
			examEnded = true;
			disableUIComponents();
			$('.btn-start-exam').prop('disabled', true).css({
				'opacity': '0.5', 
				'color': 'white', 
				'background-color': '#6c757d'
			}).text('Exam Ended');
			showNotificationModal('Exam Ended', 'The exam has ended. Please submit your report.');
		} else {
			console.log("No active exam session or user hasn't started an exam yet.");
			disableUIComponents();
		}
	},
	error: function (xhr, status, error) {
		console.error(`${action} action failed:`, error);
		disableUIComponents();
	}
});
    }

	function handleActiveSession(response) {
		if (response.examSessionActive === "ended") {
			examEnded = true;
			examStarted = false; // Ensure consistency in state
			disableUIComponents(); // Disable UI components as the exam has ended
			// Update the "Start Exam" button to indicate the exam has ended
			$('.btn-start-exam').prop('disabled', true).css({
				'opacity': '0.5', 
				'color': 'white', 
				'background-color': '#6c757d'
			}).text('Exam Ended');
			showNotificationModal('Exam Ended', 'The exam has ended. Please submit your report.');
		} else if (response.examSessionActive === "yes") {
			examStarted = true;
			$('.btn-start-exam').prop('disabled', true).css({'opacity': '1', 'color': 'white'}).text('Exam in Progress');
			$('.timer-container').removeClass('disabled');
			if (response.endTime) {
				examEndTime = new Date(response.endTime);
				updateExamTimer();
				enableUIComponents();
				if (!examTimerInterval) {
					examTimerInterval = setInterval(updateExamTimer, 1000);
				}
			} else {
				disableUIComponents();
			}
		} else {
			// Handle case for exam not started or other states
			disableUIComponents();
			$('.btn-start-exam').prop('disabled', false).css('opacity', '');
			console.log("No active exam session or user hasn't started an exam yet.");
		}
	}
function notifyLastFiveMinutes() {
    const currentTime = new Date();
    const remainingTimeInMinutes = (examEndTime - currentTime) / 1000 / 60;
    if (remainingTimeInMinutes <= 5) {
		showNotificationModal('Exam is ending soon!', 'Only 5 minutes remaining in the exam. Please submit your flags');
    }
}
function handleStartExam(response) {
	if (response.message === "Exam data updated successfully" && response.examSessionActive === "yes") {
		examStarted = true;
		$('.btn-start-exam').prop('disabled', true).css({'opacity': '1', 'color': 'white'}).text('Exam in Progress');
		$('.timer-container').removeClass('disabled');
		const examDetails = response.userExamData.currentexam[0];
		if (examDetails && examDetails.endTime) {
			const parsedEndTime = new Date(examDetails.endTime);
			if (!isNaN(parsedEndTime.getTime()) && parsedEndTime > new Date()) {
				examEndTime = parsedEndTime;
				updateExamTimer(); 
				if (!examTimerInterval) {
					examTimerInterval = setInterval(updateExamTimer, 1000);
				}
				enableUIComponents();
				showNotificationModal('Get Ready ${userFirstName}','The environment is being prepared and will be ready within 5 minutes. Please ensure to read the instructions carefully');
			} else {
				console.error('Parsed examEndTime is invalid or already passed.');
				alert('There was an issue with the exam timing. Please contact support.');
				disableUIComponents();
			}
		} else {
			console.error('Failed to retrieve exam end time from the server response.');
			alert('There was an error initializing the exam timer. Please contact support.');
			disableUIComponents();
		}
	} else if (response.examSessionActive === "ended") {
		examEnded = true;
		examStarted = false; // Ensure consistency in state
		disableUIComponents(); // Disable UI components as the exam has ended
		// Update the "Start Exam" button to indicate the exam has ended
		$('.btn-start-exam').prop('disabled', true).css({
			'opacity': '0.5', 
			'color': 'white', 
			'background-color': '#6c757d'
		}).text('Exam Ended');
		// Optionally, show a modal or message indicating the exam has ended
		showNotificationModal('Exam Ended', 'The exam has ended. Please submit your report.');
	} else {
		console.log("No active exam session or user hasn't started an exam yet.");
		// Optionally, handle this case specifically in your UI
	}
}


    function updateExamTimer() {
        if (!examEndTime || isNaN(examEndTime.getTime())) {
            console.log("Exam end time not set or invalid.");
            $('#examTimer').text("00h 00m");
            return;
        }

        const now = new Date().getTime();
        const timeLeft = examEndTime.getTime() - now;

        if (timeLeft <= 0) {
            clearInterval(examTimerInterval);
            examStarted = false;
            examEnded = true;
            alert('Exam time has expired!');
            disableUIComponents();
            $('.btn-start-exam').prop('disabled', false).text('Start Exam');
            resetAccordion();
        } else {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            $('#examTimer').text(`${hours < 10 ? '0' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`);
        }
    }

    function fetchExamSessionStatus() {
        sendExamActionRequest('checkexamuserprogress');
    }

    if (typeof CoursePlayerV2 !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            courseName = data.course.name;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userFirstName = data.user.first_name;
            fetchExamSessionStatus();
        });
    }

    $(document).on('click', '.btn-start-exam', startExam);
});
