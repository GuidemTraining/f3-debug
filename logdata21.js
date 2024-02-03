$(document).ready(function() {
    var courseData = {};

    function addClipboardButton() {
        $('pre').each(function() {
            var $pre = $(this);
            var $clipboardButton = $('<button class="btn btn-secondary btn-sm clipboard-button" data-clipboard-target="#' + $pre.attr('id') + '">Copy</button>');
            $pre.addClass('position-relative');
            $clipboardButton.appendTo($pre);
        });
    }

    function onContentChange(data) {
        var lastActivityDate = new Date().toISOString();

        // Enhanced userName retrieval with detailed logging
        var userName = "Unknown";
        if (data.user.custom_profile_fields && data.user.custom_profile_fields.length > 1) {
            var userField = data.user.custom_profile_fields[1]; // Assuming you're interested in the second field
            userName = userField.value; // Direct assignment

            // Example of detailed logging for debugging
            console.log('Custom Profile Field:', {
                Label: userField.label,
                Value: userField.value,
                Type: userField.field_type,
                IsRequired: userField.is_required
            });
        }

        courseData = {
            courseId: data.course.id,
            courseName: data.course.name,
            lessonId: data.lesson.id,
            chapterId: data.chapter.id,
            userId: data.user.id,
            userName: userName, // Now set from custom profile fields if available
            userFirstName: data.user.first_name,
            userEmail: data.user.email,
            lastActivityDate: lastActivityDate
        };

        console.log('Course Data:', courseData);

        var requestData = {
            userId: courseData.userId,
            courseId: courseData.courseId,
            chapterId: courseData.chapterId,
            lessonId: courseData.lessonId
        };

        $.ajax({
            url: 'https://sb1.guidem.ph/checkuserprogress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                console.log('User progress data:', response);

                if (response && response.completedQuestions) {
                    var completedQuestions = response.completedQuestions.map(String);
                    console.log('Completed questions:', completedQuestions);

                    $('.guidem-form').each(function() {
                        var $form = $(this);
                        var questionNumber = $form.data('question-id').toString();
                        if (completedQuestions.includes(questionNumber)) {
                            $form.find('input[type="text"]').prop('disabled', true)
                                 .attr('placeholder', 'You already completed this. Grit & Grind!')
                                 .attr('style', 'color: silver !important; border: 1px solid rgba(40, 167, 69, 0.5) !important;');
                            $form.find('.guidem-button').text('Completed')
                                .css({'background-color': '#218838 !important', 'color': 'white !important'})
                                .prop('disabled', true);
                            $form.find('.guidem-hint-button')
                                .css('background-color', '#3e4242 !important')
                                .prop('disabled', true);
                        }
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }

    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', onContentChange);
    }

    addClipboardButton();
});
