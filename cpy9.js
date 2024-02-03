$(document).ready(function() {
  const add_copy_btn = function() {
    $("pre, code").each(function(index) {
      if (!$(this).closest('div').hasClass('copy-btn-wrapper')) { // Check if the wrapper already exists
        // Create the copy button
        var button_html = $("<button class='kapow-copy-btn btn btn-sm' style='position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10000; background-color: rgba(0, 123, 255, 0.5); color: white; border: none; border-radius: 0.25rem; padding: 0.25rem 0.75rem; font-size: 0.875rem; cursor: pointer; opacity: 0.6;'>Copy</button>");

        // Style changes on hover
        button_html.hover(function() {
          $(this).css('opacity', '1');
        }, function() {
          $(this).css('opacity', '0.7');
        });

        // Copy functionality
        button_html.click(function() {
          var text = $(this).parent().find("pre, code").text();
          navigator.clipboard.writeText(text).then(function() {
            console.log('Successfully copied to clipboard');
            // Provide user feedback here, e.g., change button text
            button_html.text('Copied!');
            setTimeout(() => { button_html.text('Copy'); }, 2000); // Reset after 2s
          }).catch(function(err) {
            console.error('Failed to copy: ', err);
          });
        });

        // Wrap the <pre> or <code> and append the button
        $(this).wrap("<div style='position: relative;' class='copy-btn-wrapper'></div>").after(button_html);
      }
    });
  };

  // Initial addition of copy buttons
  add_copy_btn();

  // Reapply when dynamic content is loaded, e.g., in a CoursePlayerV2 environment
  if (typeof(CoursePlayerV2) !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function(data) {
      setTimeout(add_copy_btn, 1000); // Delay to ensure DOM is ready
    });
  }
});
