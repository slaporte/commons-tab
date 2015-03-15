// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

var settings = new Store("settings", default_settings);

var img_store = settings.toObject();
get_and_store_images(img_store, settings);

console.log(settings)

// //example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });