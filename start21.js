$(document).ready(function () {
    var revertCount = 2;
    var rebootCount = 3;
    var examDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    var examTimer;
    var examStarted = sessionStorage.getItem('examStarted') === 'true';
    var examStartTime = sessionStorage.getItem('examStartTime') ? parseInt(sessionStorage.getItem('examStartTime')) : null;

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

    // Handler for the Revert button
    $(document).on('click', '.btn-revert-exam', function () {
        if (revertCount > 0 && examStarted) {
            handleAction($(this), "Reverting", 5000); // Simulate reverting for 5 seconds
            revertCount--;
            updateButtonStates();
        } else {
            alert("Revert count exceeded or exam not started.");
        }
    });

    // Handler for the Reboot button
    $(document).on('click', '.btn-reboot-exam', function () {
        if (rebootCount > 0 && examStarted) {
            handleAction($(this), "Rebooting", 5000); // Simulate rebooting for 5 seconds
            rebootCount--;
            updateButtonStates();
        } else {
            alert("Reboot count exceeded or exam not started.");
        }
    });

    // Common function to handle an action (Revert/Reboot)
    function handleAction(button, action, duration) {
        $('#actionModal').modal('show');
        // Disable all buttons to prevent clicking during the action
        $('.btn-start-exam, .btn-revert-exam, .btn-reboot-exam').prop('disabled', true);
        simulateAction(action, duration);
        setTimeout(function () {
            // Re-enable all buttons after the action duration
            $('.btn-start-exam, .btn-revert-exam, .btn-reboot-exam').prop('disabled', false);
            // Decrement the count and update the button state after the action
            button.prop('disabled', false); // Re-enable the clicked button
        }, duration + 1000); // Add 1 second for delay after the action completes
    }

    // Function to simulate an action for a specific duration
    function simulateAction(action, duration) {
        console.log(action + "...");
        // Simulate action by logging to console
        setTimeout(function () {
            console.log(action + " completed.");
        }, duration);
    }

    // Function to start the exam timer and change the button states
    function startExam() {
        examStarted = true;
        examStartTime = new Date().getTime(); // Record the start time in milliseconds
        sessionStorage.setItem('examStarted', 'true');
        sessionStorage.setItem('examStartTime', examStartTime);
        updateButtonStates(); // Call this to update button states when the exam starts
        examTimer = setInterval(function () {
            var now = new Date().getTime();
            var distance = examDuration - (now - examStartTime);
            var hours = Math.floor(distance / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the remaining time
            $('#examTimer').text(hours + "h " + minutes + "m " + seconds + "s");

            // If the countdown is over, stop the timer and end the exam
            if (distance < 0) {
                clearInterval(examTimer);
                examEnded();
            }
        }, 1000);
    }

    // Function to update the revert and reboot button states
    function updateButtonStates() {
        $('.btn-revert-exam').text("Revert (" + revertCount + " left)").prop('disabled', !examStarted || revertCount === 0);
        $('.btn-reboot-exam').text("Reboot (" + rebootCount + " left)").prop('disabled', !examStarted || rebootCount === 0);
        if (examStarted) {
            $('.btn-start-exam').removeClass('btn-primary').addClass('btn-success').text('Good Luck!').prop('disabled', true);
        } else {
            $('.btn-start-exam').removeClass('btn-success').addClass('btn-primary').text('Start Exam').prop('disabled', false);
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
    }

    // Clear the exam timer when the page is unloaded
    $(window).on('unload', function () {
        clearInterval(examTimer);
        if (examStarted) {
            sessionStorage.setItem('examStarted', 'true');
            sessionStorage.setItem('examStartTime', examStartTime);
        }
    });
});
