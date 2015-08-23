var default_settings = {'delay': 15000,
                        'all_categories': 'Featured pictures of astronomy\nFeatured pictures of fish\nFeatured pictures of Charadriiformes\nFeatured pictures of Passeriformes\nFeatured pictures of Accipitriformes\nFeatured pictures of mammals\nFeatured pictures of architecture\nFeatured pictures of flowers\nFeatured pictures of landscapes\nFeatured night shots\nFeatured pictures of art\nFeatured maps\nFeatured pictures of lighthouses\nFeatured pictures of churches\nFeatured pictures of fortresses\nFeatured pictures of bridges\nFeatured pictures of the International Space Station\nFeatured pictures of rolling stock\nFeatured pictures of motorcycles\nFeatured pictures of ships\nFeatured pictures of aircraft\nPictures of the Year (2008)\nPictures of the Year (2009)\nPictures of the Year (2010)\nPictures of the Year (2011)\nPictures of the Year (2012)\nPictures of the Year (2013)'}

function set_background(elem) {
  /**
  * Get the slides from Chrome.local storage and then add them to a 
  *   VegasJS element.
  */
  var store = new Store('settings', default_settings);
  var settings = store.toObject();

  chrome.storage.local.get('slides', function(config) {
    $(elem).vegas({
      timer: false,
      color: '#000',
      delay: settings['delay'],
      color: '#000',
      slides: config['slides'],
      transitionDuration: 0,
      walk: function(index, slide) {
        $('#credits-container').show();
        $('#filename')
          .html(slide.title)
          .attr('href', slide.filepage);
        $('#author')
          .html(slide.author)
          .attr('href', slide.userpage);
        $('#rights')
          .html(slide.rights);
      }
    });
  });
}

$(function() {
  $('#credits-container').hide();
  if ($('body').length > 0) {
    set_background('body');
    var port = chrome.runtime.connect({name: 'commons-tab'});
    port.postMessage({'more': true});
  }
})