$(document).ready(function () {
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

    // Function to start the exam timer
    function startExam() {
        $('.btn-start-exam').text("Exam Started").prop('disabled', true); // Update button text and disable it
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

    // Clear the exam timer when the page is unloaded
    $(window).on('unload', function () {
        if (examStarted) {
            clearInterval(examTimer);
            sessionStorage.setItem('examStarted', true); // Preserve exam state on page refresh
        }
    });
});
