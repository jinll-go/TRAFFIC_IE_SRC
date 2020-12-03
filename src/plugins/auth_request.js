//Jquery
//依赖<script type="text/javascript" src="public/js/core-min.js"></script>

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS =
    CryptoJS ||
    (function(h, r) {
        var k = {},
            l = (k.lib = {}),
            n = function() {},
            f = (l.Base = {
                extend: function(a) {
                    n.prototype = this;
                    var b = new n();
                    a && b.mixIn(a);
                    b.hasOwnProperty('init') ||
                        (b.init = function() {
                            b.$super.init.apply(this, arguments);
                        });
                    b.init.prototype = b;
                    b.$super = this;
                    return b;
                },
                create: function() {
                    var a = this.extend();
                    a.init.apply(a, arguments);
                    return a;
                },
                init: function() {},
                mixIn: function(a) {
                    for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
                    a.hasOwnProperty('toString') && (this.toString = a.toString);
                },
                clone: function() {
                    return this.init.prototype.extend(this);
                },
            }),
            j = (l.WordArray = f.extend({
                init: function(a, b) {
                    a = this.words = a || [];
                    this.sigBytes = b != r ? b : 4 * a.length;
                },
                toString: function(a) {
                    return (a || s).stringify(this);
                },
                concat: function(a) {
                    var b = this.words,
                        d = a.words,
                        c = this.sigBytes;
                    a = a.sigBytes;
                    this.clamp();
                    if (c % 4) for (var e = 0; e < a; e++) b[(c + e) >>> 2] |= ((d[e >>> 2] >>> (24 - 8 * (e % 4))) & 255) << (24 - 8 * ((c + e) % 4));
                    else if (65535 < d.length) for (e = 0; e < a; e += 4) b[(c + e) >>> 2] = d[e >>> 2];
                    else b.push.apply(b, d);
                    this.sigBytes += a;
                    return this;
                },
                clamp: function() {
                    var a = this.words,
                        b = this.sigBytes;
                    a[b >>> 2] &= 4294967295 << (32 - 8 * (b % 4));
                    a.length = h.ceil(b / 4);
                },
                clone: function() {
                    var a = f.clone.call(this);
                    a.words = this.words.slice(0);
                    return a;
                },
                random: function(a) {
                    for (var b = [], d = 0; d < a; d += 4) b.push((4294967296 * h.random()) | 0);
                    return new j.init(b, a);
                },
            })),
            m = (k.enc = {}),
            s = (m.Hex = {
                stringify: function(a) {
                    var b = a.words;
                    a = a.sigBytes;
                    for (var d = [], c = 0; c < a; c++) {
                        var e = (b[c >>> 2] >>> (24 - 8 * (c % 4))) & 255;
                        d.push((e >>> 4).toString(16));
                        d.push((e & 15).toString(16));
                    }
                    return d.join('');
                },
                parse: function(a) {
                    for (var b = a.length, d = [], c = 0; c < b; c += 2) d[c >>> 3] |= parseInt(a.substr(c, 2), 16) << (24 - 4 * (c % 8));
                    return new j.init(d, b / 2);
                },
            }),
            p = (m.Latin1 = {
                stringify: function(a) {
                    var b = a.words;
                    a = a.sigBytes;
                    for (var d = [], c = 0; c < a; c++) d.push(String.fromCharCode((b[c >>> 2] >>> (24 - 8 * (c % 4))) & 255));
                    return d.join('');
                },
                parse: function(a) {
                    for (var b = a.length, d = [], c = 0; c < b; c++) d[c >>> 2] |= (a.charCodeAt(c) & 255) << (24 - 8 * (c % 4));
                    return new j.init(d, b);
                },
            }),
            t = (m.Utf8 = {
                stringify: function(a) {
                    try {
                        return decodeURIComponent(escape(p.stringify(a)));
                    } catch (b) {
                        throw Error('Malformed UTF-8 data');
                    }
                },
                parse: function(a) {
                    return p.parse(unescape(encodeURIComponent(a)));
                },
            }),
            q = (l.BufferedBlockAlgorithm = f.extend({
                reset: function() {
                    this._data = new j.init();
                    this._nDataBytes = 0;
                },
                _append: function(a) {
                    'string' == typeof a && (a = t.parse(a));
                    this._data.concat(a);
                    this._nDataBytes += a.sigBytes;
                },
                _process: function(a) {
                    var b = this._data,
                        d = b.words,
                        c = b.sigBytes,
                        e = this.blockSize,
                        f = c / (4 * e),
                        f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0);
                    a = f * e;
                    c = h.min(4 * a, c);
                    if (a) {
                        for (var g = 0; g < a; g += e) this._doProcessBlock(d, g);
                        g = d.splice(0, a);
                        b.sigBytes -= c;
                    }
                    return new j.init(g, c);
                },
                clone: function() {
                    var a = f.clone.call(this);
                    a._data = this._data.clone();
                    return a;
                },
                _minBufferSize: 0,
            }));
        l.Hasher = q.extend({
            cfg: f.extend(),
            init: function(a) {
                this.cfg = this.cfg.extend(a);
                this.reset();
            },
            reset: function() {
                q.reset.call(this);
                this._doReset();
            },
            update: function(a) {
                this._append(a);
                this._process();
                return this;
            },
            finalize: function(a) {
                a && this._append(a);
                return this._doFinalize();
            },
            blockSize: 16,
            _createHelper: function(a) {
                return function(b, d) {
                    return new a.init(d).finalize(b);
                };
            },
            _createHmacHelper: function(a) {
                return function(b, d) {
                    return new u.HMAC.init(a, d).finalize(b);
                };
            },
        });
        var u = (k.algo = {});
        return k;
    })(Math);

//<script type="text/javascript" src="public/js/md5-min.js"></script>
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(E) {
    function h(a, f, g, j, p, h, k) {
        a = a + ((f & g) | (~f & j)) + p + k;
        return ((a << h) | (a >>> (32 - h))) + f;
    }
    function k(a, f, g, j, p, h, k) {
        a = a + ((f & j) | (g & ~j)) + p + k;
        return ((a << h) | (a >>> (32 - h))) + f;
    }
    function l(a, f, g, j, h, k, l) {
        a = a + (f ^ g ^ j) + h + l;
        return ((a << k) | (a >>> (32 - k))) + f;
    }
    function n(a, f, g, j, h, k, l) {
        a = a + (g ^ (f | ~j)) + h + l;
        return ((a << k) | (a >>> (32 - k))) + f;
    }
    for (var r = CryptoJS, q = r.lib, F = q.WordArray, s = q.Hasher, q = r.algo, a = [], t = 0; 64 > t; t++) a[t] = (4294967296 * E.abs(E.sin(t + 1))) | 0;
    q = q.MD5 = s.extend({
        _doReset: function() {
            this._hash = new F.init([1732584193, 4023233417, 2562383102, 271733878]);
        },
        _doProcessBlock: function(m, f) {
            for (var g = 0; 16 > g; g++) {
                var j = f + g,
                    p = m[j];
                m[j] = (((p << 8) | (p >>> 24)) & 16711935) | (((p << 24) | (p >>> 8)) & 4278255360);
            }
            var g = this._hash.words,
                j = m[f + 0],
                p = m[f + 1],
                q = m[f + 2],
                r = m[f + 3],
                s = m[f + 4],
                t = m[f + 5],
                u = m[f + 6],
                v = m[f + 7],
                w = m[f + 8],
                x = m[f + 9],
                y = m[f + 10],
                z = m[f + 11],
                A = m[f + 12],
                B = m[f + 13],
                C = m[f + 14],
                D = m[f + 15],
                b = g[0],
                c = g[1],
                d = g[2],
                e = g[3],
                b = h(b, c, d, e, j, 7, a[0]),
                e = h(e, b, c, d, p, 12, a[1]),
                d = h(d, e, b, c, q, 17, a[2]),
                c = h(c, d, e, b, r, 22, a[3]),
                b = h(b, c, d, e, s, 7, a[4]),
                e = h(e, b, c, d, t, 12, a[5]),
                d = h(d, e, b, c, u, 17, a[6]),
                c = h(c, d, e, b, v, 22, a[7]),
                b = h(b, c, d, e, w, 7, a[8]),
                e = h(e, b, c, d, x, 12, a[9]),
                d = h(d, e, b, c, y, 17, a[10]),
                c = h(c, d, e, b, z, 22, a[11]),
                b = h(b, c, d, e, A, 7, a[12]),
                e = h(e, b, c, d, B, 12, a[13]),
                d = h(d, e, b, c, C, 17, a[14]),
                c = h(c, d, e, b, D, 22, a[15]),
                b = k(b, c, d, e, p, 5, a[16]),
                e = k(e, b, c, d, u, 9, a[17]),
                d = k(d, e, b, c, z, 14, a[18]),
                c = k(c, d, e, b, j, 20, a[19]),
                b = k(b, c, d, e, t, 5, a[20]),
                e = k(e, b, c, d, y, 9, a[21]),
                d = k(d, e, b, c, D, 14, a[22]),
                c = k(c, d, e, b, s, 20, a[23]),
                b = k(b, c, d, e, x, 5, a[24]),
                e = k(e, b, c, d, C, 9, a[25]),
                d = k(d, e, b, c, r, 14, a[26]),
                c = k(c, d, e, b, w, 20, a[27]),
                b = k(b, c, d, e, B, 5, a[28]),
                e = k(e, b, c, d, q, 9, a[29]),
                d = k(d, e, b, c, v, 14, a[30]),
                c = k(c, d, e, b, A, 20, a[31]),
                b = l(b, c, d, e, t, 4, a[32]),
                e = l(e, b, c, d, w, 11, a[33]),
                d = l(d, e, b, c, z, 16, a[34]),
                c = l(c, d, e, b, C, 23, a[35]),
                b = l(b, c, d, e, p, 4, a[36]),
                e = l(e, b, c, d, s, 11, a[37]),
                d = l(d, e, b, c, v, 16, a[38]),
                c = l(c, d, e, b, y, 23, a[39]),
                b = l(b, c, d, e, B, 4, a[40]),
                e = l(e, b, c, d, j, 11, a[41]),
                d = l(d, e, b, c, r, 16, a[42]),
                c = l(c, d, e, b, u, 23, a[43]),
                b = l(b, c, d, e, x, 4, a[44]),
                e = l(e, b, c, d, A, 11, a[45]),
                d = l(d, e, b, c, D, 16, a[46]),
                c = l(c, d, e, b, q, 23, a[47]),
                b = n(b, c, d, e, j, 6, a[48]),
                e = n(e, b, c, d, v, 10, a[49]),
                d = n(d, e, b, c, C, 15, a[50]),
                c = n(c, d, e, b, t, 21, a[51]),
                b = n(b, c, d, e, A, 6, a[52]),
                e = n(e, b, c, d, r, 10, a[53]),
                d = n(d, e, b, c, y, 15, a[54]),
                c = n(c, d, e, b, p, 21, a[55]),
                b = n(b, c, d, e, w, 6, a[56]),
                e = n(e, b, c, d, D, 10, a[57]),
                d = n(d, e, b, c, u, 15, a[58]),
                c = n(c, d, e, b, B, 21, a[59]),
                b = n(b, c, d, e, s, 6, a[60]),
                e = n(e, b, c, d, z, 10, a[61]),
                d = n(d, e, b, c, q, 15, a[62]),
                c = n(c, d, e, b, x, 21, a[63]);
            g[0] = (g[0] + b) | 0;
            g[1] = (g[1] + c) | 0;
            g[2] = (g[2] + d) | 0;
            g[3] = (g[3] + e) | 0;
        },
        _doFinalize: function() {
            var a = this._data,
                f = a.words,
                g = 8 * this._nDataBytes,
                j = 8 * a.sigBytes;
            f[j >>> 5] |= 128 << (24 - (j % 32));
            var h = E.floor(g / 4294967296);
            f[(((j + 64) >>> 9) << 4) + 15] = (((h << 8) | (h >>> 24)) & 16711935) | (((h << 24) | (h >>> 8)) & 4278255360);
            f[(((j + 64) >>> 9) << 4) + 14] = (((g << 8) | (g >>> 24)) & 16711935) | (((g << 24) | (g >>> 8)) & 4278255360);
            a.sigBytes = 4 * (f.length + 1);
            this._process();
            a = this._hash;
            f = a.words;
            for (g = 0; 4 > g; g++) (j = f[g]), (f[g] = (((j << 8) | (j >>> 24)) & 16711935) | (((j << 24) | (j >>> 8)) & 4278255360));
            return a;
        },
        clone: function() {
            var a = s.clone.call(this);
            a._hash = this._hash.clone();
            return a;
        },
    });
    r.MD5 = s._createHelper(q);
    r.HmacMD5 = s._createHmacHelper(q);
})(Math);

//<script type="text/javascript" src="public/js/digestAuthRequest.js"></script>
// digest auth request
// by Jamie Perkins

(function(window) {
    var base64 = {};
    base64._keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    base64.decode = function(input) {
        var output = '',
            chr1,
            chr2,
            chr3,
            enc1,
            enc2,
            enc3,
            enc4,
            i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        while (i < input.length) {
            enc1 = base64._keyStr.indexOf(input.charAt(i++));
            enc2 = base64._keyStr.indexOf(input.charAt(i++));
            enc3 = base64._keyStr.indexOf(input.charAt(i++));
            enc4 = base64._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = base64._utf8_decode(output);
        return output;
    };

    base64.encode = function(input) {
        var output = '',
            chr1,
            chr2,
            chr3,
            enc1,
            enc2,
            enc3,
            enc4,
            i = 0;
        input = base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + base64._keyStr.charAt(enc1) + base64._keyStr.charAt(enc2) + base64._keyStr.charAt(enc3) + base64._keyStr.charAt(enc4);
        }
        return output;
    };

    // private method for UTF-8 encoding
    base64._utf8_encode = function(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };

    // private method for UTF-8 decoding
    base64._utf8_decode = function(utftext) {
        var string = '',
            i = 0,
            c = 0,
            c1 = 0,
            c2 = 0,
            c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    };

    window.base64 = base64;
})(window);

// dependent upon CryptoJS MD5 hashing:
// http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js

function digestAuthRequest(method, url, a, b, asyn, timeout) {
    var self = this;

    /* if (typeof CryptoJS === 'undefined' && typeof require === 'function') {
                  var CryptoJS = require('crypto-js');
                }*/

    if (!CryptoJS) CryptoJS = window.CryptoJS;

    this.scheme = null; // we just echo the scheme, to allow for 'Digest', 'X-Digest', 'JDigest' etc
    this.nonce = null; // server issued nonce
    this.realm = null; // server issued realm
    this.qop = null; // "quality of protection" - '' or 'auth' or 'auth-int'
    this.response = null; // hashed response to server challenge
    this.opaque = null; // hashed response to server challenge
    this.nc = 1; // nonce count - increments with each request used with the same nonce
    this.cnonce = null; // client nonce

    this.basic_auth = null;
    this.auth_type = null;
    this.fixIE = false; //是否发送fixIE头
    // settings
    this.timeout = timeout || 30000; // timeout
    this.loggingOn = false; // toggle console logging
    this.asyn = asyn;
    // determine if a post, so that request will send data
    this.post = false;
    if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
        this.post = true;
    }

    // start here
    // successFn - will be passed JSON data
    // errorFn - will be passed error status code
    // data - optional, for POSTS  must be JSON Format String
    function SetHeaderHashs(req) {
        if ($store.getters.hashs) {
            for (var hash in $store.getters.hashs) {
                if (hash && $store.getters.hashs[hash] != '') {
                    req.setRequestHeader(hash, $store.getters.hashs[hash]);
                }
            }
        }
   }
    //for digest
    this.request = function(successFn, errorFn, data) {
        // posts data as JSON if there is any
        if (data) {
            self.data = /*JSON.stringify*/ data;
        }
        self.successFn = successFn;
        self.errorFn = errorFn;

        //always send unathen reqest to test the server!
        self.makeUnauthenticatedRequest(self.data);
    };

    this.makeUnauthenticatedRequest = function(data) {
        self.firstRequest = new XMLHttpRequest();
        //传进来method如果是post而非POST，会导致digest验证 不一致，
        self.firstRequest.open(method.toUpperCase(), url, self.asyn);
        var timer;
        if (self.asyn) {
            /*
        //not all the ie support timeout property,so we use setTimeout instead.
                self.firstRequest.timeout = self.timeout;
        //handle timeout
                self.firstRequest.ontimeout = function() {
                self.log("request timeout!");
                self.firstRequest.onerror(0);
                }
                */

            timer = setTimeout(function() {
                clearTimeout(timer);
                self.firstRequest.abort();
                self.log('request timeout!');
                self.firstRequest.onerror(0);
            }, self.timeout);
        }
        // if we are posting, add appropriate headers
        if (self.post) {
            self.firstRequest.setRequestHeader('Content-type', 'application/json');
        } else {
            //
            self.firstRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }

        if (typeof $store.getters.SessionId == 'number' || $store.getters.SessionId.length) {
            self.firstRequest.setRequestHeader('CV-SESSION-ID', $store.getters.SessionId);
        }

        SetHeaderHashs(self.firstRequest);
        var responseHeaders = null;
        self.firstRequest.onreadystatechange = function() {
            var result;
            // 2: received headers,  3: loading, 4: done
            if (self.firstRequest.readyState === 2) {
            }
            if (self.firstRequest.readyState === 4) {
                //here,we got a serious bug with almostly all IE version!
                //when we use xmlHttpReauest do cross-domain post,IE treat the response http code 401 a Network Error!
                //we can't get 401 in (xhr.readyState == 4 && xhr.status == 401).
                //Fuck all IE!!
                //in our case,when fcgi is down,nginx is alive,we get 404
                //nginx is down,what ever fcgi server status, we get 502 bad gateway!
                //so we use ugly code below to solve this in our apps!

                clearTimeout(timer);

                var state = self.firstRequest.status;

                if (state === 200) {
                    //try to find custom headers
                    // get authenticate header
                    //var s_h = self.authenticatedRequest.getResponseHeader("S-HASH");
                    //var x_h = self.authenticatedRequest.getResponseHeader("X-HASH");
                    //var c_h = self.authenticatedRequest.getResponseHeader("C-HASH");
                    //we store it in the sessionStorage
                    /*if($store.getters.hashs && s_h && x_h && c_h){
                        $store.getters.hashs["S-HASH"] = s_h;
                        $store.getters.hashs["X-HASH"] = x_h;
                        $store.getters.hashs["C-HASH"] = c_h;
                    }*/

                    self.log('Authentication not required for ' + url);
                    if (self.firstRequest.responseText !== 'undefined') {
                        if (self.firstRequest.responseText.length > 0) {
                            // If JSON, parse and return object
                            if (self.isJson(self.firstRequest.responseText)) {
                                self.successFn(JSON.parse(self.firstRequest.responseText));
                            } else {
                                self.successFn(self.firstRequest.responseText);
                            }
                        }
                    } else {
                        self.successFn();
                    }
                } else if (state === 401) {
                    self.log('we Got 401 from ' + url);
                    responseHeaders = self.firstRequest.getAllResponseHeaders();
                    responseHeaders = responseHeaders.split('\n');
                    // get authenticate header
                    var digestHeaders;
                    for (var i = 0; i < responseHeaders.length; i++) {
                        if (responseHeaders[i].match(/www-authenticate/i) != null) {
                        //if (responseHeaders[i].match(/Authorization/i) != null) {    
                            digestHeaders = responseHeaders[i];
                        }
                    }

                    if (digestHeaders != null) {
                        // parse auth header and get digest auth keys
                        digestHeaders = digestHeaders.slice(digestHeaders.indexOf(':') + 1, -1);
                        digestHeaders = digestHeaders.split(',');
                        self.scheme = digestHeaders[0].split(' ')[1];
                        for (var i = 0; i < digestHeaders.length; i++) {
                            var equalIndex = digestHeaders[i].indexOf('='),
                                key = digestHeaders[i].substring(0, equalIndex),
                                val = digestHeaders[i].substring(equalIndex + 1);
                            val = val.replace(/['"]+/g, '');
                            // find realm
                            if (key.match(/realm/i) != null) {
                                self.realm = val;
                            }
                            // find nonce
                            if (key.match(/nonce/i) != null) {
                                self.nonce = val;
                            }
                            // find opaque
                            if (key.match(/opaque/i) != null) {
                                self.opaque = val;
                            }
                            // find QOP
                            if (key.match(/qop/i) != null) {
                                self.qop = val;
                            }
                        }
                        //we decides the auth type by the server responder header!
                        if (self.scheme == 'X-Basic') {
                            self.auth_type = 'basic';
                        } else if (self.scheme == 'X-Digest') {
                            self.auth_type = 'digest';
                        } else {
                            self.log('Error www-authenticate header info!None of Basic or Digest!');
                            return;
                        }

                        if (self.auth_type == 'digest') {
                            // client generated keys
                            self.cnonce = self.generateCnonce();
                            self.nc++;
                            // if logging, show headers received:
                            self.log('received headers:');
                            self.log('  realm: ' + self.realm);
                            self.log('  nonce: ' + self.nonce);
                            self.log('  opaque: ' + self.opaque);
                            self.log('  qop: ' + self.qop);
                        } else if (self.auth_type == 'basic') {
                        }

                        // now we can make an authenticated request
                        self.makeDigestAuthenticatedRequest();
                    } else {
                        self.log('we got 401,but none of Auth headers found!');
                    }
                } else {
                    if (self.firstRequest.status == state) {
                        self.errorFn(self.firstRequest.status);
                    } else {
                        self.errorFn(result.Status);
                    }
                    if (self.firstRequest.status == 403) {
                        //  window.top.location.href = window.location.protocol +"//"+window.top.location.host +"//public/msg.asp?s_type=3";
                    }
                }
            }
        };

        // handle error
        self.firstRequest.onerror = function() {
            if (self.firstRequest.readyState == 4) {
                //readyState == 4 时才能访问
                if (self.firstRequest.status !== 401) {
                    self.log('Error (' + self.firstRequest.status + ') on unauthenticated request to ' + url);
                    self.errorFn(self.firstRequest.status);
                }
            } else {
                self.errorFn(0);
            }
        };

        // send
        if (self.post) {
            // in case digest auth not required
            self.firstRequest.send(self.data);
        } else {
            self.firstRequest.send();
        }
        self.log('Unauthenticated request to ' + url);
    };
    //for digest
    this.makeDigestAuthenticatedRequest = function() {
        var digestAuthHeader = null;
        var timer;
        self.authenticatedRequest = new XMLHttpRequest();
        self.authenticatedRequest.open(method, url, self.asyn);
        if (self.asyn) {
            /*
                            self.authenticatedRequest.timeout = self.timeout;
                            //handle timeout
                            self.authenticatedRequest.ontimeout = function() {
                                self.log("request timeout!");
                                self.authenticatedRequest.onerror();
                            }*/
            timer = setTimeout(function() {
                clearTimeout(timer);
                self.authenticatedRequest.abort();
                self.log('request timeout!');
                self.authenticatedRequest.onerror();
            }, self.timeout);
        }
        SetHeaderHashs(self.authenticatedRequest);
        if (self.auth_type == 'digest') {
            self.response = self.formulateResponse();

            /*
                            对于中文名 IE直接使用utf-8的字符串
                            firefox chrome 使用unescape(encodeURIComponent(xxxx))
                            safari 暂未考虑
                            */
            var re_username = a;
            if (!window.ActiveXObject && 'ActiveXObject' in window) {
            } else {
                re_username = unescape(encodeURIComponent(a));
            }

            digestAuthHeader =
                self.scheme +
                ' ' +
                'username="' +
                re_username +
                '", ' +
                'realm="' +
                self.realm +
                '", ' +
                'nonce="' +
                self.nonce +
                '", ' +
                'uri="' +
                url +
                '", ' +
                'response="' +
                self.response +
                '", ' +
                'opaque="' +
                self.opaque +
                '", ' +
                'qop=' +
                self.qop +
                ', ' +
                'nc=' +
                ('00000000' + self.nc).slice(-8) +
                ', ' +
                'cnonce="' +
                self.cnonce +
                '"';
        } else if (self.auth_type == 'basic') {
            var secret = base64.encode(a + ':' + b).toString();
            digestAuthHeader = self.scheme + ' ' + secret;
        }

        /*extend for none ascii chars,eg:  GBK Unicode */
        self.authenticatedRequest.setRequestHeader('Authorization', digestAuthHeader);
        self.log('digest auth header response to be sent:');
        self.log(digestAuthHeader);
        // if we are posting, add appropriate headers
        if (self.post) {
            self.authenticatedRequest.setRequestHeader('Content-type', 'application/json;charset=utf-8');
        }

        if (typeof $store.getters.SessionId == 'number' || $store.getters.SessionId.length) {
            self.authenticatedRequest.setRequestHeader('CV-SESSION-ID', $store.getters.SessionId);
        }

        self.authenticatedRequest.onreadystatechange = function() {
            if (self.authenticatedRequest.readyState === 4) {
                clearTimeout(timer);
                // success
                if (self.authenticatedRequest.status >= 200 && self.authenticatedRequest.status < 400) {
                    // increment nonce count
                    if (self.auth_type == 'digest') self.nc++;

                    //try to find custom headers
                    // get authenticate header
                    var s_h = self.authenticatedRequest.getResponseHeader("S-HASH");
                    var x_h = self.authenticatedRequest.getResponseHeader("X-HASH");
                    var c_h = self.authenticatedRequest.getResponseHeader("C-HASH");
                    //we store it in the sessionStorage
                    if($store.getters.hashs && s_h && x_h && c_h){
                        $store.getters.hashs["S-HASH"] = s_h;
                        $store.getters.hashs["X-HASH"] = x_h;
                        $store.getters.hashs["C-HASH"] = c_h;
                    }

                    // return data
                    if (self.authenticatedRequest.responseText !== 'undefined') {
                        if (self.authenticatedRequest.responseText.length > 0) {
                            // If JSON, parse and return object
                            if (self.isJson(self.authenticatedRequest.responseText)) {
                                self.successFn(JSON.parse(self.authenticatedRequest.responseText));
                            } else {
                                self.successFn(self.authenticatedRequest.responseText);
                            }
                        }
                    } else {
                        self.successFn();
                    }
                }
                // failure
                else {
                    if (self.auth_type == 'digest') self.nonce = null;

                    if (self.authenticatedRequest.responseText.length > 0) {
                        // If JSON, parse and return object
                        if (self.isJson(self.authenticatedRequest.responseText)) {
                            self.errorFn(JSON.parse(self.authenticatedRequest.responseText));
                        } else {
                            self.errorFn(self.authenticatedRequest.responseText);
                        }
                    } else {
                        self.authenticatedRequest.onerror();
                    }
                }
            }
        };

        // handle errors
        self.authenticatedRequest.onerror = function() {
            if (self.authenticatedRequest.readyState == 4) {
                self.log('Error (' + self.authenticatedRequest.status + ') on authenticated request to ' + url);
                if (self.auth_type == 'digest') self.nonce = null;
                self.errorFn(self.authenticatedRequest.status);
            } else {
                self.errorFn(0);
            }
        };
        // send
        if (self.post) {
            self.authenticatedRequest.send(self.data);
        } else {
            self.authenticatedRequest.send();
        }
        self.log('Authenticated request to ' + url);
    };
    // hash response based on server challenge
    this.formulateResponse = function() {
        self.log(a + ':' + self.realm + ':' + b);
        var HA1 = CryptoJS.MD5(a + ':' + self.realm + ':' + b).toString();
        var HA2 = CryptoJS.MD5(method + ':' + url).toString();
        var response = CryptoJS.MD5(
            HA1 + ':' + self.nonce + ':' + ('00000000' + self.nc).slice(-8) + ':' + self.cnonce + ':' + self.qop + ':' + HA2,
        ).toString();
        return response;
    };
    // generate 16 char client nonce
    this.generateCnonce = function() {
        var characters = 'abcdef0123456789';
        var token = '';
        for (var i = 0; i < 16; i++) {
            var randNum = Math.round(Math.random() * characters.length);
            token += characters.substr(randNum, 1);
        }
        return token;
    };
    this.abort = function() {
        self.log('[digestAuthRequest] Aborted request to ' + url);
        if (self.firstRequest != null) {
            if (self.firstRequest.readyState != 4) self.firstRequest.abort();
        }
        if (self.authenticatedRequest != null) {
            if (self.authenticatedRequest.readyState != 4) self.authenticatedRequest.abort();
        }
    };
    this.isJson = function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };
    this.log = function(str) {
        if (self.loggingOn) {
            if (window.console) console.log('[digestAuthRequest] ' + str);
        }
    };
    this.version = function() {
        return '0.6.1';
    };

    if (typeof a == 'undefined') {
        a = $store.getters.tokenA;
    }
    if (typeof b == 'undefined') {
        b = $store.getters.tokenB;
    }
}

function http({ method, url, data, async, auth_type, username, pwd, successCb, errorCb, timeout } = {}) {
    data = data || null; //not json format,we will JSON it in requset method,it better be a js Object!
    if (typeof async == 'undefined') {
        async = true;
    }

    //config.url default to use DAA
    if (auth_type != 'basic' && auth_type != 'digest') {
        //       msg('[' + auth_type + '] is not Supported,use default none http auth!');
        auth_type = '';
    }
    if (auth_type) url = url.replace('goform', auth_type);

    //  if($store.getters.is_dongshun)url = url.replace(auth_type,"t8s");

    // create new digest request object
    // because method is different
    // otherwise we could re-use the first one
    method = method || 'GET';
    var postReq = new digestAuthRequest(method, url, username, pwd, async, timeout);

    postReq.request(successCb, errorCb, data);
}

let isInstalled = false;
let $store = null;

export default {
    install(Vue, store) {
        if (isInstalled) {
            return;
        }
        Vue.$auth_request = http;
        Vue.prototype.$auth_request = http;
        $store = store; //保存全局model的引用
        isInstalled = true;
    },
};
