$(document).ready(function () {
    var revertCount = 2;
    var rebootCount = 3;

    updateButtonCounts();

    $('body').append(`
        <div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">Confirmation</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">Are you sure you want to perform this action?</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                        <button type="button" class="btn btn-primary" id="confirmAction">Yes</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    function openConfirmationModal(actionType) {
        $('#confirmationModal').modal('show');
        $('#confirmAction').off('click').on('click', function () {
            $('#confirmationModal').modal('hide');
            // Simulate loading
            setTimeout(function () {
                if (actionType === 'revert' && revertCount > 0) {
                    revertCount--;
                    console.log('Reverted. Remaining:', revertCount);
                } else if (actionType === 'reboot' && rebootCount > 0) {
                    rebootCount--;
                    console.log('Rebooted. Remaining:', rebootCount);
                }
                updateButtonCounts();
            }, 1000); // Simulate loading for 1 second
        });
    }

    function updateButtonCounts() {
        $('.btn-revert-exam').text(`Revert (${revertCount} left)`).prop('disabled', revertCount <= 0);
        $('.btn-reboot-exam').text(`Reboot (${rebootCount} left)`).prop('disabled', rebootCount <= 0);
    }

    $('.btn-start-exam').click(function () {
        startTimer(60 * 60 * 24); // 24 hours in seconds
        $(this).text("Good Luck!").prop('disabled', true);
    });

    $('.btn-revert-exam').click(function () {
        openConfirmationModal('revert');
    });

    $('.btn-reboot-exam').click(function () {
        openConfirmationModal('reboot');
    });

    function startTimer(duration) {
        var timer = duration, hours, minutes, seconds;
        var interval = setInterval(function () {
            hours = parseInt(timer / 3600, 10);
            minutes = parseInt((timer % 3600) / 60, 10);
            seconds = parseInt(timer % 60, 10);

            // Update your timer display logic here
            if (--timer < 0) {
                clearInterval(interval);
                $('.btn-revert-exam, .btn-reboot-exam').prop('disabled', true);
                alert('Exam time is over.');
            }
        }, 1000);
    }
});
