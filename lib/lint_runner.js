/*jslint browser: true */

(function () {
  var i = 0, files, file, currentWindowOnload, request, options;

  files  = [
    "lib/lint_runner.js",
    "lib/spec_runner.js",
    "spec/spec_helper.js",
    "spec/geo_spec.js",
    "src/geo.js",
    "src/latlon.js"
  ];

  options = {
    regexp: true,
    sloppy: true,
    indent: 2,
    maxlen: 80
  };

  currentWindowOnload = window.onload;

  function httpRequest() {
    /*global ActiveXObject */
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      return new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      return new ActiveXObject("Microsoft.XMLHTTP");
    }
  }

  request = httpRequest();

  function loadNext() {
    /*jslint undef: true */
    file = files[i];
    document.body.innerHTML += "<h2>" + file + "</h2>";
    request.onreadystatechange = onLoad;
    request.open("GET", file, true);
    request.send();
  }

  function onLoad() {
    /*global JSLINT */
    var result;
    if (request.readyState === 4 && request.status === 200) {
      if (JSLINT(request.responseText, options)) {
        // lint_ok
        document.body.innerHTML += '<p>Ok</p>';
      } else { // lint has errors.
        document.body.innerHTML += JSLINT.report(true);
      }
      i += 1;
      if (i < files.length) {
        loadNext();
      } else {
        // all files ok.
        document.body.innerHTML += '<a href="SpecRunner.html">Run Specs</a>';
      }
    }
  }

  window.onload = function () {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    document.body.innerHTML = '<h1>JSLint</h1>';
    loadNext();
  };

}());

