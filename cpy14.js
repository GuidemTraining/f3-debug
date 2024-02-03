$(document).ready(function() {
  const add_copy_btn = function() {
    $("pre").each(function() {
      if (!$(this).closest('div').hasClass('copy-btn-wrapper')) {
        var button_html = $("<button class='kapow-copy-btn btn btn-sm' style='position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10000; background-color: rgba(0, 123, 255, 0.5); color: white; border: none; border-radius: 0.25rem; padding: 0.25rem 0.75rem; font-size: 0.875rem; cursor: pointer; opacity: 0.6;'><i class='fa fa-clipboard' aria-hidden='true'></i> Copy</button>");

        $(this).wrap("<div style='position: relative;' class='copy-btn-wrapper'></div>").after(button_html);
      }
    });

    $("code").each(function() {
      if (!$(this).closest('div').hasClass('copy-btn-wrapper')) {
        var icon_html = $("<i class='fa fa-clipboard kapow-copy-icon' aria-hidden='true' style='margin-left: 5px; cursor: pointer; font-size: 0.75rem; opacity: 0.5;'></i>");

        $(this).after(icon_html);
        $(this).wrap("<div style='position: relative; display: inline-block;' class='code-copy-wrapper'></div>");
      }
    });
  };

  add_copy_btn();

  if (typeof(CoursePlayerV2) !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function(data) {
      setTimeout(add_copy_btn, 1000);
    });
  }

  // Event delegation for dynamically added .kapow-copy-icon elements
  $(document).on('click', '.kapow-copy-icon', function() {
    var text = $(this).prev("code").text();
    navigator.clipboard.writeText(text).then(function() {
      console.log('Successfully copied to clipboard');
    }).catch(function(err) {
      console.error('Failed to copy: ', err);
    });
  });
});
