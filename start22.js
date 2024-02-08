$(document).ready(function () {
    var revertCount = 2;
    var rebootCount = 3;
    var examDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    var examTimer;
    var examStarted = false;

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
        if (revertCount > 0 && examStarted) {
            $('#revertModal').modal('show');
        } else {
            alert("Revert count exceeded or exam not started.");
        }
    });

    // Handler for the Confirm Revert button in the modal
    $('#confirmRevert').on('click', function () {
        handleAction("Reverting", 1800000); // Simulate reverting for 30 minutes
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
        handleAction("Rebooting", 900000); // Simulate rebooting for 15 minutes
        rebootCount--;
        updateButtonStates();
        $('#rebootModal').modal('hide');
    });

    // Event handler for Cancel button on the reboot modal
    $('#rebootModal .btn-secondary').on('click', function () {
        $('#rebootModal').modal('hide');
    });

    // Event handler for Close button on the reboot modal
    $('#rebootModal .close').on('click', function () {
        $('#rebootModal').modal('hide');
    });

    // Common function to handle an action (Revert/Reboot)
    function handleAction(action, duration) {
        // Simulate action by logging to console
        console.log(action + "...");
        setTimeout(function () {
            console.log(action + " completed.");
        }, duration);
    }

    // Function to start the exam and initialize the timer
    function startExam() {
        examStarted = true;
        updateButtonStates(); // Call this to update button states when the exam starts
        var startTime = new Date().getTime();
        examTimer = setInterval(function () {
            var now = new Date().getTime();
            var distance = now - startTime;
            var hours = Math.floor((examDuration - distance) / (1000 * 60 * 60));
            var minutes = Math.floor((examDuration - distance) % (1000 * 60 * 60) / (1000 * 60));
            var seconds = Math.floor((examDuration - distance) % (1000 * 60) / 1000);

            // Display the remaining time
            $('#examTimer').text(hours + "h " + minutes + "m " + seconds + "s");

            // If the countdown is over, stop the timer and end the exam
            if (distance >= examDuration) {
                clearInterval(examTimer);
                examEnded();
            }
        }, 1000);
    }

    // Function to update the revert and reboot button states
    function updateButtonStates() {
        $('.btn-revert-exam').text("Revert (" + revertCount + " left)").prop('disabled', !examStarted);
        $('.btn-reboot-exam').text("Reboot (" + rebootCount + " left)").prop('disabled', !examStarted);
        if (examStarted) {
            $('.btn-start-exam').removeClass('btn-primary').addClass('btn-success').prop('disabled', true).text('Good Luck!');
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
    }
});
