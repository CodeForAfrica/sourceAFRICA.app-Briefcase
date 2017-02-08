
BC.search = {
  text: '',
  q: '',

  api: {
    response: {}
  },

  filters: {
    projectid: '',
    accountid: '',
    orgarnisationid: ''
  },

  fn: {
    go: function () {},
    addFilters: function () {},
    filters: {
      add: function () {}
    },
    docs: {
      show: function () {},
      showNotFound: function () {}
    },
    pagination: {
      show: function () {}
    }
  }
};

BC.fn.search = BC.search.fn;


// 
$('document').ready(function(){

  if (window.location.pathname == "/search.html" || window.location.pathname == "/search") {
    BC.search.fn.go();
    window.onhashchange = function () {
      BC.search.fn.go();
    }
  }

});


// SEARCH Function

BC.search.fn.go = function () {

  $('html,body').scrollTop(0);
  $('.docs .loading').show();
  $('.search-list').html('');
  $('.search-pages-links').html('');

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

  // Add filters to search

  BC.search.fn.addFilters();

  $.get(
    BC.dc.url + '/api/search.json' ,
    { 
      q: BC.search.q,
      page: BC.search.page,
      sections: true, mentions: 3, contributor: true
    },
    function (response) {
        
        BC.search.api.response = response;

        BC.docs = {};
        BC.docs = response.documents;

        if(BC.docs.length == 0) {
          BC.search.fn.docs.showNotFound();
        } else {
          BC.search.fn.docs.show();
        };

        $('.docs .loading').hide();

        // Set share links
        BC.fn.search_bar.setShareLinks();
      }
    );

}



// ADD FILTERS

BC.search.fn.addFilters = function () {
  BC.search.q = '';

  $.each(BC.search.filters, function (key, filter) {
    if (filter.trim() != '') {
      BC.search.q += key + ':' + filter + ' ';
    };
    
  });

  BC.search.q += BC.search.text;
  return BC.search.q;
}


// SHOW DOCS LIST

BC.search.fn.docs.show = function () {

  $.each(BC.docs, function (index, doc) {

    var source   = $("#template-search-list").html();
    var template = Handlebars.compile(source);

    doc.pages_no = '1 Page';
    if (doc.pages > 1) { doc.pages_no = doc.pages + ' Pages'};

    var context  = {
      title:           doc.title,
      description:     doc.description,
      thumbnail:       doc.resources.thumbnail,
      doc_url:         doc.canonical_url,
      doc_id:          doc.id,
      updated_at:      moment(doc.updated_at).format("MMM D, YYYY"),
      pages_no:        doc.pages_no,
      contributor:     doc.contributor,
      contributor_org: doc.contributor_organization,
      search_text:     BC.search.text
    };
    var html = template(context);

    $('.search-list').append(html);

    // Search mentions
    if (BC.search.text != '' && doc.mentions && doc.mentions.length > 0) {
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
      });
    }

  });

  BC.search.fn.pagination.show();
}

BC.search.fn.docs.showNotFound = function () {
  var source   = $("#template-search-not-found").html();
  var template = Handlebars.compile(source);

  var context  = {
    search_text: BC.search.text
  };

  var html = template(context);
  $('.search-list').html(html);
}


// SEARCH RESULT PAGINATION

BC.search.fn.pagination.show = function () {
  var source   = $("#template-search-pages-links").html();
  var template = Handlebars.compile(source);

  var context  = {
    pages:         Math.ceil(BC.search.api.response.total/BC.search.api.response.per_page),
    page:          BC.search.api.response.page,
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
  $('.search-pages-links').html(html);
}

BC.search.fn.prev = function (page) {
  window.location = "/search.html#q=" + encodeURIComponent(BC.search.text) + '&p=' + (page - 1);
}
BC.search.fn.next = function (page) {
  window.location = "/search.html#q=" + encodeURIComponent(BC.search.text) + '&p=' + (page + 1);
}



