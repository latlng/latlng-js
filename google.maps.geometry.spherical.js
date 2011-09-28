:w
w
Object
Ee: function (a,b){var c=J(a.Ja),d=J(b.Ja);return 2*l[Dc](l[Db](l.pow(l.sin((c-d)/2),2)+l.cos(c)*l.cos(d)*l.pow(l.sin((J(a.Ka)-J(b.Ka))/2),2)))}
Mj: function (a,b,c){for(var d=[a,b,c,a],a=[],c=b=0;c<3;++c)a[c]=nx.Ee(d[c],d[c+1]),b+=a[c];b/=2;d=l.tan(b/2);for(c=0;c<3;++c)d*=l.tan((b-a[c])/2);return 4*l[pc](l[Db](l.abs(d)))}
Nj: function (a,b,c){a=[a,b,c];b=[];for(c=0;c<3;++c){var d=a[c],e=J(d.Ja),d=J(d.Ka),f=b[c]=[];f[0]=l.cos(e)*l.cos(d);f[1]=l.cos(e)*l.sin(d);f[2]=l.sin(e)}return b[0][0]*b[1][1]*b[2][2]+b[1][0]*b[2][1]*b[0][2]+b[2][0]*b[0][1]*b[1][2]-b[0][0]*b[2][1]*b[1][2]-b[1][0]*b[0][1]*b[2][2]-b[2][0]*b[1][1]*b[0][2]>0?1:-1}
Wj: function (a,b,c){return nx.Mj(a,b,c)*nx.Nj(a,b,c)}
computeArea: function (a,b){return l.abs(nx.computeSignedArea(a,b))}
computeDistanceBetween: function (a,b,c){return nx.Ee(a,b)*(c||6378137)}
computeHeading: function (a,b){var c=J(a.Ja),d=J(b.Ja),e=J(b.Ka)-J(a.Ka);return Dd(Fd(l[zb](l.sin(e)*l.cos(d),l.cos(c)*l.sin(d)-l.sin(c)*l.cos(d)*l.cos(e))),-180,180)}
computeLength: function (a,b){var c=b||6378137,d=0;a instanceof Lf&&(a=a[tc]());for(var e=0,f=a[y]-1;e<f;++e)d+=nx.computeDistanceBetween(a[e],a[e+1],c);return d}
computeOffset: function (a,b,c,d){b/=d||6378137;var c=J(c),e=J(a.Ja),d=l.cos(b),b=l.sin(b),f=l.sin(e),e=l.cos(e),g=d*f+b*e*l.cos(c);return new O(Fd(l[Dc](g)),Fd(J(a.Ka)+l[zb](b*e*l.sin(c),d-f*g)))}
computeSignedArea: function (a,b){var c=b||6378137;a instanceof Lf&&(a=a[tc]());for(var d=a[0],e=0,f=1,g=a[y]-1;f<g;++f)e+=nx.Wj(d,a[f],a[f+1]);return e*c*c}
interpolate: function (a,b,c){var d=J(a.Ja),e=J(a.Ka),f=J(b.Ja),g=J(b.Ka),h=l.cos(d),o=l.cos(f),b=nx.Ee(a,b),p=l.sin(b);if(p<1.0E-6)return new O(a.lat(),
__proto__: Object
