var default_settings = {'delay': 15000,
                        'all_categories': 'Featured pictures of astronomy\nFeatured pictures of fish\nFeatured pictures of Charadriiformes\nFeatured pictures of Passeriformes\nFeatured pictures of Accipitriformes\nFeatured pictures of mammals\nFeatured pictures of architecture\nFeatured pictures of flowers\nFeatured pictures of landscapes\nFeatured night shots\nFeatured pictures of art\nFeatured maps\nFeatured pictures of lighthouses\nFeatured pictures of churches\nFeatured pictures of fortresses\nFeatured pictures of bridges\nFeatured pictures of the International Space Station\nFeatured pictures of rolling stock\nFeatured pictures of motorcycles\nFeatured pictures of ships\nFeatured pictures of aircraft\nPictures of the Year (2008)\nPictures of the Year (2009)\nPictures of the Year (2010)\nPictures of the Year (2011)\nPictures of the Year (2012)\nPictures of the Year (2013)'}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function convert_image_base64(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    }

    img.src = url;
}

function get_random_category() {
  var store = new Store('settings', default_settings);
  var settings = store.toObject();
  var all_categories = settings['all_categories'].split('\n');
  var rand_index = Math.floor(Math.random() * all_categories.length);
  var category = all_categories[rand_index].replace(/ /g, '_');
  if (category.indexOf('Category:') < 0) {
    category = 'Category:' + category;
  }
  return category;
}

function get_image_infos() {
  var category = get_random_category();
  var url = 'https://commons.wikimedia.org/w/api.php';
  var params = {'action': 'query',
                'generator': 'categorymembers',
                'gcmtitle': category,
                'gcmsort': 'timestamp',
                'cmdir': 'desc',
                'gcmtype': 'file',
                'prop': 'imageinfo',
                'iiprop': 'url|user|extmetadata',
                'format': 'json',
                'gcmlimit': 100};
  var ajax_settings = {'dataType': 'jsonp',
                       'url': url,
                       'data': params}
  $.ajax(ajax_settings).done(function(data) {
    try {
      var images = data['query']['pages'];
      var ret = [];
      // TODO: Only need 10
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
                         'rights': rights});
          }
        }
      }
      ret = shuffle(ret);
      chrome.storage.sync.get('images', function(storage) {
        var all_image_infos = storage['images'] || [];
        all_image_infos = all_image_infos.concat(ret);
        chrome.storage.sync.set({'images': all_image_infos.slice(1, 10)});
      });
    } catch (e) {
      console.log(ajax_settings)
      console.log('Could not update the image list')
    }
  });
}

function store_next_image() {
  /**
  * 
  */
  chrome.storage.sync.get('images', function(storage) {
    var all_image_infos = storage['images'] || [];      
    var next_image_info = all_image_infos.shift();
    chrome.storage.sync.get('images', function(storage) {
      // Skip to the next image, in case Commons cannot generate a thumbnail
      chrome.storage.sync.set({'images': storage['images'].slice(1, 10)});
    });
    convert_image_base64(next_image_info['src'], function(image_data) {
      next_image_info['src'] = image_data;
      var more_images = all_image_infos.slice(0, 3);
      var slides = [next_image_info].concat(more_images)
      chrome.storage.local.set({'slides': slides});
      console.log('saved next image: ' + next_image_info['title'])
    });
  });
}

function _show_image_list() {
  chrome.storage.sync.get('images', function(storage) {
    all_image_infos = storage['images'];
    all_image_infos.map(function(info) {
      console.log(info['title'])
    })
  })
}

get_image_infos();
store_next_image();

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    if (msg.more) {
      get_image_infos();
      store_next_image();
    }
  });

});
