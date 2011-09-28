/*
*  Geodesy representation conversion functions (c) Chris Veness 2002 - 2010
*   - www.movable - type.co.uk/scripts/latlong.html
*
*  Sample usage:
*    var lat = Geo.parseDMS('51° 28′ 40.12″ N');
*    var lon = Geo.parseDMS('000° 00′ 05.31″ W');
*    var p1 = new LatLon(lat, lon);
*/

var Geo = {};  // Geo namespace, representing static class
/* ----------------------------------------------- */
