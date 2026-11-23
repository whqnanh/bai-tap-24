# BÀI TẬP 24: TỔNG HỢP KẾT QUẢ THỰC HÀNH & HIỆU ỨNG ĐÈN KÉO QUÂN 3D JAVASCRIPT

- **Học phần**: Lập trình Web
- **Họ và tên sinh viên**: Nguyễn Hoàng Anh
- **Mã số sinh viên (MSSV)**: **241A010633**
- **Trường**: Đại học Văn Hiến (VHU)
- **Kho lưu trữ GitHub (Repository)**: [https://github.com/whqnanh/bai-tap-24](https://github.com/whqnanh/bai-tap-24)
- **Website trực tuyến (GitHub Pages)**: [https://whqnanh.github.io/bai-tap-24/](https://whqnanh.github.io/bai-tap-24/)

---

## 🏮 I. HIỆU ỨNG JAVASCRIPT: ĐÈN KÉO QUÂN 3D

Xây dựng mô hình lồng đèn kéo quân 3D với 6 mặt hình ảnh cá nhân của sinh viên Nguyễn Hoàng Anh:
1. **Hình học không gian 3D**: 6 mặt lồng đèn bố trí thành hình lăng trụ lục giác đều trong không gian 3 chiều (`transform-style: preserve-3d`), mỗi mặt cách nhau chính xác $60^\circ$ quanh trục Y (`rotateY`) với bán kính lùi $Z = 230\text{px}$.
2. **Quay vòng tròn tự động**: Sử dụng hàm `requestAnimationFrame` tạo chuyển động xoay quanh trục Y mượt mà 60 khung hình/giây.
3. **Đưa chuột vào thì dừng lại**: Bắt sự kiện `mouseenter` trên từng mặt ảnh hoặc lồng đèn, biến cờ `isHovered = true` giữ nguyên góc quay hiện tại, viền vàng phát quang nổi bật để quan sát ảnh rõ nét.
4. **Rê chuột ra thì quay tiếp**: Bắt sự kiện `mouseleave`, biến cờ `isHovered = false` giúp đèn tiếp tục quay mượt mà ngay tại góc đang dừng.
5. **Tính năng bổ sung**:
   - Nút Tạm dừng / Tiếp tục (`Play / Pause`).
   - Nút Đổi chiều quay (Thuận chiều / Ngược chiều kim đồng hồ).
   - Thanh trượt điều chỉnh tốc độ xoay từ $0.2\times$ đến $3.0\times$.
   - Nút Bật / Tắt hiệu ứng tim đèn nến phát sáng bên trong.
   - Hỗ trợ kéo chuột xoay tự do (`Drag to rotate`) và cảm ứng vuốt trên thiết bị di động (`Touch events`).
   - Xem ảnh phóng to chi tiết với giao diện Lightbox Modal.

---

## 📑 II. TỔNG HỢP CÁC TRANG NHÁNH BÀI TẬP 17 ĐẾN 22

Trang chủ `index.html` tích hợp thanh Menu chính liên kết trực tiếp tới các trang nhánh kết quả:

| Bài tập | Tiêu đề nội dung | Trang nhánh chi tiết | Trạng thái thực tế |
| :---: | :--- | :---: | :---: |
| **17** | **Đăng ký Domain & Kiểm tra DNS** | [`bai17.html`](bai17.html) | `mywebsite-hoanganh.duckdns.org` -> IP `113.185.75.163` |
| **18** | **Upload Website qua FTP/SFTP** | [`bai18.html`](bai18.html) | Host `ftpupload.net:21` -> Live: `http://hoanganh-cv.42web.io` |
| **19** | **Deploy lên GitHub Pages & CI/CD** | [`bai19.html`](bai19.html) | Repo `whqnanh/my-portfolio` -> Live: `whqnanh.github.io/my-portfolio` |
| **20** | **Tối ưu hóa SEO & Thẻ Open Graph** | [`bai20.html`](bai20.html) | Google SERP, Facebook Open Graph, Lighthouse Score 100/100 |
| **21** | **Public trên 4 Nền tảng miễn phí** | [`bai21.html`](bai21.html) | 4 Nền tảng hoạt động: GitHub, InfinityFree, DuckDNS, Netlify |
| **22** | **Cấu hình SSL/HTTPS & Custom Domain** | [`bai22.html`](bai22.html) | Chứng chỉ DigiCert TLS 1.3, Enforce HTTPS, CNAME Record |
| **JS** | **Đèn Kéo Quân 3D Javascript** | [`den-keo-quan.html`](den-keo-quan.html) | 6 Mặt ảnh cá nhân, hover dừng lại, rê chuột ra quay tiếp |

---

## 🛠️ III. CẤU TRÚC DỰ ÁN

```text
bt24/
├── index.html              # Trang chủ tổng hợp kết quả bài tập 17-22 & demo Đèn kéo quân
├── den-keo-quan.html       # Trang chuyên sâu trải nghiệm Đèn kéo quân 3D toàn màn hình
├── bai17.html              # Trang nhánh kết quả Bài tập 17 (DNS & Domain DuckDNS)
├── bai18.html              # Trang nhánh kết quả Bài tập 18 (Upload CV qua FTP InfinityFree)
├── bai19.html              # Trang nhánh kết quả Bài tập 19 (Deploy GitHub Pages & CI/CD)
├── bai20.html              # Trang nhánh kết quả Bài tập 20 (SEO On-Page & Open Graph)
├── bai21.html              # Trang nhánh kết quả Bài tập 21 (Báo cáo 4 nền tảng hosting)
├── bai22.html              # Trang nhánh kết quả Bài tập 22 (Bảo mật SSL/HTTPS TLS 1.3)
├── css/
│   ├── style.css           # Bảng phong cách giao diện chung, responsive, menu, layout
│   └── den-keo-quan.css    # Hiệu ứng 3D CSS transforms, phối cảnh, mái đèn, tua rua, tim đèn
├── js/
│   └── den-keo-quan.js     # Engine Javascript điều khiển vòng quay, hover pause/resume, drag
├── images/
│   ├── avatar.jpg          # Ảnh đại diện cá nhân sinh viên Nguyễn Hoàng Anh
│   ├── photo1.jpg .. photo6.jpg # 6 bức ảnh cá nhân gắn trên 6 mặt đèn kéo quân
│   ├── bt17.svg .. bt22.svg     # Hình ảnh minh họa kết quả từng bài tập 17 đến 22
│   └── den-keo-quan-thumb.svg   # Hình ảnh biểu trưng hiệu ứng đèn kéo quân 3D
└── README.md               # Tài liệu thuyết minh đồ án Bài tập 24
```

---

© 2026 Nguyễn Hoàng Anh - MSSV: 241A010633 - Trường Đại học Văn Hiến.
