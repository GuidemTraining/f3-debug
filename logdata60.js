$(document).ready(function() {
    var courseId, lessonId, chapterId, userId, userFirstName;
    var courseData = {};

    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            lessonId = data.lesson.id;
            chapterId = data.chapter.id;
            userId = data.user.id;
            userFirstName = data.user.first_name;
            sendProgressData();
        });
    }
    function addClipboardFunctionality() {
        $("pre").each(function() {
            var $this = $(this);
            var buttonHtml = $('<button class="clipboard-button btn btn-secondary btn-sm" style="position: absolute; top: 0.5rem; right: 1.5rem; z-index: 10000;color:skyblue;opacity:0.7;background:none;border:none; display: none;"><i class="fa fa-clipboard" aria-hidden="true"></i></button>').click(function(event) {
                var text = $this.text();
                navigator.clipboard.writeText(text).then(function() {
                    buttonHtml.html('<i class="fa fa-check" aria-hidden="true"></i>').prop('disabled', true);
                    setTimeout(function() {
                        buttonHtml.html('<i class="fa fa-clipboard" aria-hidden="true"></i>').prop('disabled', false);
                        buttonHtml.fadeOut(2000); 
                    }, 2000);
                }).catch(function(err) {
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
    function sendProgressData() {
        var requestData = {
            userId: userId,
            courseId: courseId,
            chapterId: chapterId,
            lessonId: lessonId,
            userFirstName: userFirstName
        };
    
        // Only proceed if all required data is available
        if (userId && courseId && chapterId && lessonId) {
            fetch('https://sb1.guidem.ph/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Necessary for including cookies in cross-origin requests
                body: JSON.stringify(requestData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // or .text() if the response is text
            })
            .then(data => {
                console.log('Progress data sent successfully:', data);
    
                // Handle response
                if (data && data.completedItems) {
                    var completedItems = data.completedItems.map(String);
    
                    $('.guidem-form').each(function() {
                        var $form = $(this);
                        var questionNumber = $form.data('question-id').toString();
                        if (completedItems.includes(questionNumber)) {
                            $form.find('input[type="text"]').prop('disabled', true)
                                 .attr('placeholder', `${userFirstName}, You already completed this. Grit & Grind!`)
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
            })
            .catch((error) => {
                console.error('Error sending progress data:', error);
            });
        }
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
    }
    $(document).on('click', '.vpn-guidem-button', function () {
        var clickedButton = $(this);

        function genvpn() {
            console.log('Submitting data for VPN generation');
            $('#loadingIcon').css('display', 'inline-block');
            clickedButton.prop('disabled', true).text('Generating...');

            // Adjusted AJAX call to handle Blob response
            $.ajax({
                url: 'https://sb1.guidem.ph/generate-vpn',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    courseId: courseId,
                    chapterId: chapterId,
                    lessonId: lessonId,
                    userId: userId,
                }),
                xhrFields: {
                    responseType: 'blob' 
                },
                success: function (blob) {
                    console.log('VPN generation successful');
                    downloadFile(blob, `${userId}-${courseId}.ovpn`);
                    $('#loadingIcon').hide();
                    clickedButton.prop('disabled', false).text('Generate VPN');
                },
                error: function (xhr, status, error) {
                    console.error('Error during VPN generation', error);
                    $('#status').text('Failed to generate VPN. Please try again.').show();
                    $('#loadingIcon').hide();
                    clickedButton.prop('disabled', false).text('Generate VPN');
                }
            });
        }

        console.log('Generate VPN button clicked');
        genvpn();
    });

    function downloadFile(blob, fileName) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    // Apply and reapply clipboard functionality on content changes
    addClipboardFunctionality();
    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function(data) {
            sendProgressData();
            setTimeout(addClipboardFunctionality, 1000);
        });
    }

    $(document).on('click', '#register-button', function() {
        registerUser();
        sendProgressData();
    });
    tryAttachEventToRegisterButton();
});
