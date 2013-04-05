function initAjaxAuth() {

  var failed = [], $modal = null;
  var $a = $('<a href="#none" rel="modal" data-href="#users-login-form"></a>');
  $('body').append($a);


  $(document).on('authenticated', function (event, user) {
    if ($modal !== null) {
      $modal.modal('hide');
    }
    failed.splice(0, failed.length).forEach(function (context) {
      $.ajax(context);

    })
  });

  $(document).ajaxError(function(event, response, context) {
    if (response.status == 401) {
      failed.push(context);
      if (failed.length == 1) {
        $modal = $("#users-login-form");
        $modal.modal('show');
        setupSubmitForm($modal, function (response, status) {
          if (status == 'success' && response.success == true) {
            $(document).trigger("authenticated", response.content);
          }
        });
      }

    }

  });
}