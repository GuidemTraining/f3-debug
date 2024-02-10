$(document).ready(function() {
    var courseData = {};

    function disableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'Please click the start exam button');
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
    }

    function enableUIComponents(examData) {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', false).css('opacity', '');
        $('input[type="text"]').attr('placeholder', 'Submit your Answer Here ****');

        // Update progress bar, revert, and reboot buttons based on examData
        updateProgressBar(examData);
        updateRevertRebootButtons(examData);
    }

    function updateProgressBar(examData) {
        // Example: Update your progress bar based on examData
        // This is a placeholder. Adjust calculation as needed.
        let progress = calculateProgress(examData.startTime, examData.endTime);
        $('.guidem-progress-bar').css('width', progress+'%').text(progress + '%');
    }

    function calculateProgress(startTime, endTime) {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const now = new Date().getTime();
        const progress = ((now - start) / (end - start)) * 100;
        return Math.min(Math.max(progress, 0), 100).toFixed(2); // Clamps value between 0 and 100
    }

    function updateRevertRebootButtons(examData) {
        $('.btn-revert-exam').text(`Revert (${examData.allowRevertAttempts - examData.revertAttempts} left)`).prop('disabled', examData.revertAttempts >= examData.allowRevertAttempts);
        $('.btn-reboot-exam').text(`Reboot (${examData.allowRebootAttempts - examData.rebootAttempts} left)`).prop('disabled', examData.rebootAttempts >= examData.allowRebootAttempts);
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
                    // Example of updating UI based on completed questions
                    response.completedQuestions.forEach(function(questionId) {
                        $(`.guidem-form[data-question-id="${questionId}"] input[type="text"]`).prop('disabled', true).attr('placeholder', 'Completed');
                        $(`.guidem-form[data-question-id="${questionId}"] .guidem-button`).prop('disabled', true).text('Completed');
                    });
                }
            },
            error: function() {
                disableUIComponents();
            }
        });
    }

    function checkExamSession() {
        var requestData = { userId: courseData.userId };

        $.ajax({
            url: 'https://sb1.guidem.ph/checkexamuserprogress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                if (response.examSessionActive === "yes") {
                    enableUIComponents(response);
                    fetchUserProgressAndUpdateCache();
                } else {
                    disableUIComponents();
                }
            },
            error: function() {
                disableUIComponents();
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
        checkExamSession();
    }

    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', onContentChange);
    }

    checkExamSession();

    $(document).on('click', '.guidem-button', function() {
        fetchUserProgressAndUpdateCache();
        checkExamSession();
    });
});
