// Last user agents: https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome
// API: https://developers.whatismybrowser.com/api/docs/v3/
// "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"

export const services = {
  baseURI: "https://web.whatsapp.com/",
  desktopModeJavaScript: `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0');
  meta.setAttribute('name', 'viewport');
  document.getElementsByTagName('head')[0].appendChild(meta);

  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
  
  //window.postMessage("Test notification", "*");

  // to download files
  window.downloadFile = function(url) {
    window.ReactNativeWebView.postMessage(url);
  };

  // this function makes the download possible
  window.saveFile = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = 'image.png';
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    }
    xhr.send();
  };

  // 
  `,
  userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  waDomains: ["web.whatsapp.com"],
  waUris: ["https://web.whatsapp.com/", "https://whatsapp.com/"],
};

export const colors = {
  tealGreen: "#128C7E",
  tealGreenDark: "#075E54",
  lightGreen: "#25D366",
  blue: "#34B7F1",
};
