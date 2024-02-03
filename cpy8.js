$(document).ready(function(){
  const add_copy_btn = function(){
    $("pre").each(function(index) {
      if($(this).siblings('.kapow-copy-btn').length === 0) { // Check if the button already exists
        // Create the copy button using Font Awesome icon
        var button_html = $("<button class='kapow-copy-btn btn btn-sm' style='position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10000; background-color: rgba(0, 123, 255, 0.5); color: white; border: none; border-radius: 0.25rem; padding: 0.25rem 0.75rem; font-size: 0.875rem; cursor: pointer; opacity: 0.6;'><i class='fa fa-clipboard'></i></button>");

        // Style changes on hover
        button_html.hover(
          function() { // mouseenter
            $(this).css('opacity', '1');
          }, function() { // mouseleave
            $(this).css('opacity', '0.7');
          }
        );

        button_html.click(function(){
          var text = $(this).parent().find("pre").text();
          var textarea = $("<textarea>").val(text).appendTo("body").select();
          document.execCommand("copy");
          textarea.remove(); // Remove the temporary textarea

          // Update the button to show a copied state
          $(this).html("<i class='fa fa-check'></i>");
          setTimeout(() => { $(this).html("<i class='fa fa-clipboard'></i>"); }, 2000); // Reset after 2s
        });

        var wrapper = $("<div style='position: relative;'></div>");
        $(this).wrap(wrapper);
        $(this).after(button_html); // Append the button after the <pre>
      }
    });

    $("code").each(function(index) {
      if($(this).siblings('.kapow-copy-btn').length === 0) { // Check if the button already exists
        // Create a smaller and more transparent copy button for <code> tags
        var button_html = $("<button class='kapow-copy-btn btn btn-sm' style='position: absolute; top: 0.25rem; right: 0.25rem; z-index: 10000; background-color: rgba(0, 123, 255, 0.3); color: white; border: none; border-radius: 0.25rem; padding: 0.15rem 0.45rem; font-size: 0.75rem; cursor: pointer; opacity: 0.5;'><i class='fa fa-clipboard'></i></button>");

        // Style changes on hover
        button_html.hover(
          function() { // mouseenter
            $(this).css('opacity', '0.7');
          }, function() { // mouseleave
            $(this).css('opacity', '0.5');
          }
        );

        button_html.click(function(){
          var text = $(this).parent().find("code").text();
          var textarea = $("<textarea>").val(text).appendTo("body").select();
          document.execCommand("copy");
          textarea.remove(); // Remove the temporary textarea

          // Update the button to show a copied state
          $(this).html("<i class='fa fa-check'></i>");
          setTimeout(() => { $(this).html("<i class='fa fa-clipboard'></i>"); }, 2000); // Reset after 2s
        });

        var wrapper = $("<div style='position: relative; display: inline-block;'></div>");
        $(this).wrap(wrapper);
        $(this).after(button_html); // Append the button after the <code>
      }
    });
  }

  // Listen for CoursePlayerV2 content changes, if CoursePlayerV2 is defined
  if(typeof(CoursePlayerV2) !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function(data) {
      setTimeout(add_copy_btn, 1000); // Delay to ensure DOM is ready
    });
  } else {
    add_copy_btn(); // Add copy buttons immediately if CoursePlayerV2 is not present
  }
});
