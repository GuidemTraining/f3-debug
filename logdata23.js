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

        // Using site.current_user.custom_profile_fields[0].value for userName
        var userName = "Unknown"; // Default value in case it's not set
        if (site && site.current_user && site.current_user.custom_profile_fields && site.current_user.custom_profile_fields.length > 0) {
            userName = site.current_user.custom_profile_fields[0].value;
        }

        courseData = {
            courseId: data.course.id,
            courseName: data.course.name,
            lessonId: data.lesson.id,
            chapterId: data.chapter.id,
            userId: data.user.id,
            userName: userName, // Set from site.current_user.custom_profile_fields[0].value
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
