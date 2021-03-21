const assert = require('assert');
const {AES, AESUtil} = require('../index.js');
const net = require('../../net/index.js');
describe('@titan/crypto.AES', function() {
  it('should scale the IV', function() {
    const scaled = AESUtil.scaleIV(Buffer.from([0x1, 0x2, 0x3, 0x4]), 4, 4);
    assert.ok(scaled.length == 16);
    const expected = Buffer.from([
      0x1, 0x2, 0x3, 0x4,
      0x1, 0x2, 0x3, 0x4,
      0x1, 0x2, 0x3, 0x4,
      0x1, 0x2, 0x3, 0x4,
    ]);
    let same = true;
    expected.forEach((val, idx) => {
      if (expected[idx] !== scaled[idx]) same = false;
    });
    assert.ok(same);
  });
  it('should transform the data', function() {
    const cast = net.Packet.cast;
    let iv = Buffer.from([0x1, 0x2, 0x3, 0x4]);
    const aes = new AES(iv, cast(83).short());
    const data1 = Buffer.from([0x1, 0x1, 0x1, 0x1]);
    const transformed = aes.transform(data1);
    const ans1 = Buffer.from([0xf1, 0xef, 0xa5, 0xd3]);
    assert.ok(transformed.compare(ans1) == 0);
  });
  it('should transform the data twice to test morphIV()', function() {
    const cast = net.Packet.cast;
    const iv = Buffer.from([0x1, 0x2, 0x3, 0x4]);
    const aes = new AES(iv, cast(83).short());
    const data1 = Buffer.from([0x1, 0x1, 0x1, 0x1]);
    const transformed = aes.transform(data1);
    const transformed2 = aes.transform(transformed);
    const ans1 = Buffer.from([0x71, 0x05, 0x96, 0x10]);
    assert.ok(transformed2.compare(ans1) == 0);
  });
});