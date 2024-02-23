$(document).ready(function() {
    var courseData = {};

    function addClipboardFunctionality() {
        $("pre").each(function() {
            var $this = $(this);
            var buttonHtml = $('<button class="clipboard-button btn btn-secondary btn-sm" style="position: absolute; top: 0.5rem; right: 1.5rem; z-index: 10000;color:skyblue;opacity:0.7;background:none;border:none; display: none;"><i class="fa fa-clipboard" aria-hidden="true"></i></button>').click(function(event) {
                var text = $this.text();
                navigator.clipboard.writeText(text).then(function() {
                    buttonHtml.html('<i class="fa fa-check" aria-hidden="true"></i>').prop('disabled', true);
                    setTimeout(function() {
                        buttonHtml.html('<i class="fa fa-clipboard" aria-hidden="true"></i>').prop('disabled', false);
                        buttonHtml.fadeOut(1000); 
                    }, 2000);
                }).catch(function(err) {
                    console.error('Failed to copy: ', err);
                });
                event.stopPropagation(); 
            });
            $this.before(buttonHtml);
            $this.hover(function() {
                buttonHtml.show();
            }, function() {
                if (!buttonHtml.is(':animated')) { 
                    buttonHtml.fadeOut(1500); 
                }
            });
            buttonHtml.hover(function() {
                buttonHtml.show();
            }, function() {
                if (!buttonHtml.is(':animated')) { 
                    buttonHtml.fadeOut(1500);  
                }
            });
        });
    }



    function tryAttachEventToRegisterButton(retryCount = 0, maxRetries = 5) {
        var registerButton = document.getElementById('register-button');

        if (registerButton) {
            registerButton.addEventListener('click', registerUser);
        } else if (retryCount < maxRetries) {
            setTimeout(() => tryAttachEventToRegisterButton(retryCount + 1, maxRetries), 1000); 
        }
    }

    function registerUser() {
        var username = document.getElementById('usernamebg').value.trim();
        var registrationCode = document.getElementById('registrationcodebg').value.trim();

        var requestData = {
            userId: courseData.userId,
            courseId: courseData.courseId,
            chapterId: courseData.chapterId,
            lessonId: courseData.lessonId,
            username: username,
            registrationCode: registrationCode,
        };

        if (!username || !registrationCode) {
            alert('Please fill in all required fields.');
            return;
        }

        console.log('Registration requestData:', requestData);
    }

    function onContentChange(data) {
        var lastActivityDate = new Date().toISOString();
        var userName = data.user.custom_profile_fields && data.user.custom_profile_fields.length > 3 ? data.user.custom_profile_fields[3].value : "Unknown";

        courseData = {
            courseId: data.course.id,
            chapterId: data.chapter.id,
            lessonId: data.lesson.id,
            userId: data.user.id,
            userFirstName: data.user.first_name,
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
            url: 'https://sb1.guidem.ph/progress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                console.log('User progress data:', response);

                if (response && response.completedItems) {
                    var completedItems = response.completedItems.map(String);
                    console.log('Completed questions:', completedItems);

                    $('.guidem-form').each(function() {
                        var $form = $(this);
                        var questionNumber = $form.data('question-id').toString();
                        if (completedItems.includes(questionNumber)) {
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

    // Apply and reapply clipboard functionality on content changes
    addClipboardFunctionality();
    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function(data) {
            setTimeout(addClipboardFunctionality, 1000);
        });
    }

    $(document).on('click', '#register-button', function() {
        registerUser();
    });
    tryAttachEventToRegisterButton();
});
