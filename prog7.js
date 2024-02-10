$(document).ready(function() {
    var courseData = {};

    function disableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'The exam session is not active');
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
    }

    function enableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', false).css('opacity', '');
        $('input[type="text"]').attr('placeholder', 'Submit your Answer Here ****');
        $('.btn-start-exam').prop('disabled', false); // Enable the "Start Exam" button if session is not active
    }

    function updateProgressBar(progress) {
        $('.guidem-progress-bar').css('width', progress + '%').find('.progress-bar-percent').text(progress + '%');
    }

    function updateRevertRebootButtons(revertAttempts, rebootAttempts, allowRevertAttempts, allowRebootAttempts) {
        $('.btn-revert-exam').text(`Revert (${allowRevertAttempts - revertAttempts} left)`).prop('disabled', revertAttempts >= allowRevertAttempts);
        $('.btn-reboot-exam').text(`Reboot (${allowRebootAttempts - rebootAttempts} left)`).prop('disabled', rebootAttempts >= allowRebootAttempts);
    }

    function fetchUserProgressAndUpdateCache() {
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
                if (response.completedQuestions) {
                    response.completedQuestions.forEach(function(questionId) {
                        $(`.guidem-form[data-question-id="${questionId}"] input[type="text"]`).prop('disabled', true).attr('placeholder', 'Completed');
                        $(`.guidem-form[data-question-id="${questionId}"] .guidem-button`).prop('disabled', true).text('Completed');
                    });
                }
                if (response.examSessionActive === "yes") {
                    disableUIComponents();
                } else {
                    enableUIComponents();
                }
                const progress = calculateProgress(response.startTime, response.endTime);
                updateProgressBar(progress);
                updateRevertRebootButtons(response.revertAttempts, response.rebootAttempts, response.allowRevertAttempts, response.allowRebootAttempts);
            },
            error: function() {
                disableUIComponents();
            }
        });
    }

    function calculateProgress(startTime, endTime) {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const now = new Date().getTime();
        const progress = ((now - start) / (end - start)) * 100;
        return Math.min(Math.max(progress, 0), 100).toFixed(2); // Clamps value between 0 and 100
    }

    function onContentChange(data) {
        courseData = {
            userId: data.user.id,
            courseId: data.course.id,
            chapterId: data.chapter.id,
            lessonId: data.lesson.id
        };
        fetchUserProgressAndUpdateCache();
    }

    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', onContentChange);
    }

    // Initially check the exam session status and update UI accordingly
    fetchUserProgressAndUpdateCache();
});
