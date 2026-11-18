# Save the Date — Thiệp cưới Minimalism Đỏ Đậm

Thiệp cưới online (HTML/CSS/JS thuần, không cần build) dựng theo bố cục mẫu
"Minimalism Đỏ Đậm": bìa phong bì → hero phong bì + polaroid → thẻ thông tin lễ cưới →
album 3D → thẻ tiệc cưới + lịch → bản đồ → dress code → lịch trình → sổ lưu bút → hộp quà QR.

## Chạy thử

```powershell
node serve.mjs
```

Mở http://localhost:5173 (đổi cổng bằng biến môi trường `PORT`). Có thể mở trực tiếp
`index.html`, nhưng nên dùng server để bản đồ và font hoạt động ổn định.

## Đổi nội dung

Mọi thông tin nằm trong [`js/config.js`](js/config.js): tên cô dâu chú rể, cha mẹ, ngày giờ,
địa điểm, dress code, lịch trình, ngân hàng, lời chúc mẫu…

| Muốn làm gì | Làm thế nào |
|---|---|
| Dùng ảnh thật | Bỏ ảnh vào `assets/photos/` rồi điền `photos: ['assets/photos/1.jpg', …]`. Ảnh đầu tiên cũng là ảnh polaroid trong phong bì. Hiện đang dùng ảnh minh hoạ tự sinh. |
| Nhạc nền | Mặc định đã có nhạc: bản "Canon in D" tự tổng hợp bằng Web Audio ([`js/music.js`](js/music.js), không cần file, không dính bản quyền), tự phát khi khách bấm "Mở thiệp", có nút bật/tắt ở góc dưới bên phải. Muốn dùng bài của bạn: đặt file `.mp3` vào `assets/music/` rồi điền `music: { src: 'assets/music/song.mp3' }`. Muốn tắt hẳn nhạc: `music: { synth: false }`. Chỉnh âm lượng bằng `volume` (0–1). |
| Album ảnh | Tự chuyển ảnh mỗi ~3,6 giây (tạm dừng khi khung album ra khỏi màn hình hoặc đổi tab), kéo/vuốt để chuyển, có phím ← →. Tự tắt tự chạy nếu thiết bị bật "giảm chuyển động". |
| Tên khách trên bìa | Thêm `?to=Tên Khách` vào link, ví dụ `index.html?to=Anh Minh`. |
| QR mừng cưới | Điền `bin` (mã ngân hàng NAPAS), số tài khoản, tên chủ tài khoản. Mã QR VietQR được tạo ngay trên trình duyệt. |
| Đổi màu | Sửa các biến `--wine`, `--wine-2`, `--gold`, `--cream`, `--paper` ở đầu [`css/styles.css`](css/styles.css). |

## Lưu ý

- Dữ liệu trong `config.js` (tên, địa chỉ, tài khoản ngân hàng…) là **dữ liệu mẫu**, hãy thay bằng thông tin thật.
- Sổ lưu bút và xác nhận tham dự hiện **chỉ lưu trong `localStorage` của trình duyệt** (chưa có backend),
  nên mỗi khách chỉ thấy lời chúc do chính họ gửi cộng với lời chúc mẫu. Muốn gom dữ liệu thật cần
  nối thêm API/Google Sheets/Firebase.
- Hoa, phong bì, bản vẽ toà nhà đều là SVG tự vẽ trong repo (`index.html`, `assets/castle.svg`).
