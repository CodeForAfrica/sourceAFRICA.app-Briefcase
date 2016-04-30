
BC.search_bar = {}

$('document').ready(function(){

  $('#search-btn').click(function(){
    window.location = "/search.html#q=" + $('#search').val();
  });

  $('#search').keypress(function(e){
    if(e.which == 13){ //Enter key pressed
        $('#search-btn').click(); //Trigger search button click event
    }
  });

});
