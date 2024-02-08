$(document).ready(function () {
    var revertCount = 2;
    var rebootCount = 3;
    var examDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    var examTimer;
    var examStarted = false;
    var examStartTime = sessionStorage.getItem('examStartTime');
    var examEndTime = sessionStorage.getItem('examEndTime');
    var lastRevertTime = sessionStorage.getItem('lastRevertTime');

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

    // Dynamically create the Bootstrap modal for reverting the exam environment
    var revertModalHTML = `
        <div class="modal fade" id="revertModal" tabindex="-1" role="dialog" aria-labelledby="revertModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="revertModalLabel">Revert Exam Environment</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Reverting the exam environment would take around 30 minutes to 1 hour.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmRevert">Revert</button>
                    </div>
                </div>
            </div>
        </div>`;
    $('body').append(revertModalHTML);

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

    // Event handler for Cancel button on the start exam modal
    $('#startExamModal .btn-secondary').on('click', function () {
        $('#startExamModal').modal('hide');
    });

    // Event handler for Close button on the start exam modal
    $('#startExamModal .close').on('click', function () {
        $('#startExamModal').modal('hide');
    });

    // Handler for the Revert button
    $(document).on('click', '.btn-revert-exam', function () {
        var currentTime = new Date().getTime();
        if (revertCount > 0 && examStarted && (!lastRevertTime || (currentTime - lastRevertTime > 900000))) { // 900000 milliseconds = 15 minutes
            $('#revertModal').modal('show');
        } else if (lastRevertTime && (currentTime - lastRevertTime <= 900000)) {
            alert("You have just reverted within the last 15 minutes. Please try again later.");
        } else {
            alert("Revert count exceeded or exam not started.");
        }
    });

    // Handler for the Confirm Revert button in the modal
    $('#confirmRevert').on('click', function () {
        handleAction("Reverting", 5000); // Simulate reverting for 5 seconds
        lastRevertTime = new Date().getTime();
        sessionStorage.setItem('lastRevertTime', lastRevertTime);
        revertCount--;
        updateButtonStates();
        $('#revertModal').modal('hide');
    });

    // Event handler for Cancel button on the revert modal
    $('#revertModal .btn-secondary').on('click', function () {
        $('#revertModal').modal('hide');
    });

    // Event handler for Close button on the revert modal
    $('#revertModal .close').on('click', function () {
        $('#revertModal').modal('hide');
    });

    // Function to start the exam and initialize the timer
    function startExam() {
        examStarted = true;
        examStartTime = new Date().getTime();
        var endTime = examStartTime + examDuration;
        examEndTime = endTime;
        sessionStorage.setItem('examStartTime', examStartTime);
        sessionStorage.setItem('examEndTime', examEndTime);
        updateButtonStates(); // Call this to update button states when the exam starts
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
        sessionStorage.removeItem('examStartTime');
        sessionStorage.removeItem('examEndTime');
    }

    // Common function to handle an action (Revert/Reboot)
    function handleAction(action, duration) {
        // Simulate action by logging to console
        console.log(action + "...");
        // Disable the button clicked and other relevant buttons
        var clickedButton = $('.btn-' + action.toLowerCase() + '-exam');
        clickedButton.prop('disabled', true).text(action + '...');

        setTimeout(function () {
            console.log(action + " completed.");
            // Enable the button clicked after completion
            clickedButton.prop('disabled', false).text(action);
        }, duration);
    }
});
