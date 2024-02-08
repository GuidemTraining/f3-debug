$(document).ready(function () {
    var revertCount = 2;
    var rebootCount = 3;
    var examDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    var examTimer;
    var examStarted = false; // Flag to track if the exam has started

    // Dynamically create the Bootstrap modal for confirmations
    var modalHTML = `
        <div class="modal fade" id="actionModal" tabindex="-1" role="dialog" aria-labelledby="actionModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="actionModalLabel">Confirm Action</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to proceed?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmAction">Confirm</button>
                    </div>
                </div>
            </div>
        </div>`;
    $('body').append(modalHTML);

    // Call updateButtonStates initially to show the counts immediately
    updateButtonStates();

    // Handler for the Start Exam button
    $(document).on('click', '.btn-start-exam', function () {
        $(this).text("Good Luck!").prop('disabled', true); // Update button text and disable it
        startExam(); // Start the exam
    });

    // Handler for the Revert button
    $(document).on('click', '.btn-revert', function () {
        if (!examStarted) {
            var button = $(this);
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
        if (!examStarted) {
            var button = $(this);
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
            }
        }, 1000);
    }

    // Function to update the revert and reboot button states
    function updateButtonStates() {
        $('.btn-revert').text("Revert (" + revertCount + ")");
        $('.btn-reboot').text("Reboot (" + rebootCount + ")");
    }

    // Clear the exam timer when the page is unloaded
    $(window).on('unload', function () {
        clearInterval(examTimer);
    });
});
