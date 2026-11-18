/*
 * ============================================================
 *  NỘI DUNG THIỆP — chỉ cần sửa file này để đổi thông tin.
 *  (Toàn bộ dữ liệu bên dưới là dữ liệu MẪU.)
 * ============================================================
 */
window.WEDDING = {
  /* Chú rể */
  groom: {
    name: 'Hoàng Long',            // tên ngắn (hiện ở bìa & tiêu đề)
    fullName: 'Đặng Hoàng Long',   // tên đầy đủ (trong thẻ thông tin)
    role: 'Trưởng nam',
    parents: {
      title: 'Ông Bà',
      father: 'Đặng Văn Thắng',
      mother: 'Bùi Thị Mai',
      address: 'Quận 1, TP. Hồ Chí Minh'
    },
    bank: { bin: '970436', bankName: 'Vietcombank', account: '0123456789', holder: 'DANG HOANG LONG' }
  },

  /* Cô dâu */
  bride: {
    name: 'Bảo Ngọc',
    fullName: 'Vũ Bảo Ngọc',
    role: 'Út nữ',
    parents: {
      title: 'Ông Bà',
      father: 'Vũ Đức Trung',
      mother: 'Ngô Thị Hạnh',
      address: 'Quận 3, TP. Hồ Chí Minh'
    },
    bank: { bin: '970407', bankName: 'Techcombank', account: '9876543210', holder: 'VU BAO NGOC' }
  },

  /* Lễ thành hôn */
  ceremony: {
    place: 'Tư gia',
    date: '2026-01-03',            // YYYY-MM-DD
    time: '09:00',
    lunar: '15 tháng 11 năm Ất Tỵ'
  },

  /* Tiệc cưới */
  party: {
    date: '2026-01-03',
    doorsOpen: '17:30',
    start: '18:00',
    end: '20:30',
    venueName: 'Trung Tâm Hội Nghị White Palace',
    address: '194 Hoàng Văn Thụ, Phường 9, Quận Phú Nhuận, TP. Hồ Chí Minh',
    mapQuery: 'White Palace 194 Hoàng Văn Thụ Phú Nhuận Hồ Chí Minh',
    lunar: '15 tháng 11 năm Ất Tỵ'
  },

  /* Dress code (mã màu HEX) */
  dressCode: {
    note: 'Trang phục dự tiệc',
    colors: ['#511419', '#8c3a3f', '#c9a24a', '#ece4d8']
  },

  /* Lịch trình ngày cưới — icon: camera | dish | cake | none */
  timeline: [
    { time: '17:00', label: 'Đón khách', icon: 'none' },
    { time: '18:00', label: 'Khai tiệc', icon: 'camera' },
    { time: '18:30', label: 'Nghi thức cưới', icon: 'dish' },
    { time: '19:00', label: 'Cắt bánh & nâng ly', icon: 'cake' },
    { time: '20:30', label: 'Kết thúc tiệc', icon: 'none' }
  ],

  /*
   * Album ảnh: điền đường dẫn ảnh của bạn (vd 'assets/photos/1.jpg').
   * Để trống [] sẽ dùng ảnh minh hoạ tự sinh. Ảnh đầu tiên cũng được dùng
   * làm ảnh polaroid trong phong bì ở đầu thiệp.
   */
  photos: [],
  photoCount: 7,                   // số ảnh minh hoạ khi photos = []

  /*
   * Nhạc nền, phát khi khách bấm "Mở thiệp" (có nút bật/tắt ở góc dưới bên phải).
   *  - src: để trống '' → dùng nhạc tự tổng hợp sẵn (Canon in D, js/music.js).
   *         điền đường dẫn mp3, vd 'assets/music/song.mp3' → dùng bài của bạn.
   *  - synth: false → tắt hẳn nhạc tự tổng hợp (khi src trống thì không có nhạc).
   *  - volume: 0 → 1 (mặc định 0.5 cho nhạc tổng hợp, 0.7 cho file mp3).
   */
  music: { src: '', synth: true, volume: 0.5 },

  /* Lời chúc mẫu hiện sẵn trong sổ lưu bút (ago = số phút trước) */
  wishes: [
    { name: 'Duy Khang', text: 'Chúc mừng ngày vui của hai bạn, trăm năm hạnh phúc bền lâu!', ago: 95 },
    { name: 'Lan Chi', text: 'Đẹp đôi quá! Chúc hai bạn sống bên nhau đầu bạc răng long.', ago: 210 },
    { name: 'Tuấn Anh', text: 'Mừng hạnh phúc hai bạn! Chúc gia đình nhỏ luôn đầy ắp tiếng cười.', ago: 480 },
    { name: 'Khánh Vy', text: 'Chúc cô dâu chú rể luôn giữ được nụ cười này mãi mãi nhé!', ago: 900 },
    { name: 'Gia Bảo', text: 'Nhìn thiệp là thấy tình yêu rồi. Chúc hai bạn trăm năm viên mãn!', ago: 1500 }
  ],

  /* Gợi ý lời chúc cho nút "đũa phép" 🪄 */
  wishSuggestions: [
    'Chúc hai bạn trăm năm hạnh phúc, mãi mãi yêu thương và bên nhau trọn đời!',
    'Chúc mừng ngày trọng đại của hai bạn. Mong tổ ấm nhỏ luôn đầy ắp tiếng cười!',
    'Một nửa của nhau đã tìm thấy. Chúc hai bạn hạnh phúc viên mãn nhé!',
    'Chúc đám cưới thật trọn vẹn và ấm áp. Hạnh phúc nhé hai bạn!'
  ],

  footer: {
    message: 'Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!',
    credit: '♡ Save the Date'
  }
};
