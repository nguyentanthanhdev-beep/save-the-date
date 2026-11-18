/*
 * VietQR (NAPAS 247) payload builder — EMVCo TLV + CRC16-CCITT.
 * Dùng được cả trong trình duyệt (window.VietQR) lẫn Node (module.exports).
 */
(function (root) {
  'use strict';

  function tlv(id, value) {
    return id + String(value.length).padStart(2, '0') + value;
  }

  function crc16(str) {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let b = 0; b < 8; b++) {
        crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  /**
   * @param {{bin:string, account:string, amount?:number, note?:string, dynamic?:boolean}} o
   */
  function build(o) {
    const merchant =
      tlv('00', 'A000000727') +
      tlv('01', tlv('00', o.bin) + tlv('01', o.account)) +
      tlv('02', 'QRIBFTTA');

    let body =
      tlv('00', '01') +
      tlv('01', o.dynamic ? '12' : '11') +
      tlv('38', merchant) +
      tlv('53', '704');

    if (o.amount) body += tlv('54', String(Math.round(o.amount)));
    body += tlv('58', 'VN');
    if (o.note) body += tlv('62', tlv('08', o.note));

    body += '6304';
    return body + crc16(body);
  }

  const api = { build: build, crc16: crc16 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.VietQR = api;
})(typeof window !== 'undefined' ? window : globalThis);
