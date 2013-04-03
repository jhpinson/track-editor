$(window).load(function() {

  var setupSubmitForm = function($modal) {
    if ($modal.parent('form').length !== 1) {
      return;
    }

    var $form = $modal.parent('form'),
      url = $form.attr('action'),
      button = $modal.find('.btn-primary');

    $form.submit(function(evt) {
      evt.preventDefault();
      var data = $form.serializeObject();

      $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
      }).always(function () {
        console.debug(arguments)
      });
    });
  };


  $('body').on('click', '*[rel=modal]', function(e) {
    e.preventDefault();

    var href = $(e.target).attr('data-href');

    if (typeof(href) === 'undefined') {
      href = $(e.currentTarget).attr('data-href');
    }

    if (href.indexOf('#') == 0) {
      var width = $(e.target).attr('data-width');
      if (typeof(width) !== 'undefined') {
        $(href).css({
          width: width + 'px',
          'margin-left': function() {
            return -($(this).width() / 2);
          }
        });
      }
      $(href).modal('show');
      $("body").trigger("htmlChanged", $(href));
      setupSubmitForm($(href));

    } else {
      var width = $(e.target).attr('data-width');
      if (typeof(width) !== 'undefined') {
        $("#modal").css({
          width: width + 'px',
          'margin-left': function() {
            return -($(this).width() / 2);
          }
        });
      }
      $("#modal").empty();
      $("#modal").modal('show');

      $("#modal").load(href, function(data) {
        $("body").trigger("htmlChanged", $("#modal"));
        setupSubmitForm($("#modal"));
      });
    }

  });
});