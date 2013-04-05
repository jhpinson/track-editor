
window.formCallback = {};

$(window).load(function() {

  var cleanErrors = function ($form) {
    $form.find('.modal-body .alert-error').remove();
  }

  var setGlobalError = function ($form, err) {
    $form.find('.modal-body').prepend('<div class="alert alert-error">'+err+'</div>');
  }

  var setupNod = function ($form) {

    var metrics = [];
    $form.find('[data-nod]').each(function (idx, field) {
      var $field = $(field);
      if ($field.data('nod') == 'email') {
        metrics.push([ '#' + $field.attr('id'), 'email', 'Doit être une adresse email valide'])
      } else if (/^min-length:[0-9]+$/.test($field.data('nod'))) {
        metrics.push([ '#' + $field.attr('id'),
                      $field.data('nod'),
                      'Doit contenir au moins ' + (/^min-length:([0-9]+)$/.exec($field.data('nod'))[1])+ ' caractères'])
      }

    });
    $form.nod(metrics,{ 'delay' : 200,
                          'submitBtnSelector' : '.btn-primary',
                          'helpSpanDisplay' :  'help-block'})
  };

  window.setupSubmitForm = function($modal, callback) {

    callback = callback || function () {};

    if ($modal.find('form').length !== 1) {
      return;
    }

    var $form = $modal.find('form'),
      url = $form.attr('action'),
      $button = $modal.find('.btn-primary');

    setupNod($form);

    $form.submit(function(evt) {
      evt.preventDefault();
      var data = $form.serializeObject();

      cleanErrors($form);

      $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
      }).always(function (response, status) {
        if (status !== 'success') {
          setGlobalError($form, 'Something went wrong');
        } else if (response.success === false) {
          setGlobalError($form, response.error);
        }
        callback(response, status);
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

    } /*else {
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
    }*/

  });
});