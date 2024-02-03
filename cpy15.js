$(document).ready(function() {
  const add_copy_btn = function() {
    // Adding copy button to <pre> elements
    $("pre").each(function(index) {
      if (!$(this).siblings('.kapow-copy-btn').length) {
        var button_html = $("<button class='kapow-copy-btn btn btn-sm' style='position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10000; background-color: rgba(0, 123, 255, 0.5); color: white; border: none; border-radius: 0.25rem; padding: 0.25rem 0.75rem; font-size: 0.875rem; cursor: pointer; opacity: 0.6;'>Copy</button>");

        button_html.hover(function() {
          $(this).css('opacity', '1');
        }, function() {
          $(this).css('opacity', '0.7');
        });

        button_html.click(function() {
          var text = $(this).parent().find("pre").text();
          navigator.clipboard.writeText(text).then(function() {
            console.log('Successfully copied to clipboard');
            button_html.text('Copied');
            setTimeout(() => { button_html.text('Copy'); }, 2000);
          }).catch(function(err) {
            console.error('Failed to copy: ', err);
          });
        });

        $(this).before(button_html);
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

        icon_html.click(function(event) {
          var text = $(event.target).closest('code').text();
          navigator.clipboard.writeText(text).then(function() {
            console.log('Successfully copied to clipboard');
            icon_html.addClass('fa-check').removeClass('fa-clipboard');
            setTimeout(() => { icon_html.addClass('fa-clipboard').removeClass('fa-check'); }, 2000);
          }).catch(function(err) {
            console.error('Failed to copy: ', err);
          });
        });

        // Adjust padding-right to avoid overlapping and reduce the icon background size
        $(this).css({'padding-right': '20px', 'padding': '2px'}); // Adjusted padding size
        $(this).after(icon_html);
        $(this).wrap("<span style='position: relative; display: inline-block;'></span>");
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
