var default_settings = {
  'Category:Featured_pictures_of_astronomy': true,
  'Category:Featured_pictures_of_astronomy': true,
  'Category:Featured_pictures_of_fish': true,
  'Category:Featured_pictures_of_Charadriiformes': true,
  'Category:Featured_pictures_of_Passeriformes': true,
  'Category:Featured_pictures_of_Accipitriformes': true,
  'Category:Featured_pictures_of_mammals': true,
  'Category:Featured_pictures_of_architecture': true,
  'Category:Featured_pictures_of_flowers': true,
  'Category:Featured_pictures_of_landscapes': true,
  'Category:Featured_night_shots': true,
  'Category:Featured_pictures_of_art': true,
  'Category:Featured_maps': true,
  'Category:Featured_pictures_of_lighthouses': true,
  'Category:Featured_pictures_of_churches': true,
  'Category:Featured_pictures_of_fortresses': true,
  'Category:Featured_pictures_of_bridges': true,
  'Category:Featured_pictures_of_the_International_Space_Station': true,
  'Category:Featured_pictures_of_rolling_stock': true,
  'Category:Featured_pictures_of_motorcycles': true,
  'Category:Featured_pictures_of_ships': true,
  'Category:Featured_pictures_of_aircraft': true,
  'Category:Pictures_of_the_Year_(2008)': true,
  'Category:Pictures_of_the_Year_(2009)': true,
  'Category:Pictures_of_the_Year_(2010)': true,
  'Category:Pictures_of_the_Year_(2011)': true,
  'Category:Pictures_of_the_Year_(2012)': true,
  'Category:Pictures_of_the_Year_(2013)': true,
  'delay': 15000,
  'all_images': []
}

function get_categories_set() {
  var settings = new Store('settings', default_settings);
  var settings_obj = settings.toObject();
  excludes = ['all_images', 'delay'] // settings to exclude from categories, umm...
  ret = [];
  for (var setting in settings_obj) {
    if (settings_obj.hasOwnProperty(setting) && 
        settings_obj[setting] && 
        setting.indexOf(excludes) == -1) {
      ret.push(setting);
    }
  }
  // var other_cats = settings_obj.other.split(' ')
  return ret;
}


function shuffle(array) {
  var random = array.map(Math.random);
  array.sort(function(a, b) {
    return random[a] - random[b];
  });
}

function get_and_store_images(storage_obj, settings, cb) {
  cb = cb || function () {}
  if (storage_obj['all_images'].length > 0) {
    cb(); // or else wait
  } else {
    console.log('loading...');
  }
  var category_set = get_categories_set();
  var category = category_set[Math.floor(Math.random() * category_set.length)];
  var url = 'https://commons.wikimedia.org/w/api.php';
  var params = {
      'action': 'query',
      'generator': 'categorymembers',
      'gcmtitle': category,
      'gcmsort': 'timestamp',
      'cmdir': 'desc',
      'gcmtype': 'file',
      'prop': 'imageinfo',
      'iiprop': 'url|user|extmetadata',
      'format': 'json',
      'gcmlimit': 25
  }

  $.ajax({
    dataType: 'jsonp',
    url: url,
    data: params,
  }).done(function(data) {
    var images = data['query']['pages'];
    var ret = [];
    for (var id in images) {
      if (images.hasOwnProperty(id)) {
        var image = images[id];
        if (image['imageinfo'] && image['imageinfo'].length > 0 && image['imageinfo'][0]['extmetadata']['LicenseShortName']) {
          var filename = image['imageinfo'][0]['url'].split(/[\/]+/).pop();
          var parts = image['imageinfo'][0]['url'].split(/commons\//);
          var src = parts[0] + 'commons/thumb/' + parts[1] + '/1440px-' + filename;
          var rights = image['imageinfo'][0]['extmetadata']['LicenseShortName']['value'];
          ret.unshift({'src': src, 
                    'author': image['imageinfo'][0]['user'],
                    'userpage': 'https://commons.wikimedia.org/wiki/User:' + image['imageinfo'][0]['user'],
                    'title': image['title'].replace('File:', '').split(/[\.]+/).shift(),
                    'filepage': image['imageinfo'][0]['descriptionurl'],
                    'rights': rights,
          });
        }
      }
    }
    var all_imgs = storage_obj['all_images'].concat(ret);
    shuffle(all_imgs);
    if (all_imgs.length > 50) {
      all_imgs = all_imgs.slice(0, 25);
    }
    storage_obj['all_images'] = all_imgs;
    settings.fromObject(storage_obj);
    if (storage_obj['all_images'].length === 25) {
      cb(); // or else wait
    }
  });
}

function make_vegas(elem, config_obj) {
  var slides = config_obj['all_images'],
      delay = parseInt(config_obj['delay']);

    console.log(config_obj)
  $(elem).vegas({
    timer: false,
    shuffle: true,
    preload: false,
    color: '#000',
    delay: delay,
    color: '#000',
    slides: slides,
    valign: 'top',
    transition: 'fade',
    transitionDuration: delay / 3,
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
}

$(function() {
  $('#credits-container').hide();
  if ($('body').length > 0) {
    var settings = new Store('settings', default_settings);
    var img_object = settings.toObject();
    get_and_store_images(img_object, settings, function() {
      make_vegas('body', img_object);  
    });
  }
})