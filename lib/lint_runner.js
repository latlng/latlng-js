/*jslint browser: true */

(function () {
  var i = 0, files, file, currentWindowOnload, request, options, doc;

  files  = [
    "lib/lint_runner.js",
    "lib/spec_runner.js",
    "spec/spec_helper.js",
    "spec/geo_spec.js",
    "spec/latlon_spec.js",
    "spec/sphere_spec.js",
    "spec/angle_spec.js",
    "src/geo.js",
    "src/latlon.js",
    "src/sphere.js",
    "src/angle.js"
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
    doc.innerHTML += "<h2>" + file + "</h2>";
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
        doc.innerHTML += '<p>Ok</p>';
      } else { // lint has errors.
        doc.innerHTML += JSLINT.report(true);
      }
      i += 1;
      if (i < files.length) {
        loadNext();
      } else {
        // all files ok.
        doc.innerHTML += '<a href="SpecRunner.html">Run Specs</a>';
      }
    }
  }

  window.onload = function () {
    doc = document.getElementById('lint_results');
    doc.innerHTML = '<h1>JSLint</h1>';
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    loadNext();
  };

}());

