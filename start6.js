$(document).ready(function () {
    var revertCount = 2;
    var rebootCount = 3;

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

    // Handler for the Start Exam button
    $(document).on('click', '.btn-start-exam', function () {
        $(this).text("Good Luck!").prop('disabled', true);
        startExam();
    });

    // Common function to open the modal and handle the action
    function handleAction(button, action) {
        $('#actionModal').modal('show');
        $('#confirmAction').off('click').on('click', function () {
            $('#actionModal').modal('hide');
            button.prop('disabled', true).text('Processing...');
            setTimeout(() => {
                if (action === 'revert' && revertCount > 0) {
                    revertCount--;
                    console.log('Reverted. Remaining:', revertCount);
                } else if (action === 'reboot' && rebootCount > 0) {
                    rebootCount--;
                    console.log('Rebooted. Remaining:', rebootCount);
                }
                updateButtonStates();
                $('#actionModal').modal('hide');
                button.prop('disabled', false).text(action.charAt(0).toUpperCase() + action.slice(1));
            }, 1000);
        });
    }

    // Handlers for Revert and Reboot buttons
    $(document).on('click', '.btn-revert-exam', function () {
        handleAction($(this), 'revert');
    });
    $(document).on('click', '.btn-reboot-exam', function () {
        handleAction($(this), 'reboot');
    });

    // Update the button states based on counts
    function updateButtonStates() {
        $('.btn-revert-exam').text(`Revert (${revertCount} left)`).prop('disabled', revertCount <= 0);
        $('.btn-reboot-exam').text(`Reboot (${rebootCount} left)`).prop('disabled', rebootCount <= 0);
    }

    // Start Exam function
    function startExam() {
        console.log('Exam started');
        updateButtonStates();

        // Example timer: Replace with actual timer logic
        // This simple timeout simulates the exam duration (e.g., 30 minutes)
        setTimeout(() => {
            console.log('Exam ended');
            $('.btn-revert-exam, .btn-reboot-exam').prop('disabled', true); // Disable buttons after exam ends
            // You could also display a modal or alert to inform that the exam has ended
            alert('The exam has ended. Thank you for participating.');
        }, 1800000); // 1800000 ms = 30 minutes
    }
});
