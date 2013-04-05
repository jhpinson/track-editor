$(document).ready(function () {
  $('body').on('click', '*[data-href=#users-creation-form]', function(e) {
    var $modal = $("#users-creation-form");
    $modal.modal('show');
    setupSubmitForm($modal, function (response, status) {
      if (status == 'success' && response.success == true) {
        $(document).trigger("authenticated", response.content);
        $modal.modal('hide');
      }
    })
  });
});