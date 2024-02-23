$(document).ready(function() {
    var courseData = {};
    const add_copy_btn = function() {
        // Adding copy button to <pre> elements
        $("pre").each(function(index) {
          if (!$(this).siblings('.kapow-copy-btn').length) {
            var button_html = $("<button class='kapow-copy-btn btn btn-sm' style='position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10000; background-color: rgba(0, 123, 255, 0.5); color: white; border: none; border-radius: 0.25rem; padding: 0.25rem 0.75rem; font-size: 0.875rem; cursor: pointer; opacity: 0.6;'><i class='fa fa-clipboard' aria-hidden='true'></i></button>");
    
            button_html.hover(function() {
              $(this).css('opacity', '1');
            }, function() {
              $(this).css('opacity', '0.7');
            });
    
            button_html.click(function() {
              var text = $(this).parent().find("pre").text();
              navigator.clipboard.writeText(text).then(function() {
                console.log('Successfully copied to clipboard');
                $(this).find('i').removeClass('fa-clipboard').addClass('fa-check');
                setTimeout(() => { $(this).find('i').removeClass('fa-check').addClass('fa-clipboard'); }, 2000);
              }).catch(function(err) {
                console.error('Failed to copy: ', err);
              });
            });
    
            $(this).wrap("<div style='position: relative;' class='copy-btn-wrapper'></div>").after(button_html);
          }
        });
    
        // Adding copy icon to <gcode> elements
        $("gcode").each(function(index) {
          if (!$(this).siblings('.kapow-copy-icon').length) {
            var icon_html = $("<i class='fa fa-clipboard kapow-copy-icon' aria-hidden='true' style='margin-left: 5px; cursor: pointer; font-size: 0.75rem; opacity: 0.5;'></i>");
    
            icon_html.hover(function() {
              $(this).css('opacity', '1');
            }, function() {
              $(this).css('opacity', '0.7');
            });
    
            icon_html.click(function() {
              var text = $(this).parent().text(); // Make sure it captures the correct text
              navigator.clipboard.writeText(text).then(function() {
                console.log('Successfully copied to clipboard');
                icon_html.removeClass('fa-clipboard').addClass('fa-check');
                setTimeout(() => { icon_html.removeClass('fa-check').addClass('fa-clipboard'); }, 2000);
              }).catch(function(err) {
                console.error('Failed to copy: ', err);
              });
            });
    
            // Adjusted to decrease padding size for a more compact design
            $(this).css('padding-right', '10px'); // Adjust padding-right to avoid overlapping
            $(this).after(icon_html);
            $(this).wrap("<span style='position: relative; display: inline-block;'></span>"); // Use <span> for inline elements
          }
        });
      };
    
      // Apply the copy buttons/icons
      add_copy_btn();

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

    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', onContentChange);
            setTimeout(addCopyButton, 1000);
    }

    $(document).on('click', '#register-button', function() {
        registerUser();
    });
    tryAttachEventToRegisterButton();
    addCopyButton();

});
