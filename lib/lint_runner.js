
(function() {
  var i = 0, files, file, currentWindowOnload, request, options;

  files  = [ 
    "spec/SpecHelper.js", 
    "spec/PlayerSpec.js",
    "src/Player.js",
    "src/Song.js"
  ];

  options = {};

  currentWindowOnload = window.onload;

  function httpRequest() {
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      return new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      return new ActiveXObject("Microsoft.XMLHTTP");
    }
  }

  request = httpRequest();

  function onLoad() {
    var result;
    if (request.readyState == 4 && request.status == 200) {
      if (JSLINT(request.responseText, options)) {
        // lint_ok
        i += 1;
        if (i < files.length) {
          loadNext();
        } else {
          // all files ok.
        }
      } else { // lint has errors.
        document.body.innerHTML = "<h1>JsLint: " + file + "</h1>" + JSLINT.report(true);
      }
    }
  }

  function loadNext() {
    file = files[i];
    request.onreadystatechange = onLoad;
    request.open("GET", file, true);
    request.send()
  }



  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    loadNext();
  };

})();

