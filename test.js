/* global describe it Blob */

const hasBinary = require('./');
const assert = require('better-assert');
const fs = require('fs');

describe('has-binarydata', () => {
  it('should work with buffer', () => {
    assert(hasBinary(fs.readFileSync('./test.js')));
  });

  it('should work with an array that does not contain binary', () => {
    var arr = [1, 'cool', 2];
    assert(!hasBinary(arr));
  });

  it('should work with an array that contains a buffer', () => {
    var arr = [1, Buffer.from('asdfasdf', 'utf8'), 2];
    assert(hasBinary(arr));
  });

  it('should work with an object that does not contain binary', () => {
    var ob = {a: 'a', b: [], c: 1234, toJSON: '{"a": "a"}'};
    assert(!hasBinary(ob));
  });

  it('should work with an object that contains a buffer', () => {
    var ob = {a: 'a', b: Buffer.from('abc'), c: 1234, toJSON: '{"a": "a"}'};
    assert(hasBinary(ob));
  });

  it('should work with an object whose toJSON() returns a buffer', () => {
    var ob = {a: 'a', b: [], c: 1234, toJSON: () => { return Buffer.from('abc'); }};
    assert(hasBinary(ob));
  });

  it('should work with an object by calling toJSON() once', () => {
    var ob = { toJSON: () => { return this; } };
    assert(!hasBinary(ob));
  });

  it('should work with null', () => {
    assert(!hasBinary(null));
  });

  it('should work with undefined', () => {
    assert(!hasBinary(undefined));
  });

  it('should work with a complex object that contains undefined and no binary', () => {
    var ob = {
      x: ['a', 'b', 123],
      y: undefined,
      z: {a: 'x', b: 'y', c: 3, d: null},
      w: []
    };
    assert(!hasBinary(ob));
  });

  it('should work with a complex object that contains undefined and binary', () => {
    var ob = {
      x: ['a', 'b', 123],
      y: undefined,
      z: {a: 'x', b: 'y', c: 3, d: null},
      w: [],
      bin: Buffer.from('xxx')
    };
    assert(hasBinary(ob));
  });

  if (global.ArrayBuffer) {
    it('should work with an ArrayBuffer', () => {
      assert(hasBinary(new ArrayBuffer()));
    });
  }

  if (global.Blob) {
    it('should work with a Blob', () => {
      assert(hasBinary(new Blob()));
    });
  } else {
    it('should not crash if global Blob is not a function', () => {
      global.Blob = [ 1, 2, 3 ];
      assert(!hasBinary(global.Blob));
    });
  }
});
