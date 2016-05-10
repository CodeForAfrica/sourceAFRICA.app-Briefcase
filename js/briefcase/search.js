BC.search = {};
BC.fn.search = {};

BC.fn.docs = {};

$('document').ready(function(){

  if (window.location.pathname == "/search.html" || window.location.pathname == "/search") {
    BC.search.go();
    window.onhashchange = function () {
      BC.search.go();
    }
  }

});


BC.search.go = function () {
  

  $('html,body').scrollTop(0);
  $('.docs .loading').show();
  $('.docs-list').html('');
  $('.docs-pages-links').html('');

  

  BC.search.text = getParameterByName('q', window.location.hash);
  if (BC.search.text == null) {
    BC.search.text = '';
  };
  $('input#search').val(BC.search.text.trim());

  BC.search.page = Number(getParameterByName('p', window.location.hash));
  if (BC.search.page !== parseInt(BC.search.page,10)) {
    window.location = "/search.html#q=" + encodeURIComponent(BC.search.text) + '&p=1';
    return true;
  };

  $.ajax({
    url: BC.dc.url + '/api/search.json',
    data: { q: BC.search.text, page: BC.search.page, sections: true, mentions: 3 }
  }).done(function (response) {
    BC.docs = {};
    BC.docs = response.documents;

    $.each(BC.docs, function (index, doc) {

      var source   = $("#template-docs-list").html();
      var template = Handlebars.compile(source);

      var context  = {
        title:       doc.title,
        description: doc.description,
        thumbnail:   doc.resources.thumbnail,
        doc_url:     doc.canonical_url,
        doc_id:      doc.id,
        updated_at:  moment(doc.updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        search_text: BC.search.text
      };
      var html = template(context);

      $('.docs-list').append(html);

      // Search mentions
      if (BC.search.text != '' && doc.mentions.length > 0 ) {
        $('#doc-' + doc.id + ' .doc-mentions').show();

        var pages_count = '1 page';
        if (doc.mentions.length > 1) { pages_count = doc.mentions.length + ' pages'};
        $('#doc-' + doc.id + ' .doc-mentions .pages-count').html(pages_count);

        $.each(doc.mentions, function (index, mention) {
          var source   = $("#template-doc-mention").html();
          var template = Handlebars.compile(source);

          var context  = {
            title:       '',
            description: mention.text,
            thumbnail:   doc.resources.page.image.replace('{page}', mention.page).replace('{size}', 'thumbnail'),
            doc_url:     doc.canonical_url + '#document/p' + mention.page,
            page_no:     mention.page
          };
          var html = template(context);

          $('#doc-' + doc.id + ' .doc-mentions').append(html);
          console.log('#docs-' + doc.id + ' .doc-mentions');
        });
      }

    });

    // Pagination
    var source   = $("#template-docs-pages-links").html();
    var template = Handlebars.compile(source);

    var context  = {
      pages:         Math.ceil(response.total/response.per_page),
      page:          response.page,
      disabled_prev: '',
      disabled_next: ''
    };
    if (context.page < 2) {
      context.disabled_prev = 'disabled';
    }
    if (context.page == context.pages) {
      context.disabled_next = 'disabled';
    }
    var html = template(context);
    $('.docs-pages-links').html(html);

    $('.docs .loading').hide();

    // Set share links
    BC.fn.search_bar.setShareLinks();
  });

}

BC.fn.docs.prev = function (page) {
  window.location = "/search.html#q=" + encodeURIComponent(BC.search.text) + '&p=' + (page - 1);
}
BC.fn.docs.next = function (page) {
  window.location = "/search.html#q=" + encodeURIComponent(BC.search.text) + '&p=' + (page + 1);
}
