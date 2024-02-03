$(document).ready(function() {
  const add_copy_btn = function() {
    $("pre").each(function(index) {
      if (!$(this).siblings('.kapow-copy-btn').length) {
        var button_html = $("<button class='kapow-copy-btn btn btn-sm' style='position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10000; background-color: rgba(0, 123, 255, 0.5); color: white; border: none; border-radius: 0.25rem; padding: 0.25rem 0.75rem; font-size: 0.875rem; cursor: pointer; opacity: 0.6;'><i class='fa fa-clipboard' aria-hidden='true'></i></button>");
        
        // ... Rest of the pre button functionality is the same
        // Append the button after the <pre>
        $(this).after(button_html);
      }
    });

    $("code").each(function(index) {
      if (!$(this).siblings('.kapow-copy-btn').length) {
        var button_html = $("<button class='kapow-copy-btn btn btn-sm' style='margin-left: 5px;'><i class='fa fa-clipboard' aria-hidden='true'></i></button>");
        // ... Rest of the code button functionality is the same
        // Append the button after the <code>
        $(this).after(button_html);
        // Adjust styles for the code copy button
        button_html.css({
          'position': 'absolute',
          'top': '0',
          'right': '-30px', // Adjust this value so it does not cover <code> content
          'background-color': 'rgba(0, 123, 255, 0.3)', // Background color for <code> buttons
          'color': 'white',
          'border': 'none',
          'border-radius': '0.25rem',
          'padding': '0.15rem 0.45rem',
          'font-size': '0.75rem',
          'cursor': 'pointer',
          'opacity': '0.5'
        });
        // Wrap <code> with div and apply relative positioning to the parent
        $(this).wrap("<div style='position: relative; display: inline-block;'></div>");
      }
    });
  };

  // Apply the copy buttons
  add_copy_btn();

  // If CoursePlayerV2 is present and changes content dynamically, reapply the buttons
  if (typeof(CoursePlayerV2) !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function(data) {
      setTimeout(add_copy_btn, 1000);
    });
  }
});
