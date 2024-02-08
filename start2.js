$(document).ready(function () {
    // Define variables to hold course and user data
    var courseId, courseName, courseSlug, lessonId, lessonName, lessonSlug, chapterName, chapterId, userId, userName, userEmail, userFirstName;

    // Check if CoursePlayerV2 is defined and set up a hook for content changes
    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            // Capture the course and user details
            courseId = data.course.id;
            courseName = data.course.name;
            courseSlug = data.course.slug;
            lessonId = data.lesson.id;
            lessonName = data.lesson.name;
            lessonSlug = data.lesson.slug;
            chapterName = data.chapter.name;
            chapterId = data.chapter.id;
            userId = data.user.id;
            userName = data.user.full_name;
            userEmail = data.user.email;
            userFirstName = data.user.first_name;
        });
    }

    // Function to show a confirmation dialog
    function showConfirmation(actionType, callback) {
        var modalMessage = "Are you sure you want to " + actionType + "?";
        if (confirm(modalMessage)) {
            callback(); // Proceed with the action if confirmed
        }
    }

    // Function to simulate loading
    function simulateLoading(actionType) {
        console.log(actionType + ' in progress...');
        // Display loading icon or message
        // Disable buttons during loading
        $('.btn-custom').prop('disabled', true);
        setTimeout(function () {
            // Loading complete
            console.log(actionType + ' completed.');
            // Re-enable buttons after loading is complete
            $('.btn-custom').prop('disabled', false);
        }, 2000); // Simulate 2 seconds of loading time
    }

    // Start Exam button functionality
    $('.btn-start').on('click', function () {
        var twentyFourHoursInSeconds = 60 * 60 * 24; // 24 hours
        startTimer(twentyFourHoursInSeconds);
        $('.btn-revert, .btn-reboot').prop('disabled', false); // Enable the revert and reboot buttons
        $(this).prop('disabled', true); // Disable the start button
    });

    // Timer function
    function startTimer(duration) {
        var display = $('#hours').text() + ':' + $('#minutes').text();
        var timer = duration, hours, minutes, seconds;
        var interval = setInterval(function () {
            hours = parseInt(timer / 3600, 10);
            minutes = parseInt((timer % 3600) / 60, 10);
            seconds = parseInt(timer % 60, 10);

            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            $('#hours').text(hours + "hr");
            $('#minutes').text(minutes + "m");

            if (--timer < 0) {
                clearInterval(interval);
                $('#hours').text("00hr");
                $('#minutes').text("00m");
                // Exam is over
                $('.btn-revert, .btn-reboot').prop('disabled', true); // Disable the revert and reboot buttons
            }
        }, 1000);
    }

    // Revert button functionality
    $('.btn-revert').on('click', function () {
        showConfirmation('revert', function() {
            simulateLoading('Reverting');
        });
    });

    // Reboot button functionality
    $('.btn-reboot').on('click', function () {
        showConfirmation('reboot', function() {
            simulateLoading('Rebooting');
        });
    });
});
