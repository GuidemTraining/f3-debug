$(document).ready(function () {
    var revertCount = 2;
    var rebootCount = 3;
    var examDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    var examTimer;
    var examStarted = sessionStorage.getItem('examStarted') === 'true';
    var examStartTime = parseInt(sessionStorage.getItem('examStartTime'));
    var examEndTime = parseInt(sessionStorage.getItem('examEndTime'));

    // Dynamically create the Bootstrap modal for starting the exam
    var startExamModalHTML = `
        <div class="modal fade" id="startExamModal" tabindex="-1" role="dialog" aria-labelledby="startExamModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="startExamModalLabel">Start Exam</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to start the exam?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmStartExam">Start Exam</button>
                    </div>
                </div>
            </div>
        </div>`;
    $('body').append(startExamModalHTML);

    // Call updateButtonStates initially to show the counts immediately
    updateButtonStates();

    // Handler for the Start Exam button
    $(document).on('click', '.btn-start-exam', function () {
        if (!examStarted) {
            $('#startExamModal').modal('show');
        } else {
            alert('Exam has already started.');
        }
    });

    // Handler for the Confirm Start Exam button in the modal
    $('#confirmStartExam').on('click', function () {
        startExam();
        $('#startExamModal').modal('hide');
    });

    // Function to start the exam and initialize the timer
    function startExam() {
        examStarted = true;
        var startTime = new Date().getTime();
        examStartTime = startTime;
        examEndTime = startTime + examDuration;
        sessionStorage.setItem('examStarted', 'true');
        sessionStorage.setItem('examStartTime', startTime);
        sessionStorage.setItem('examEndTime', examEndTime);
        updateButtonStates(); // Call this to update button states when the exam starts
        startTimer();
    }

    // Function to start the exam timer
    function startTimer() {
        examTimer = setInterval(function () {
            var now = new Date().getTime();
            var distance = examEndTime - now;
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the remaining time
            $('#examTimer').text(hours + "h " + minutes + "m " + seconds + "s");

            // If the countdown is over, stop the timer and end the exam
            if (distance <= 0) {
                clearInterval(examTimer);
                examEnded();
            }
        }, 1000);
    }

    // Function to update the revert and reboot button states
    function updateButtonStates() {
        $('.btn-revert-exam').text("Revert (" + revertCount + " left)").prop('disabled', !examStarted || revertCount <= 0);
        $('.btn-reboot-exam').text("Reboot (" + rebootCount + " left)").prop('disabled', !examStarted);
        if (examStarted) {
            $('.btn-start-exam').removeClass('btn-primary').addClass('btn-success').prop('disabled', true).html('<strong style="color: white;">Good Luck!</strong>');
        } else {
            $('.btn-start-exam').removeClass('btn-success').addClass('btn-primary').prop('disabled', false).text('Start Exam');
        }
    }

    // Function to execute when the exam ends
    function examEnded() {
        alert("Time's up! The exam has ended.");
        $('.btn-start-exam').removeClass('btn-success').addClass('btn-primary').prop('disabled', false).text('Start Exam');
        $('.btn-revert-exam, .btn-reboot-exam').prop('disabled', true);
        examStarted = false;
        sessionStorage.removeItem('examStarted');
        sessionStorage.removeItem('examStartTime');
        sessionStorage.removeItem('examEndTime');
    }

    // Handler for the Revert button
    $(document).on('click', '.btn-revert-exam', function () {
        var lastRevertTime = sessionStorage.getItem('lastRevertTime');
        if (revertCount > 0 && examStarted) {
            if (lastRevertTime) {
                var currentTime = new Date().getTime();
                var timeDifference = currentTime - parseInt(lastRevertTime);
                if (timeDifference < 15 * 60 * 1000) {
                    alert("You have just reverted within the last 15 minutes. Try again later.");
                    return;
                }
            }
            $('#revertModal').modal('show');
        } else {
            alert("Revert count exceeded or exam not started.");
        }
    });

    // Handler for the Confirm Revert button in the modal
    $('#confirmRevert').on('click', function () {
        var lastRevertTime = new Date().getTime();
        sessionStorage.setItem('lastRevertTime', lastRevertTime);
        revertCount--;
        updateButtonStates();
        $('#revertModal').modal('hide');
        simulateLoading('Reverting', 5000); // Simulate reverting for 5 seconds
    });

    // Handler for the Reboot button
    $(document).on('click', '.btn-reboot-exam', function () {
        if (rebootCount > 0 && examStarted) {
            $('#rebootModal').modal('show');
        } else {
            alert("Reboot count exceeded or exam not started.");
        }
    });

    // Handler for the Confirm Reboot button in the modal
    $('#confirmReboot').on('click', function () {
        rebootCount--;
        updateButtonStates();
        $('#rebootModal').modal('hide');
        simulateLoading('Rebooting', 5000); // Simulate rebooting for 5 seconds
    });

    // Function to simulate loading for an action
    function simulateLoading(action, duration) {
        // Disable the button and show loading text or icon
        var actionButton = $('.btn-' + action.toLowerCase() + '-exam');
        actionButton.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> ' + action + '...');
        setTimeout(function () {
            // Enable the button and reset text after duration
            actionButton.prop('disabled', false).text(action);
        }, duration);
    }
});
