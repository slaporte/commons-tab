var default_settings = {'delay': 15000,
                        'all_categories': 'Featured pictures of astronomy\nFeatured pictures of fish\nFeatured pictures of Charadriiformes\nFeatured pictures of Passeriformes\nFeatured pictures of Accipitriformes\nFeatured pictures of mammals\nFeatured pictures of architecture\nFeatured pictures of flowers\nFeatured pictures of landscapes\nFeatured night shots\nFeatured pictures of art\nFeatured maps\nFeatured pictures of lighthouses\nFeatured pictures of churches\nFeatured pictures of fortresses\nFeatured pictures of bridges\nFeatured pictures of the International Space Station\nFeatured pictures of rolling stock\nFeatured pictures of motorcycles\nFeatured pictures of ships\nFeatured pictures of aircraft\nPictures of the Year (2008)\nPictures of the Year (2009)\nPictures of the Year (2010)\nPictures of the Year (2011)\nPictures of the Year (2012)\nPictures of the Year (2013)'}

window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
        settings.manifest.reset.addEvent("action", function () {
            console.log('Resetting...');
            var settings = new Store("settings", default_settings);
            settings.fromObject(default_settings);
            location.reload();
        });
        settings.manifest.all_categories.addEvent("action", function (vals) {
            var port = chrome.runtime.connect({name: 'commons-tab'});
            port.postMessage({'reset': true});
        });
    });
});
