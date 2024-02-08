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

    // Dynamically create the Bootstrap modal for rebooting the machines
    var rebootModalHTML = `
        <div class="modal fade" id="rebootModal" tabindex="-1" role="dialog" aria-labelledby="rebootModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="rebootModalLabel">Reboot Machines</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Rebooting the machines in the exam environment would take around 15-30 minutes.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmReboot">Reboot</button>
                    </div>
                </div>
            </div>
        </div>`;
    $('body').append(rebootModalHTML);

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
        var startExamButton = $('.btn-start-exam');
        handleAction(startExamButton, "Starting Exam", 5000); // Simulate starting exam for 5 seconds
        startExam();
        $('#startExamModal').modal('hide');
    });

    // Handler for the Revert button
    $(document).on('click', '.btn-revert-exam', function () {
        var lastRevertTime = sessionStorage.getItem('lastRevertTime');
        if (revertCount > 0 && examStarted) {
            if (lastRevertTime) {
                var currentTime = new Date().getTime();
                var timeDifference = currentTime - parseInt(lastRevertTime);
                if (timeDifference < 15 * 60 * 1000) {
                    alert("You have just reverted within the last 15 minutes. Please try again later.");
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
        var revertButton = $('.btn-revert-exam');
        handleAction(revertButton, "Reverting", 5000); // Simulate reverting for 5 seconds
        revertCount--;
        updateButtonStates();
        $('#revertModal').modal('hide');
        sessionStorage.setItem('lastRevertTime', new Date().getTime());
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
        var rebootButton = $('.btn-reboot-exam');
        handleAction(rebootButton, "Rebooting", 5000); // Simulate rebooting for 5 seconds
        rebootCount--;
        updateButtonStates();
        $('#rebootModal').modal('hide');
    });

    // Common function to handle an action (Start Exam/Revert/Reboot)
    function handleAction(button, action, duration) {
        // Simulate action by logging to console
        console.log(action + "...");
        
        // Disable the button and show spinner icon
        button.prop('disabled', true);
        button.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ' + action + '...');
        
        setTimeout(function () {
            console.log(action + " completed.");
            
            // Enable the button after completion
            button.prop('disabled', false);
            updateButtonStates();
        }, duration);
    }

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
});
