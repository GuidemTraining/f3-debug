$(document).ready(function() {
    var courseData = {};

    function disableUIComponents() {
        // Disable buttons, inputs, and accordion toggles, setting appropriate placeholders
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'Please click the start exam button');
        $('.accordion-collapse').removeClass('show');
        $('.accordion-button').addClass('collapsed').attr('aria-expanded', "false");
    }

    function enableUIComponents() {
        // Re-enable components, resetting placeholders
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', false).css('opacity', '');
        $('input[type="text"]').attr('placeholder', 'Submit your Answer Here ****');
    }

    function checkAndUpdateUI(completedQuestions) {
        $('.guidem-form').each(function() {
            var $form = $(this);
            var questionNumber = $form.data('question-id').toString();
            if (completedQuestions.includes(questionNumber)) {
                // Mark questions as completed based on the cache
                $form.find('input[type="text"]').prop('disabled', true)
                     .attr('placeholder', 'You already completed this. Grit & Grind!')
                     .css({'color': 'silver', 'border': '1px solid #28a745'});
                $form.find('.guidem-button').text('Completed')
                    .css({'background-color': '#218838', 'color': 'white'})
                    .prop('disabled', true);
            }
        });
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
                if (response && response.completedQuestions) {
                    // Update UI based on user progress
                    checkAndUpdateUI(response.completedQuestions.map(String));
                } else {
                    // Fallback to disable UI if no data is received
                    disableUIComponents();
                }
            },
            error: function() {
                // Fallback to disable UI on error
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
                if (response.success && !response.examSession) {
                    // Disable UI components if the exam hasn't started
                    disableUIComponents();
                } else if (response.success) {
                    // Enable UI components and fetch user progress if the exam is active
                    enableUIComponents();
                    fetchUserProgressAndUpdateCache();
                } else {
                    // Fallback to disable UI if the exam session status is unclear
                    disableUIComponents();
                }
            },
            error: function() {
                // Fallback to disable UI on error
                disableUIComponents();
            }
        });
    }

    function onContentChange(data) {
        // Update courseData based on content changes
        courseData = {
            userId: data.user.id,
            courseId: data.course.id,
            chapterId: data.chapter.id,
            lessonId: data.lesson.id
        };
        // Recheck exam session and user progress as content changes
        checkExamSession();
    }

    // Assuming CoursePlayerV2 is an object that emits an event when the content changes
    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function(data) {
            onContentChange(data);
        });
    }

    // Initial check for exam session status
    checkExamSession();

    // Bind event handler for button clicks to recheck progress
    $(document).on('click', '.guidem-button', function() {
        fetchUserProgressAndUpdateCache();
        checkExamSession();
    });
});
