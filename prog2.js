$(document).ready(function() {
    var courseData = {};
    var completedQuestionsCache = [];

    function updateUIForExamNotStarted() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'Please click the start exam button');
        $('.accordion-collapse').removeClass('show').addClass('collapse');
    }

    function enableAllUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', false).css('opacity', '');
        $('.accordion-collapse').addClass('show').removeClass('collapse');
        $('input[type="text"]').attr('placeholder', 'Submit your Answer Here ****');
    }

    function checkAndUpdateUI() {
        $('.guidem-form').each(function() {
            var $form = $(this);
            var questionNumber = $form.data('question-id').toString();
            if (completedQuestionsCache.includes(questionNumber)) {
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
                    completedQuestionsCache = response.completedQuestions.map(String);
                    checkAndUpdateUI();
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching user progress:', error);
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
                    updateUIForExamNotStarted();
                } else {
                    enableAllUIComponents();
                    fetchUserProgressAndUpdateCache(); // Fetch progress only if the exam has started
                }
            },
            error: function(xhr, status, error) {
                console.error('Failed to check exam session:', error);
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
        CoursePlayerV2.on('hooks:contentDidChange', function(data) {
            onContentChange(data);
        });
    }

    checkExamSession();

    $(document).on('click', '.guidem-button', function() {
        fetchUserProgressAndUpdateCache();
        checkExamSession();
    });
});
