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

    // Timer function
    function startTimer(duration) {
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
            $('#seconds').text(seconds + "s");

            if (--timer < 0) {
                clearInterval(interval);
                $('#hours').text("00hr");
                $('#minutes').text("00m");
                $('#seconds').text("00s");
                // Exam is over
                $('.btn-revert-exam, .btn-reboot-exam').prop('disabled', true); // Disable the revert and reboot buttons
            }
        }, 1000);
    }

    // Start Exam button event
    $('.btn-start-exam').click(function () {
        // Start the timer for 24 hours
        var twentyFourHoursInSeconds = 60 * 60 * 24;
        startTimer(twentyFourHoursInSeconds);

        // Enable Revert and Reboot buttons
        $('.btn-revert-exam, .btn-reboot-exam').prop('disabled', false);

        // Disable the Start Exam button
        $(this).prop('disabled', true);
    });

    // Revert button event
    $('.btn-revert-exam').click(function () {
        // Confirm action and simulate loading if confirmed
        if (confirm('Are you sure you want to revert?')) {
            console.log('Reverting...');
            // Perform the revert action here
        }
    });

    // Reboot button event
    $('.btn-reboot-exam').click(function () {
        // Confirm action and simulate loading if confirmed
        if (confirm('Are you sure you want to reboot?')) {
            console.log('Rebooting...');
            // Perform the reboot action here
        }
    });
});
