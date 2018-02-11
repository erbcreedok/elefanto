$( document ).ready(function() {

  $('.toggle-class-on-click').on('click', function () {
      $(this.dataset.target).toggleClass(this.dataset.className);
  });

});
