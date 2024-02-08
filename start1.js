$(document).ready(function () {

    // Timer related variables
    var interval;
    var duration = 60 * 60 * 24; // 24 hours in seconds

    // Start the exam and timer
    function startExam() {
        var display = $('#timer');
        startTimer(duration, display);
        $('.btn-revert, .btn-reboot').prop('disabled', false);
        $('#startExam').prop('disabled', true);
    }

    // Timer function
    function startTimer(duration, display) {
        var timer = duration, hours, minutes, seconds;
        interval = setInterval(function () {
            hours = parseInt(timer / 3600, 10);
            minutes = parseInt((timer % 3600) / 60, 10);
            seconds = parseInt(timer % 60, 10);

            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.text(hours + "hr " + minutes + "m " + seconds + "s");

            if (--timer < 0) {
                clearInterval(interval);
                display.text("EXAM OVER");
                // Disable buttons after exam is over
                $('.btn-revert, .btn-reboot').prop('disabled', true);
            }
        }, 1000);
    }

    // Click handler for starting the exam
    $('#startExam').click(function () {
        startExam();
    });

    // Function to show modal confirmation
    function showModal(actionType) {
        var modalMessage = "Are you sure you want to " + actionType + "?";
        if (confirm(modalMessage)) {
            simulateLoading(actionType);
        }
    }

    // Simulate a loading process
    function simulateLoading(actionType) {
        console.log(actionType + ' in progress...');
        $('.btn-revert, .btn-reboot').prop('disabled', true);
        // Simulate loading time
        setTimeout(function () {
            console.log(actionType + ' completed.');
            $('.btn-revert, .btn-reboot').prop('disabled', false);
        }, 2000); // Simulate 2 seconds loading time
    }

    // Click handlers for revert and reboot buttons
    $('.btn-revert').click(function () {
        showModal('revert');
    });

    $('.btn-reboot').click(function () {
        showModal('reboot');
    });

});
