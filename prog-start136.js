$(document).ready(function () {
    var courseId, courseName, lessonId, userId, userFirstName;
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

    function startlab() {
    if (labEnded) {
        // Optionally, show a message indicating the lab cannot be restarted
        $('.btn-start-lab').prop('disabled', true).css({'opacity': '1', 'color': 'white','background-color': '#6c757d'}).text('lab Ended');
        showNotificationModal('lab Ended', `GG! ${userFirstName} The lab duration has concluded. Please submit your report within 24 hours.`);
        $('#labTimer').text(`GG ${userFirstName}`);
        return; 
    }
    if (!labStarted) {
        sendlabActionRequest('start');
    } else {
        alert('An lab is already in progress.');
    }
}

    function sendlabActionRequest(action) {
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

        const url = action === 'progress' ? 'https://sb1.guidem.ph/progress' : `https://sb1.guidem.ph/${action}-lab`;

$.ajax({
	url: url,
	type: 'POST',
	contentType: 'application/json',
	data: JSON.stringify(requestData),
	success: function (response) {
		console.log(`${action} action successful:`, response);
		if (action === 'start' && response.LabSessionActive === "yes") {
			handleStartlab(response);
		} else if (action === 'progress' && response.LabSessionActive === "yes") {
			handleActiveSession(response);
		} else if (response.LabSessionActive === "ended") {
			// Handle the 'ended' state here
			labEnded = true;
			disableUIComponents();
			$('.btn-start-lab').prop('disabled', true).css({
				'opacity': '0.5', 
				'color': 'white', 
				'background-color': '#6c757d'
			}).text('lab Ended');
			showNotificationModal('lab Ended', `Hi ${userFirstName} your lab has ended. Please submit your report.`);
      $('#labTimer').text(`GG ${userFirstName}`);
		} else {
			console.log("No active lab session or user hasn't started an lab yet.");
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
		if (response.LabSessionActive === "ended") {
			labEnded = true;
			labStarted = false; // Ensure consistency in state
			disableUIComponents(); // Disable UI components as the lab has ended
			// Update the "Start lab" button to indicate the lab has ended
			$('.btn-start-lab').prop('disabled', true).css({
				'opacity': '0.5', 
				'color': 'white', 
				'background-color': '#6c757d'
			}).text('lab Ended');
			showNotificationModal('lab Ended', `Hi ${userFirstName} your lab has ended. Please submit your report.`);
		} else if (response.LabSessionActive === "yes") {
			labStarted = true;
			$('.btn-start-lab').prop('disabled', true).css({'opacity': '1', 'color': 'white'}).text('lab in Progress');
			$('.timer-container').removeClass('disabled');
			if (response.endTime) {
				labEndTime = new Date(response.endTime);
				updatelabTimer();
				enableUIComponents();
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
function handleStartlab(response) {
	if (response.message === "lab data updated successfully" && response.LabSessionActive === "yes") {
		labStarted = true;
		$('.btn-start-lab').prop('disabled', true).css({'opacity': '1', 'color': 'white'}).text('lab in Progress');
		$('.timer-container').removeClass('disabled');
		const labDetails = response.userLabData.currentlab.find(lab => lab.courseId === courseId);
		if (labDetails && labDetails.endTime) {
			const parsedEndTime = new Date(labDetails.endTime);
			if (!isNaN(parsedEndTime.getTime()) && parsedEndTime > new Date()) {
				labEndTime = parsedEndTime;
				updatelabTimer(); 
				if (!labTimerInterval) {
					labTimerInterval = setInterval(updatelabTimer, 1000);
				}
				enableUIComponents();
				showNotificationModal(`Get Ready ${userFirstName}`,'The environment is being prepared and will be ready within 5 minutes. Please ensure to read the instructions carefully');
			} else {
				console.error('Parsed labEndTime is invalid or already passed.');
				alert('There was an issue with the lab timing. Please contact support.');
				disableUIComponents();
			}
		} else {
			console.error('Failed to retrieve lab end time from the server response.');
			alert('There was an error initializing the lab timer. Please contact support.');
			disableUIComponents();
		}
	} else if (response.LabSessionActive === "ended") {
		labEnded = true;
		labStarted = false; // Ensure consistency in state
		disableUIComponents(); // Disable UI components as the lab has ended
		// Update the "Start lab" button to indicate the lab has ended
		$('.btn-start-lab').prop('disabled', true).css({
			'opacity': '0.5', 
			'color': 'white', 
			'background-color': '#6c757d'
		}).text('lab Ended');
		showNotificationModal('lab Ended', `Hi ${userFirstName} your lab has ended. Please submit your report.`);
    $('#labTimer').text(`GG ${userFirstName}`);
	} else {
		console.log("No active lab session or user hasn't started an lab yet.");
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
            courseName = data.course.name;
            lessonId = data.lesson.id;
            userId = data.user.id;
            userFirstName = data.user.first_name;
            fetchlabSessionStatus();
        });
    }

    $(document).on('click', '.btn-start-lab', startlab);
});
