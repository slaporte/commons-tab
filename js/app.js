var default_settings = {'delay': 15000,
                        'all_images': []}

function set_background(elem) {

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