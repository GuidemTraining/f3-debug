$(document).ready(function() {
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

  // Reapply the buttons/icons for dynamic content changes
  if (typeof(CoursePlayerV2) !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function(data) {
      setTimeout(add_copy_btn, 1000);
    });
  }
});
