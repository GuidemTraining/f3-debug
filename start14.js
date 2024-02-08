$(document).ready(function () {
    var revertCount = 2;
    var rebootCount = 3;
    var examDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    var examTimer;
    var examStarted = sessionStorage.getItem('examStarted') === 'true';

    // Dynamically create the Bootstrap modal for confirmations
    var modalHTML = `
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
    $('body').append(modalHTML);

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
    $(document).on('click', '.btn-revert', function () {
        var button = $(this);
        if (examStarted) {
            if (revertCount > 0) {
                handleAction(button, function () {
                    simulateAction("Reverting");
                    revertCount--;
                    updateButtonStates();
                });
            } else {
                alert("Revert count exceeded.");
            }
        }
    });

    // Handler for the Reboot button
    $(document).on('click', '.btn-reboot', function () {
        var button = $(this);
        if (examStarted) {
            if (rebootCount > 0) {
                handleAction(button, function () {
                    simulateAction("Rebooting");
                    rebootCount--;
                    updateButtonStates();
                });
            } else {
                alert("Reboot count exceeded.");
            }
        }
    });

    // Common function to open the modal and handle the action
    function handleAction(button, action) {
        $('#actionModal').modal('show');
        $('#confirmAction').off('click').on('click', function () {
            // Disable the button immediately after clicking confirm to prevent spamming
            button.prop('disabled', true).text('Processing...');

            // Perform the action after a slight delay to allow modal to close
            setTimeout(function () {
                action();
                setTimeout(function () {
                    button.prop('disabled', false).text(button.data('original-text')); // Re-enable the button and restore original text
                }, 5000); // Minimum duration of 5 seconds
            }, 500);
        });
    }

    // Function to simulate an action
    function simulateAction(action) {
        console.log(action + "...");
        // Simulate action by logging to console
    }

    // Function to start the exam timer
    function startExam() {
        examStarted = true;
        sessionStorage.setItem('examStarted', true);
        var startTime = new Date().getTime();
        examTimer = setInterval(function () {
            var now = new Date().getTime();
            var distance = now - startTime;
            var hours = Math.floor((examDuration - distance) / (1000 * 60 * 60));
            var minutes = Math.floor((examDuration - distance) % (1000 * 60 * 60) / (1000 * 60));
            var seconds = Math.floor((examDuration - distance) % (1000 * 60) / 1000);

            // Display the remaining time
            $('#examTimer').text(hours + "h " + minutes + "m " + seconds + "s");

            // If the countdown is over, show an alert and stop the timer
            if (distance >= examDuration) {
                clearInterval(examTimer);
                alert("Time's up!");
                // Enable the Start Exam button after the exam is finished
                $('.btn-start-exam').prop('disabled', false).text('Start Exam');
                examStarted = false;
                sessionStorage.removeItem('examStarted');
            }
        }, 1000);
    }

    // Function to update the revert and reboot button states
    function updateButtonStates() {
        $('.btn-revert').text("Revert (" + revertCount + ")");
        $('.btn-reboot').text("Reboot (" + rebootCount + ")");
        if (examStarted) {
            $('.btn-revert, .btn-reboot').prop('disabled', false);
        } else {
            $('.btn-revert, .btn-reboot').prop('disabled', true);
        }
        if (examStarted) {
            $('.btn-start-exam').removeClass('btn-primary').addClass('btn-dark').prop('disabled', true).text('Good Luck!');
        }
    }

    // Clear the exam timer when the page is unloaded
    $(window).on('unload', function () {
        if (examStarted) {
            clearInterval(examTimer);
            sessionStorage.setItem('examStarted', true); // Preserve exam state on page refresh
        }
    });
});
