
BC.search_bar = {};
BC.fn.search_bar = {};

$('document').ready(function(){

  $('.search-btn').click(function(){
    window.location = "/search.html#q=" + encodeURIComponent($('#search').val().trim());
  });

  $('.search').keypress(function(e){
    if(e.which == 13){ //Enter key pressed
        $('.search-btn').click(); //Trigger search button click event
    }
  });

});

// Set the share links in the search bar

BC.fn.search_bar.setShareLinks = function () {
  var share_msg = encodeURIComponent('"' + BC.search.text + '" in Briefcase - ' + window.location.href);
  var share_tw  = 'https://twitter.com/intent/tweet?text=' + share_msg + '&via=Code4Africa';
  var share_fb  = 'https://www.facebook.com/dialog/share?app_id=772534026119230&display=popup';
      share_fb += '&href=' + encodeURIComponent(window.location.href);
      share_fb += '&redirect_uri=' + encodeURIComponent(window.location.href);
  
  $('.share-tw').attr('href', share_tw);
  $('.share-fb').attr('href', share_fb);
}
