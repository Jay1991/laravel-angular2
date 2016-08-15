'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
function convertUrlParamsToArray(urlParams) {
    var paramsArray = [];
    if (lang_1.isBlank(urlParams)) {
        return [];
    }
    collection_1.StringMapWrapper.forEach(urlParams, function (value, key) { paramsArray.push((value === true) ? key : key + '=' + value); });
    return paramsArray;
}
exports.convertUrlParamsToArray = convertUrlParamsToArray;
// Convert an object of url parameters into a string that can be used in an URL
function serializeParams(urlParams, joiner) {
    if (joiner === void 0) { joiner = '&'; }
    return convertUrlParamsToArray(urlParams).join(joiner);
}
exports.serializeParams = serializeParams;
/**
 * This class represents a parsed URL
 */
var Url = (function () {
    function Url(path, child, auxiliary, params) {
        if (child === void 0) { child = null; }
        if (auxiliary === void 0) { auxiliary = lang_1.CONST_EXPR([]); }
        if (params === void 0) { params = lang_1.CONST_EXPR({}); }
        this.path = path;
        this.child = child;
        this.auxiliary = auxiliary;
        this.params = params;
    }
    Url.prototype.toString = function () {
        return this.path + this._matrixParamsToString() + this._auxToString() + this._childString();
    };
    Url.prototype.segmentToString = function () { return this.path + this._matrixParamsToString(); };
    /** @internal */
    Url.prototype._auxToString = function () {
        return this.auxiliary.length > 0 ?
            ('(' + this.auxiliary.map(function (sibling) { return sibling.toString(); }).join('//') + ')') :
            '';
    };
    Url.prototype._matrixParamsToString = function () {
        var paramString = serializeParams(this.params, ';');
        if (paramString.length > 0) {
            return ';' + paramString;
        }
        return '';
    };
    /** @internal */
    Url.prototype._childString = function () { return lang_1.isPresent(this.child) ? ('/' + this.child.toString()) : ''; };
    return Url;
})();
exports.Url = Url;
var RootUrl = (function (_super) {
    __extends(RootUrl, _super);
    function RootUrl(path, child, auxiliary, params) {
        if (child === void 0) { child = null; }
        if (auxiliary === void 0) { auxiliary = lang_1.CONST_EXPR([]); }
        if (params === void 0) { params = null; }
        _super.call(this, path, child, auxiliary, params);
    }
    RootUrl.prototype.toString = function () {
        return this.path + this._auxToString() + this._childString() + this._queryParamsToString();
    };
    RootUrl.prototype.segmentToString = function () { return this.path + this._queryParamsToString(); };
    RootUrl.prototype._queryParamsToString = function () {
        if (lang_1.isBlank(this.params)) {
            return '';
        }
        return '?' + serializeParams(this.params);
    };
    return RootUrl;
})(Url);
exports.RootUrl = RootUrl;
function pathSegmentsToUrl(pathSegments) {
    var url = new Url(pathSegments[pathSegments.length - 1]);
    for (var i = pathSegments.length - 2; i >= 0; i -= 1) {
        url = new Url(pathSegments[i], url);
    }
    return url;
}
exports.pathSegmentsToUrl = pathSegmentsToUrl;
var SEGMENT_RE = lang_1.RegExpWrapper.create('^[^\\/\\(\\)\\?;=&#]+');
function matchUrlSegment(str) {
    var match = lang_1.RegExpWrapper.firstMatch(SEGMENT_RE, str);
    return lang_1.isPresent(match) ? match[0] : '';
}
var UrlParser = (function () {
    function UrlParser() {
    }
    UrlParser.prototype.peekStartsWith = function (str) { return this._remaining.startsWith(str); };
    UrlParser.prototype.capture = function (str) {
        if (!this._remaining.startsWith(str)) {
            throw new exceptions_1.BaseException("Expected \"" + str + "\".");
        }
        this._remaining = this._remaining.substring(str.length);
    };
    UrlParser.prototype.parse = function (url) {
        this._remaining = url;
        if (url == '' || url == '/') {
            return new Url('');
        }
        return this.parseRoot();
    };
    // segment + (aux segments) + (query params)
    UrlParser.prototype.parseRoot = function () {
        if (this.peekStartsWith('/')) {
            this.capture('/');
        }
        var path = matchUrlSegment(this._remaining);
        this.capture(path);
        var aux = [];
        if (this.peekStartsWith('(')) {
            aux = this.parseAuxiliaryRoutes();
        }
        if (this.peekStartsWith(';')) {
            // TODO: should these params just be dropped?
            this.parseMatrixParams();
        }
        var child = null;
        if (this.peekStartsWith('/') && !this.peekStartsWith('//')) {
            this.capture('/');
            child = this.parseSegment();
        }
        var queryParams = null;
        if (this.peekStartsWith('?')) {
            queryParams = this.parseQueryParams();
        }
        return new RootUrl(path, child, aux, queryParams);
    };
    // segment + (matrix params) + (aux segments)
    UrlParser.prototype.parseSegment = function () {
        if (this._remaining.length == 0) {
            return null;
        }
        if (this.peekStartsWith('/')) {
            this.capture('/');
        }
        var path = matchUrlSegment(this._remaining);
        this.capture(path);
        var matrixParams = null;
        if (this.peekStartsWith(';')) {
            matrixParams = this.parseMatrixParams();
        }
        var aux = [];
        if (this.peekStartsWith('(')) {
            aux = this.parseAuxiliaryRoutes();
        }
        var child = null;
        if (this.peekStartsWith('/') && !this.peekStartsWith('//')) {
            this.capture('/');
            child = this.parseSegment();
        }
        return new Url(path, child, aux, matrixParams);
    };
    UrlParser.prototype.parseQueryParams = function () {
        var params = {};
        this.capture('?');
        this.parseParam(params);
        while (this._remaining.length > 0 && this.peekStartsWith('&')) {
            this.capture('&');
            this.parseParam(params);
        }
        return params;
    };
    UrlParser.prototype.parseMatrixParams = function () {
        var params = {};
        while (this._remaining.length > 0 && this.peekStartsWith(';')) {
            this.capture(';');
            this.parseParam(params);
        }
        return params;
    };
    UrlParser.prototype.parseParam = function (params) {
        var key = matchUrlSegment(this._remaining);
        if (lang_1.isBlank(key)) {
            return;
        }
        this.capture(key);
        var value = true;
        if (this.peekStartsWith('=')) {
            this.capture('=');
            var valueMatch = matchUrlSegment(this._remaining);
            if (lang_1.isPresent(valueMatch)) {
                value = valueMatch;
                this.capture(value);
            }
        }
        params[key] = value;
    };
    UrlParser.prototype.parseAuxiliaryRoutes = function () {
        var routes = [];
        this.capture('(');
        while (!this.peekStartsWith(')') && this._remaining.length > 0) {
            routes.push(this.parseSegment());
            if (this.peekStartsWith('//')) {
                this.capture('//');
            }
        }
        this.capture(')');
        return routes;
    };
    return UrlParser;
})();
exports.UrlParser = UrlParser;
exports.parser = new UrlParser();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9yb3V0ZXIvdXJsX3BhcnNlci50cyJdLCJuYW1lcyI6WyJjb252ZXJ0VXJsUGFyYW1zVG9BcnJheSIsInNlcmlhbGl6ZVBhcmFtcyIsIlVybCIsIlVybC5jb25zdHJ1Y3RvciIsIlVybC50b1N0cmluZyIsIlVybC5zZWdtZW50VG9TdHJpbmciLCJVcmwuX2F1eFRvU3RyaW5nIiwiVXJsLl9tYXRyaXhQYXJhbXNUb1N0cmluZyIsIlVybC5fY2hpbGRTdHJpbmciLCJSb290VXJsIiwiUm9vdFVybC5jb25zdHJ1Y3RvciIsIlJvb3RVcmwudG9TdHJpbmciLCJSb290VXJsLnNlZ21lbnRUb1N0cmluZyIsIlJvb3RVcmwuX3F1ZXJ5UGFyYW1zVG9TdHJpbmciLCJwYXRoU2VnbWVudHNUb1VybCIsIm1hdGNoVXJsU2VnbWVudCIsIlVybFBhcnNlciIsIlVybFBhcnNlci5jb25zdHJ1Y3RvciIsIlVybFBhcnNlci5wZWVrU3RhcnRzV2l0aCIsIlVybFBhcnNlci5jYXB0dXJlIiwiVXJsUGFyc2VyLnBhcnNlIiwiVXJsUGFyc2VyLnBhcnNlUm9vdCIsIlVybFBhcnNlci5wYXJzZVNlZ21lbnQiLCJVcmxQYXJzZXIucGFyc2VRdWVyeVBhcmFtcyIsIlVybFBhcnNlci5wYXJzZU1hdHJpeFBhcmFtcyIsIlVybFBhcnNlci5wYXJzZVBhcmFtIiwiVXJsUGFyc2VyLnBhcnNlQXV4aWxpYXJ5Um91dGVzIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJCQUErQixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ2hFLHFCQUE0RCwwQkFBMEIsQ0FBQyxDQUFBO0FBQ3ZGLDJCQUE4QyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBRS9FLGlDQUF3QyxTQUErQjtJQUNyRUEsSUFBSUEsV0FBV0EsR0FBR0EsRUFBRUEsQ0FBQ0E7SUFDckJBLEVBQUVBLENBQUNBLENBQUNBLGNBQU9BLENBQUNBLFNBQVNBLENBQUNB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LEdBQUdBLENBQUNBLENBQUNBO1FBRWxCQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUMvREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDakNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM5QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDckJBLENBQUNBO1FBQ0hBLENBQUNBO1FBQ0RBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBRWxCQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFDSFYsZ0JBQUNBO0FBQURBLENBQUNBLEFBaElELElBZ0lDO0FBaElZLGlCQUFTLFlBZ0lyQixDQUFBO0FBRVUsY0FBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1N0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge2lzUHJlc2VudCwgaXNCbGFuaywgUmVnRXhwV3JhcHBlciwgQ09OU1RfRVhQUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgV3JhcHBlZEV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRVcmxQYXJhbXNUb0FycmF5KHVybFBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0pOiBzdHJpbmdbXSB7XG4gIHZhciBwYXJhbXNBcnJheSA9IFtdO1xuICBpZiAoaXNCbGFuayh1cmxQYXJhbXMpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChcbiAgICAgIHVybFBhcmFtcywgKHZhbHVlLCBrZXkpID0+IHsgcGFyYW1zQXJyYXkucHVzaCgodmFsdWUgPT09IHRydWUpID8ga2V5IDoga2V5ICsgJz0nICsgdmFsdWUpOyB9KTtcbiAgcmV0dXJuIHBhcmFtc0FycmF5O1xufVxuXG4vLyBDb252ZXJ0IGFuIG9iamVjdCBvZiB1cmwgcGFyYW1ldGVycyBpbnRvIGEgc3RyaW5nIHRoYXQgY2FuIGJlIHVzZWQgaW4gYW4gVVJMXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplUGFyYW1zKHVybFBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0sIGpvaW5lciA9ICcmJyk6IHN0cmluZyB7XG4gIHJldHVybiBjb252ZXJ0VXJsUGFyYW1zVG9BcnJheSh1cmxQYXJhbXMpLmpvaW4oam9pbmVyKTtcbn1cblxuLyoqXG4gKiBUaGlzIGNsYXNzIHJlcHJlc2VudHMgYSBwYXJzZWQgVVJMXG4gKi9cbmV4cG9ydCBjbGFzcyBVcmwge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF0aDogc3RyaW5nLCBwdWJsaWMgY2hpbGQ6IFVybCA9IG51bGwsXG4gICAgICAgICAgICAgIHB1YmxpYyBhdXhpbGlhcnk6IFVybFtdID0gQ09OU1RfRVhQUihbXSksXG4gICAgICAgICAgICAgIHB1YmxpYyBwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0gQ09OU1RfRVhQUih7fSkpIHt9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYXRoICsgdGhpcy5fbWF0cml4UGFyYW1zVG9TdHJpbmcoKSArIHRoaXMuX2F1eFRvU3RyaW5nKCkgKyB0aGlzLl9jaGlsZFN0cmluZygpO1xuICB9XG5cbiAgc2VnbWVudFRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnBhdGggKyB0aGlzLl9tYXRyaXhQYXJhbXNUb1N0cmluZygpOyB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYXV4VG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hdXhpbGlhcnkubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICAgICAoJygnICsgdGhpcy5hdXhpbGlhcnkubWFwKHNpYmxpbmcgPT4gc2libGluZy50b1N0cmluZygpKS5qb2luKCcvLycpICsgJyknKSA6XG4gICAgICAgICAgICAgICAnJztcbiAgfVxuXG4gIHByaXZhdGUgX21hdHJpeFBhcmFtc1RvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgdmFyIHBhcmFtU3RyaW5nID0gc2VyaWFsaXplUGFyYW1zKHRoaXMucGFyYW1zLCAnOycpO1xuICAgIGlmIChwYXJhbVN0cmluZy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gJzsnICsgcGFyYW1TdHJpbmc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NoaWxkU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiBpc1ByZXNlbnQodGhpcy5jaGlsZCkgPyAoJy8nICsgdGhpcy5jaGlsZC50b1N0cmluZygpKSA6ICcnOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb290VXJsIGV4dGVuZHMgVXJsIHtcbiAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBjaGlsZDogVXJsID0gbnVsbCwgYXV4aWxpYXJ5OiBVcmxbXSA9IENPTlNUX0VYUFIoW10pLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0gbnVsbCkge1xuICAgIHN1cGVyKHBhdGgsIGNoaWxkLCBhdXhpbGlhcnksIHBhcmFtcyk7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBhdGggKyB0aGlzLl9hdXhUb1N0cmluZygpICsgdGhpcy5fY2hpbGRTdHJpbmcoKSArIHRoaXMuX3F1ZXJ5UGFyYW1zVG9TdHJpbmcoKTtcbiAgfVxuXG4gIHNlZ21lbnRUb1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wYXRoICsgdGhpcy5fcXVlcnlQYXJhbXNUb1N0cmluZygpOyB9XG5cbiAgcHJpdmF0ZSBfcXVlcnlQYXJhbXNUb1N0cmluZygpOiBzdHJpbmcge1xuICAgIGlmIChpc0JsYW5rKHRoaXMucGFyYW1zKSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiAnPycgKyBzZXJpYWxpemVQYXJhbXModGhpcy5wYXJhbXMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRoU2VnbWVudHNUb1VybChwYXRoU2VnbWVudHM6IHN0cmluZ1tdKTogVXJsIHtcbiAgdmFyIHVybCA9IG5ldyBVcmwocGF0aFNlZ21lbnRzW3BhdGhTZWdtZW50cy5sZW5ndGggLSAxXSk7XG4gIGZvciAodmFyIGkgPSBwYXRoU2VnbWVudHMubGVuZ3RoIC0gMjsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICB1cmwgPSBuZXcgVXJsKHBhdGhTZWdtZW50c1tpXSwgdXJsKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufVxuXG52YXIgU0VHTUVOVF9SRSA9IFJlZ0V4cFdyYXBwZXIuY3JlYXRlKCdeW15cXFxcL1xcXFwoXFxcXClcXFxcPzs9JiNdKycpO1xuZnVuY3Rpb24gbWF0Y2hVcmxTZWdtZW50KHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgdmFyIG1hdGNoID0gUmVnRXhwV3JhcHBlci5maXJzdE1hdGNoKFNFR01FTlRfUkUsIHN0cik7XG4gIHJldHVybiBpc1ByZXNlbnQobWF0Y2gpID8gbWF0Y2hbMF0gOiAnJztcbn1cblxuZXhwb3J0IGNsYXNzIFVybFBhcnNlciB7XG4gIHByaXZhdGUgX3JlbWFpbmluZzogc3RyaW5nO1xuXG4gIHBlZWtTdGFydHNXaXRoKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZW1haW5pbmcuc3RhcnRzV2l0aChzdHIpOyB9XG5cbiAgY2FwdHVyZShzdHI6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fcmVtYWluaW5nLnN0YXJ0c1dpdGgoc3RyKSkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYEV4cGVjdGVkIFwiJHtzdHJ9XCIuYCk7XG4gICAgfVxuICAgIHRoaXMuX3JlbWFpbmluZyA9IHRoaXMuX3JlbWFpbmluZy5zdWJzdHJpbmcoc3RyLmxlbmd0aCk7XG4gIH1cblxuICBwYXJzZSh1cmw6IHN0cmluZyk6IFVybCB7XG4gICAgdGhpcy5fcmVtYWluaW5nID0gdXJsO1xuICAgIGlmICh1cmwgPT0gJycgfHwgdXJsID09ICcvJykge1xuICAgICAgcmV0dXJuIG5ldyBVcmwoJycpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wYXJzZVJvb3QoKTtcbiAgfVxuXG4gIC8vIHNlZ21lbnQgKyAoYXV4IHNlZ21lbnRzKSArIChxdWVyeSBwYXJhbXMpXG4gIHBhcnNlUm9vdCgpOiBSb290VXJsIHtcbiAgICBpZiAodGhpcy5wZWVrU3RhcnRzV2l0aCgnLycpKSB7XG4gICAgICB0aGlzLmNhcHR1cmUoJy8nKTtcbiAgICB9XG4gICAgdmFyIHBhdGggPSBtYXRjaFVybFNlZ21lbnQodGhpcy5fcmVtYWluaW5nKTtcbiAgICB0aGlzLmNhcHR1cmUocGF0aCk7XG5cbiAgICB2YXIgYXV4OiBVcmxbXSA9IFtdO1xuICAgIGlmICh0aGlzLnBlZWtTdGFydHNXaXRoKCcoJykpIHtcbiAgICAgIGF1eCA9IHRoaXMucGFyc2VBdXhpbGlhcnlSb3V0ZXMoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGVla1N0YXJ0c1dpdGgoJzsnKSkge1xuICAgICAgLy8gVE9ETzogc2hvdWxkIHRoZXNlIHBhcmFtcyBqdXN0IGJlIGRyb3BwZWQ/XG4gICAgICB0aGlzLnBhcnNlTWF0cml4UGFyYW1zKCk7XG4gICAgfVxuICAgIHZhciBjaGlsZCA9IG51bGw7XG4gICAgaWYgKHRoaXMucGVla1N0YXJ0c1dpdGgoJy8nKSAmJiAhdGhpcy5wZWVrU3RhcnRzV2l0aCgnLy8nKSkge1xuICAgICAgdGhpcy5jYXB0dXJlKCcvJyk7XG4gICAgICBjaGlsZCA9IHRoaXMucGFyc2VTZWdtZW50KCk7XG4gICAgfVxuICAgIHZhciBxdWVyeVBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0gPSBudWxsO1xuICAgIGlmICh0aGlzLnBlZWtTdGFydHNXaXRoKCc/JykpIHtcbiAgICAgIHF1ZXJ5UGFyYW1zID0gdGhpcy5wYXJzZVF1ZXJ5UGFyYW1zKCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUm9vdFVybChwYXRoLCBjaGlsZCwgYXV4LCBxdWVyeVBhcmFtcyk7XG4gIH1cblxuICAvLyBzZWdtZW50ICsgKG1hdHJpeCBwYXJhbXMpICsgKGF1eCBzZWdtZW50cylcbiAgcGFyc2VTZWdtZW50KCk6IFVybCB7XG4gICAgaWYgKHRoaXMuX3JlbWFpbmluZy5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLnBlZWtTdGFydHNXaXRoKCcvJykpIHtcbiAgICAgIHRoaXMuY2FwdHVyZSgnLycpO1xuICAgIH1cbiAgICB2YXIgcGF0aCA9IG1hdGNoVXJsU2VnbWVudCh0aGlzLl9yZW1haW5pbmcpO1xuICAgIHRoaXMuY2FwdHVyZShwYXRoKTtcblxuICAgIHZhciBtYXRyaXhQYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0gbnVsbDtcbiAgICBpZiAodGhpcy5wZWVrU3RhcnRzV2l0aCgnOycpKSB7XG4gICAgICBtYXRyaXhQYXJhbXMgPSB0aGlzLnBhcnNlTWF0cml4UGFyYW1zKCk7XG4gICAgfVxuICAgIHZhciBhdXg6IFVybFtdID0gW107XG4gICAgaWYgKHRoaXMucGVla1N0YXJ0c1dpdGgoJygnKSkge1xuICAgICAgYXV4ID0gdGhpcy5wYXJzZUF1eGlsaWFyeVJvdXRlcygpO1xuICAgIH1cbiAgICB2YXIgY2hpbGQ6IFVybCA9IG51bGw7XG4gICAgaWYgKHRoaXMucGVla1N0YXJ0c1dpdGgoJy8nKSAmJiAhdGhpcy5wZWVrU3RhcnRzV2l0aCgnLy8nKSkge1xuICAgICAgdGhpcy5jYXB0dXJlKCcvJyk7XG4gICAgICBjaGlsZCA9IHRoaXMucGFyc2VTZWdtZW50KCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVXJsKHBhdGgsIGNoaWxkLCBhdXgsIG1hdHJpeFBhcmFtcyk7XG4gIH1cblxuICBwYXJzZVF1ZXJ5UGFyYW1zKCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgICB2YXIgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHt9O1xuICAgIHRoaXMuY2FwdHVyZSgnPycpO1xuICAgIHRoaXMucGFyc2VQYXJhbShwYXJhbXMpO1xuICAgIHdoaWxlICh0aGlzLl9yZW1haW5pbmcubGVuZ3RoID4gMCAmJiB0aGlzLnBlZWtTdGFydHNXaXRoKCcmJykpIHtcbiAgICAgIHRoaXMuY2FwdHVyZSgnJicpO1xuICAgICAgdGhpcy5wYXJzZVBhcmFtKHBhcmFtcyk7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cblxuICBwYXJzZU1hdHJpeFBhcmFtcygpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgdmFyIHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgICB3aGlsZSAodGhpcy5fcmVtYWluaW5nLmxlbmd0aCA+IDAgJiYgdGhpcy5wZWVrU3RhcnRzV2l0aCgnOycpKSB7XG4gICAgICB0aGlzLmNhcHR1cmUoJzsnKTtcbiAgICAgIHRoaXMucGFyc2VQYXJhbShwYXJhbXMpO1xuICAgIH1cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9XG5cbiAgcGFyc2VQYXJhbShwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogdm9pZCB7XG4gICAgdmFyIGtleSA9IG1hdGNoVXJsU2VnbWVudCh0aGlzLl9yZW1haW5pbmcpO1xuICAgIGlmIChpc0JsYW5rKGtleSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jYXB0dXJlKGtleSk7XG4gICAgdmFyIHZhbHVlOiBhbnkgPSB0cnVlO1xuICAgIGlmICh0aGlzLnBlZWtTdGFydHNXaXRoKCc9JykpIHtcbiAgICAgIHRoaXMuY2FwdHVyZSgnPScpO1xuICAgICAgdmFyIHZhbHVlTWF0Y2ggPSBtYXRjaFVybFNlZ21lbnQodGhpcy5fcmVtYWluaW5nKTtcbiAgICAgIGlmIChpc1ByZXNlbnQodmFsdWVNYXRjaCkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZU1hdGNoO1xuICAgICAgICB0aGlzLmNhcHR1cmUodmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBhcmFtc1trZXldID0gdmFsdWU7XG4gIH1cblxuICBwYXJzZUF1eGlsaWFyeVJvdXRlcygpOiBVcmxbXSB7XG4gICAgdmFyIHJvdXRlczogVXJsW10gPSBbXTtcbiAgICB0aGlzLmNhcHR1cmUoJygnKTtcblxuICAgIHdoaWxlICghdGhpcy5wZWVrU3RhcnRzV2l0aCgnKScpICYmIHRoaXMuX3JlbWFpbmluZy5sZW5ndGggPiAwKSB7XG4gICAgICByb3V0ZXMucHVzaCh0aGlzLnBhcnNlU2VnbWVudCgpKTtcbiAgICAgIGlmICh0aGlzLnBlZWtTdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgIHRoaXMuY2FwdHVyZSgnLy8nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jYXB0dXJlKCcpJyk7XG5cbiAgICByZXR1cm4gcm91dGVzO1xuICB9XG59XG5cbmV4cG9ydCB2YXIgcGFyc2VyID0gbmV3IFVybFBhcnNlcigpO1xuIl19