$(document).ready(function() {
  var url = 'http://starburst.local:8000';

  $('.turn-left').click(function() {
    $.get(url + '?left=true');
  });

  $('.turn-right').click(function() {
    $.get(url + '?right=true');
  });

  $('.move-forward').click(function() {
    $.get(url + '?forward=true');
  });

  $('.move-reverse').click(function() {
    $.get(url + '?reverse=true');
  });

  $('.snapshot').click(function() {
    // reload img tag
    $('img').attr('src', url + '?snap=true&ts=' + (new Date).getTime())
  });
});
