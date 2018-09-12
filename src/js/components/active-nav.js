$(document).ready(function() {
  // change active class on click
  $("nav a").click(function() {
    $("nav")
      .find(".active")
      .removeClass("active");
    $(this).addClass("active");
  });
});
