$(document).ready(function() {
  const add_copy_btn = function() {
    $("pre").each(function(index) {
      if (!$(this).closest('div').hasClass('copy-btn-wrapper')) {
        var button_html = $("<button class='kapow-copy-btn btn btn-sm' style='position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10000;'><i class='fa fa-clipboard' aria-hidden='true'></i></button>");

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

    $("code").each(function(index) {
      if (!$(this).closest('div').hasClass('copy-btn-wrapper')) {
        var button_html = $("<button class='kapow-copy-btn btn btn-sm' style='margin-left: 5px;'><i class='fa fa-clipboard' aria-hidden='true'></i></button>");

        button_html.hover(function() {
          $(this).css('opacity', '1');
        }, function() {
          $(this).css('opacity', '0.7');
        });

        button_html.click(function() {
          var text = $(this).parent().find("code").text();
          navigator.clipboard.writeText(text).then(function() {
            console.log('Successfully copied to clipboard');
            button_html.html('<i class="fa fa-check" aria-hidden="true"></i>');
            setTimeout(() => { button_html.html('<i class="fa fa-clipboard" aria-hidden="true"></i>'); }, 2000);
          }).catch(function(err) {
            console.error('Failed to copy: ', err);
          });
        });

        $(this).after(button_html);
        $(this).next('.kapow-copy-btn').css({
          'font-size': '0.75rem',
          'padding': '0.15rem 0.45rem',
          'opacity': '0.5',
          'position': 'absolute',
          'top': '0',
          'right': '-30px', // Adjust as needed to not cover the content
        });
        // Wrap with div and apply relative positioning to the parent
        $(this).wrap("<div style='position: relative; display: inline-block;'></div>");
      }
    });
  };

  add_copy_btn();

  if (typeof(CoursePlayerV2) !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function(data) {
      setTimeout(add_copy_btn, 1000);
    });
  }
});
