$(document).ready(function() {
    var courseData = {};

    function updateUIForExamNotStarted() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', true).css('opacity', '0.5');
        $('input[type="text"]').attr('placeholder', 'Please click the start exam button');
        $('.accordion-collapse').removeClass('show').addClass('collapse');
        $('.accordion-button').off('click.prevent').on('click.prevent', function(event) {
            event.preventDefault(); // Prevents the accordion from toggling on click
            event.stopPropagation(); // Stops the click event from propagating to parent elements
        });
    }

    function enableUIComponents() {
        $('.guidem-button, input[type="text"], .accordion-button').prop('disabled', false).css('opacity', '');
        $('input[type="text"]').attr('placeholder', 'Submit your Answer Here ****');
        // Restore default click behavior on accordions if previously disabled
        $('.accordion-button').off('click.prevent');
    }

    function checkAndUpdateUI(completedQuestions) {
        $('.guidem-form').each(function() {
            var $form = $(this);
            var questionNumber = $form.data('question-id').toString();
            if (completedQuestions.includes(questionNumber)) {
                $form.find('input[type="text"]').prop('disabled', true)
                    .attr('placeholder', 'You already completed this. Grit & Grind!')
                    .css({'color': 'silver', 'border': '1px solid #28a745'});
                $form.find('.guidem-button').text('Completed')
                    .css({'background-color': '#218838', 'color': 'white'})
                    .prop('disabled', true);
            }
        });
    }

    // The rest of the functions (fetchUserProgressAndUpdateCache, checkExamSession, onContentChange) remain the same

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
                } else if (response.success) {
                    enableUIComponents();
                    fetchUserProgressAndUpdateCache();
                } else {
                    updateUIForExamNotStarted();
                }
            },
            error: function() {
                updateUIForExamNotStarted();
            }
        });
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
