BC.search = {};

$('document').ready(function(){

  if (window.location.pathname == "/search.html") {
    BC.search.go();
    window.onhashchange = function () {
      BC.search.go();
    }
  }

});


BC.search.go = function () {
  BC.search.text = getParameterByName('q', window.location.hash);
  $('input#search').val(BC.search.text);

  

}
