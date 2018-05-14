/* global Blob File */

/*
 * Module requirements.
 */

var isArray = require('isarray');

var toString = Object.prototype.toString;
var withNativeBlob = typeof Blob === 'function' ||
                        typeof Blob !== 'undefined' && toString.call(Blob) === '[object BlobConstructor]';
var withNativeFile = typeof File === 'function' ||
                        typeof File !== 'undefined' && toString.call(File) === '[object FileConstructor]';

/**
 * Module exports.
 */

module.exports = function hasBinaryCircular (obj) {
  return hasBinary(obj, []);
};

/**
 * Checks for binary data.
 *
 * Supports Buffer, ArrayBuffer, Blob and File.
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary (obj, known) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  if (known.indexOf(obj) >= 0) {
    return false;
  }

  known.push(obj);

  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i], known)) {
        return true;
      }
    }
    return false;
  }

  if ((typeof Buffer === 'function' && Buffer.isBuffer && Buffer.isBuffer(obj)) ||
    (typeof ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
    (withNativeBlob && obj instanceof Blob) ||
    (withNativeFile && obj instanceof File)
  ) {
    return true;
  }

  // see: https://github.com/Automattic/has-binary/pull/4
  if (obj.toJSON && typeof obj.toJSON === 'function') {
    return hasBinary(obj.toJSON(), known);
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key], known)) {
      return true;
    }
  }

  return false;
}
