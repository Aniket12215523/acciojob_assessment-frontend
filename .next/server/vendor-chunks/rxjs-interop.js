"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/rxjs-interop";
exports.ids = ["vendor-chunks/rxjs-interop"];
exports.modules = {

/***/ "(ssr)/./node_modules/rxjs-interop/dist/esm/patch.js":
/*!*****************************************************!*\
  !*** ./node_modules/rxjs-interop/dist/esm/patch.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patch: () => (/* binding */ patch)\n/* harmony export */ });\n/* harmony import */ var _symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./symbols */ \"(ssr)/./node_modules/rxjs-interop/dist/esm/symbols.js\");\n\r\nfunction patch(arg) {\r\n    if (!Symbol.observable) {\r\n        if (typeof arg === \"function\" &&\r\n            arg.prototype &&\r\n            arg.prototype[Symbol.observable]) {\r\n            arg.prototype[_symbols__WEBPACK_IMPORTED_MODULE_0__.observable] = arg.prototype[Symbol.observable];\r\n            delete arg.prototype[Symbol.observable];\r\n        }\r\n        else {\r\n            arg[_symbols__WEBPACK_IMPORTED_MODULE_0__.observable] = arg[Symbol.observable];\r\n            delete arg[Symbol.observable];\r\n        }\r\n    }\r\n    return arg;\r\n}\r\n//# sourceMappingURL=patch.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcnhqcy1pbnRlcm9wL2Rpc3QvZXNtL3BhdGNoLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQXVDO0FBQ2hDO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsZ0RBQVU7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGdEQUFVO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFw5MTc5OVxcT25lRHJpdmVcXERlc2t0b3BcXGFjY2lvam9iIGFzc2VzbWVudFxcY29tcG9uZW50LWNyYWZ0ZXJcXGZyb250ZW5kXFxub2RlX21vZHVsZXNcXHJ4anMtaW50ZXJvcFxcZGlzdFxcZXNtXFxwYXRjaC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBvYnNlcnZhYmxlIH0gZnJvbSBcIi4vc3ltYm9sc1wiO1xyXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2goYXJnKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5vYnNlcnZhYmxlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG4gICAgICAgICAgICBhcmcucHJvdG90eXBlICYmXHJcbiAgICAgICAgICAgIGFyZy5wcm90b3R5cGVbU3ltYm9sLm9ic2VydmFibGVdKSB7XHJcbiAgICAgICAgICAgIGFyZy5wcm90b3R5cGVbb2JzZXJ2YWJsZV0gPSBhcmcucHJvdG90eXBlW1N5bWJvbC5vYnNlcnZhYmxlXTtcclxuICAgICAgICAgICAgZGVsZXRlIGFyZy5wcm90b3R5cGVbU3ltYm9sLm9ic2VydmFibGVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYXJnW29ic2VydmFibGVdID0gYXJnW1N5bWJvbC5vYnNlcnZhYmxlXTtcclxuICAgICAgICAgICAgZGVsZXRlIGFyZ1tTeW1ib2wub2JzZXJ2YWJsZV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyZztcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXRjaC5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/rxjs-interop/dist/esm/patch.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/rxjs-interop/dist/esm/symbols.js":
/*!*******************************************************!*\
  !*** ./node_modules/rxjs-interop/dist/esm/symbols.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   observable: () => (/* binding */ observable)\n/* harmony export */ });\nconst observable = Symbol.observable || \"@@observable\";\r\n//# sourceMappingURL=symbols.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcnhqcy1pbnRlcm9wL2Rpc3QvZXNtL3N5bWJvbHMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFPO0FBQ1AiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcOTE3OTlcXE9uZURyaXZlXFxEZXNrdG9wXFxhY2Npb2pvYiBhc3Nlc21lbnRcXGNvbXBvbmVudC1jcmFmdGVyXFxmcm9udGVuZFxcbm9kZV9tb2R1bGVzXFxyeGpzLWludGVyb3BcXGRpc3RcXGVzbVxcc3ltYm9scy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3Qgb2JzZXJ2YWJsZSA9IFN5bWJvbC5vYnNlcnZhYmxlIHx8IFwiQEBvYnNlcnZhYmxlXCI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5bWJvbHMuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/rxjs-interop/dist/esm/symbols.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/rxjs-interop/dist/esm/to-observer.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs-interop/dist/esm/to-observer.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   toObserver: () => (/* binding */ toObserver)\n/* harmony export */ });\nconst noop = () => { };\r\nconst rethrow = (error) => {\r\n    throw error;\r\n};\r\nfunction toObserver(observer) {\r\n    if (observer) {\r\n        if (observer.next && observer.error && observer.complete) {\r\n            return observer;\r\n        }\r\n        return {\r\n            complete: (observer.complete ?? noop).bind(observer),\r\n            error: (observer.error ?? rethrow).bind(observer),\r\n            next: (observer.next ?? noop).bind(observer),\r\n        };\r\n    }\r\n    return {\r\n        complete: noop,\r\n        error: rethrow,\r\n        next: noop,\r\n    };\r\n}\r\n//# sourceMappingURL=to-observer.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcnhqcy1pbnRlcm9wL2Rpc3QvZXNtL3RvLW9ic2VydmVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFw5MTc5OVxcT25lRHJpdmVcXERlc2t0b3BcXGFjY2lvam9iIGFzc2VzbWVudFxcY29tcG9uZW50LWNyYWZ0ZXJcXGZyb250ZW5kXFxub2RlX21vZHVsZXNcXHJ4anMtaW50ZXJvcFxcZGlzdFxcZXNtXFx0by1vYnNlcnZlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBub29wID0gKCkgPT4geyB9O1xyXG5jb25zdCByZXRocm93ID0gKGVycm9yKSA9PiB7XHJcbiAgICB0aHJvdyBlcnJvcjtcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIHRvT2JzZXJ2ZXIob2JzZXJ2ZXIpIHtcclxuICAgIGlmIChvYnNlcnZlcikge1xyXG4gICAgICAgIGlmIChvYnNlcnZlci5uZXh0ICYmIG9ic2VydmVyLmVycm9yICYmIG9ic2VydmVyLmNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY29tcGxldGU6IChvYnNlcnZlci5jb21wbGV0ZSA/PyBub29wKS5iaW5kKG9ic2VydmVyKSxcclxuICAgICAgICAgICAgZXJyb3I6IChvYnNlcnZlci5lcnJvciA/PyByZXRocm93KS5iaW5kKG9ic2VydmVyKSxcclxuICAgICAgICAgICAgbmV4dDogKG9ic2VydmVyLm5leHQgPz8gbm9vcCkuYmluZChvYnNlcnZlciksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tcGxldGU6IG5vb3AsXHJcbiAgICAgICAgZXJyb3I6IHJldGhyb3csXHJcbiAgICAgICAgbmV4dDogbm9vcCxcclxuICAgIH07XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dG8tb2JzZXJ2ZXIuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/rxjs-interop/dist/esm/to-observer.js\n");

/***/ })

};
;