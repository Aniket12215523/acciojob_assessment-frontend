"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/dashify";
exports.ids = ["vendor-chunks/dashify"];
exports.modules = {

/***/ "(ssr)/./node_modules/dashify/index.js":
/*!***************************************!*\
  !*** ./node_modules/dashify/index.js ***!
  \***************************************/
/***/ ((module) => {

eval("/*!\n * dashify <https://github.com/jonschlinkert/dashify>\n *\n * Copyright (c) 2015-2017, Jon Schlinkert.\n * Released under the MIT License.\n */\n\n\n\nmodule.exports = (str, options) => {\n  if (typeof str !== 'string') throw new TypeError('expected a string');\n  return str.trim()\n    .replace(/([a-z])([A-Z])/g, '$1-$2')\n    .replace(/\\W/g, m => /[À-ž]/.test(m) ? m : '-')\n    .replace(/^-+|-+$/g, '')\n    .replace(/-{2,}/g, m => options && options.condense ? '-' : m)\n    .toLowerCase();\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZGFzaGlmeS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLEdBQUc7QUFDbkI7QUFDQSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFw5MTc5OVxcT25lRHJpdmVcXERlc2t0b3BcXGFjY2lvam9iIGFzc2VzbWVudFxcY29tcG9uZW50LWNyYWZ0ZXJcXGZyb250ZW5kXFxub2RlX21vZHVsZXNcXGRhc2hpZnlcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogZGFzaGlmeSA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvZGFzaGlmeT5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtMjAxNywgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChzdHIsIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdleHBlY3RlZCBhIHN0cmluZycpO1xuICByZXR1cm4gc3RyLnRyaW0oKVxuICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKVxuICAgIC5yZXBsYWNlKC9cXFcvZywgbSA9PiAvW8OALcW+XS8udGVzdChtKSA/IG0gOiAnLScpXG4gICAgLnJlcGxhY2UoL14tK3wtKyQvZywgJycpXG4gICAgLnJlcGxhY2UoLy17Mix9L2csIG0gPT4gb3B0aW9ucyAmJiBvcHRpb25zLmNvbmRlbnNlID8gJy0nIDogbSlcbiAgICAudG9Mb3dlckNhc2UoKTtcbn07XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/dashify/index.js\n");

/***/ })

};
;