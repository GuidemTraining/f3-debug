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
            button_html.html('<i class="fa fa-check" aria-hidden="true"></i>');
            setTimeout(() => { button_html.html('<i class="fa fa-clipboard" aria-hidden="true"></i>'); }, 2000);
          }).catch(function(err) {
            console.error('Failed to copy: ', err);
          });
        });

        $(this).wrap("<div style='position: relative;' class='copy-btn-wrapper'></div>").after(button_html);
      }
    });

    // Adding copy icon to <code> elements
    $("code").each(function(index) {
      if (!$(this).siblings('.kapow-copy-icon').length) {
        var icon_html = $("<i class='fa fa-clipboard kapow-copy-icon' aria-hidden='true' style='margin-left: 5px; cursor: pointer; font-size: 0.75rem; opacity: 0.5;'></i>");

        icon_html.hover(function() {
          $(this).css('opacity', '0.7');
        }, function() {
          $(this).css('opacity', '0.5');
        });

        icon_html.click(function() {
          var text = $(this).parent().find("code").text();
          navigator.clipboard.writeText(text).then(function() {
            console.log('Successfully copied to clipboard');
            icon_html.addClass('fa-check').removeClass('fa-clipboard');
            setTimeout(() => { icon_html.addClass('fa-clipboard').removeClass('fa-check'); }, 2000);
          }).catch(function(err) {
            console.error('Failed to copy: ', err);
          });
        });

        $(this).css('padding-right', '20px'); // Add padding-right to <code> to avoid overlapping
        $(this).after(icon_html);
        $(this).wrap("<div style='position: relative; display: inline-block;'></div>");
      }
    });
  };

  // Apply the copy buttons/icons
  add_copy_btn();

  // If CoursePlayerV2 is present and changes content dynamically, reapply the buttons/icons
  if (typeof(CoursePlayerV2) !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function(data) {
      setTimeout(add_copy_btn, 1000);
    });
  }
});
