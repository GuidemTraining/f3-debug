$(document).ready(function() {
    var courseData = {};

    function disableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button, .btn-start-exam').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'The exam session is not active or has ended');
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
    }

    function enableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button, .btn-start-exam').prop('disabled', false).css('opacity', '');
        $('input[type="text"]').attr('placeholder', 'Submit your Answer Here ****');
        $('.accordion-button').removeClass('collapsed').attr('aria-expanded', "true");
    }

    function manageStartButtonBasedOnSession(examSessionActive) {
        if (examSessionActive === "yes") {
            $('.btn-start-exam').prop('disabled', true).css('opacity', '0.5'); // Disable if exam is active
        } else {
            $('.btn-start-exam').prop('disabled', false).css('opacity', ''); // Enable if no active exam
        }
    }

    function fetchExamSessionStatus() {
        var requestData = {
            userId: courseData.userId,
            courseId: courseData.courseId,
            chapterId: courseData.chapterId,
            lessonId: courseData.lessonId
        };

        $.ajax({
            url: 'https://sb1.guidem.ph/checkexamuserprogress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                if (response.examSessionActive === "yes") {
                    enableUIComponents(); // Enable UI if exam is active
                } else {
                    disableUIComponents(); // Disable UI if no active exam
                }
                manageStartButtonBasedOnSession(response.examSessionActive); // Manage "Start Exam" button separately
            },
            error: function() {
                console.error('Failed to fetch exam session status');
                disableUIComponents(); // Fallback action
            }
        });
    }

    function onContentChange(data) {
        courseData = {
            userId: data.user.id,
            courseId: data.course.id,
            chapterId: data.chapter.id,
            lessonId: data.lesson.id
        };
        fetchExamSessionStatus(); // Check exam session status whenever content changes
    }

    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', onContentChange);
    }

    // Disable accordion by default
    disableUIComponents();

    fetchExamSessionStatus(); // Initial check for exam session status
});
