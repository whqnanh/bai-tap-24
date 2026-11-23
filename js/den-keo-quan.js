/**
 * ENGINE ĐIỀU KHIỂN ĐÈN KÉO QUÂN 3D JAVASCRIPT
 * Học phần: Lập trình Web - ĐH Văn Hiến (VHU)
 * Sinh viên: Nguyễn Hoàng Anh | MSSV: 241A010633
 *
 * Yêu cầu cốt lõi:
 * 1. Hiển thị 6 hình ảnh trên 6 mặt đèn kéo quân trong không gian 3D.
 * 2. Đèn quay vòng tròn tự động.
 * 3. Đưa chuột vào 1 hình nào đó thì đèn DỪNG LẠI.
 * 4. Rê chuột ra thì đèn QUAY TIẾP.
 */

(function () {
  'use strict';

  // Khởi tạo các phần tử DOM
  const carousel = document.getElementById('lanternCarousel');
  const statusBadge = document.getElementById('lanternStatusText');
  const statusDot = document.getElementById('statusDot');
  const angleDisplay = document.getElementById('angleDisplay');
  const btnTogglePlay = document.getElementById('btnTogglePlay');
  const btnToggleDir = document.getElementById('btnToggleDir');
  const btnToggleLight = document.getElementById('btnToggleLight');
  const speedSlider = document.getElementById('speedSlider');
  const speedVal = document.getElementById('speedVal');
  const coreLight = document.getElementById('coreLight');
  const scene = document.querySelector('.lantern-scene');
  const faces = document.querySelectorAll('.lantern-face');

  // Trạng thái vận hành
  let currentAngle = 0;
  let baseSpeed = 0.35; // Tốc độ góc mỗi frame (degrees)
  let speedMultiplier = 1;
  let direction = 1; // 1: Quay thuận (trái sang phải), -1: Quay nghịch
  let isHovered = false; // Chuột đang nằm trên hình ảnh/đèn
  let isManuallyPaused = false; // Người dùng chủ động nhấn nút Pause
  let isDragging = false;
  let startX = 0;
  let lastX = 0;
  let animationFrameId = null;

  // Dữ liệu mô tả 6 bức ảnh
  const photosData = {
    1: { title: "Ảnh 1: Chân dung cá nhân", desc: "Hình ảnh sinh viên Nguyễn Hoàng Anh - MSSV: 241A010633" },
    2: { title: "Ảnh 2: Hoạt động học tập", desc: "Thực hành phát triển ứng dụng Web Frontend hiện đại" },
    3: { title: "Ảnh 3: Trải nghiệm công nghệ", desc: "Nghiên cứu kiến trúc Cloud Hosting & Triển khai Website" },
    4: { title: "Ảnh 4: Khám phá sáng tạo", desc: "Thiết kế đồ họa và tối ưu trải nghiệm người dùng UI/UX" },
    5: { title: "Ảnh 5: Kỷ niệm sinh viên", desc: "Khoảnh khắc thanh xuân tại trường Đại học Văn Hiến" },
    6: { title: "Ảnh 6: Dự án Web nâng cao", desc: "Hoàn thiện đồ án môn học Lập trình Web với Javascript" }
  };

  /**
   * Cập nhật trạng thái hiển thị trên giao diện
   */
  function updateStatusUI() {
    if (!statusBadge || !statusDot) return;

    if (isHovered) {
      statusBadge.textContent = "ĐÃ DỪNG (Đưa chuột vào hình)";
      statusDot.className = "status-pulse-dot paused";
    } else if (isManuallyPaused) {
      statusBadge.textContent = "TẠM DỪNG (Nút điều khiển)";
      statusDot.className = "status-pulse-dot paused";
    } else if (isDragging) {
      statusBadge.textContent = "ĐANG XOAY BẰNG TAY (Kéo chuột)";
      statusDot.className = "status-pulse-dot";
    } else {
      statusBadge.textContent = `ĐANG QUAY (${direction > 0 ? 'Thuận chiều' : 'Ngược chiều'})`;
      statusDot.className = "status-pulse-dot";
    }

    if (angleDisplay) {
      angleDisplay.textContent = Math.round(((currentAngle % 360) + 360) % 360) + '°';
    }

    if (btnTogglePlay) {
      if (isManuallyPaused) {
        btnTogglePlay.innerHTML = '<span class="icon">▶</span> Tiếp tục';
        btnTogglePlay.classList.add('active');
      } else {
        btnTogglePlay.innerHTML = '<span class="icon">⏸</span> Tạm dừng';
        btnTogglePlay.classList.remove('active');
      }
    }
  }

  /**
   * Vòng lặp hoạt họa chính (Animation Loop) sử dụng requestAnimationFrame
   */
  function animate() {
    // Chỉ quay khi không bị hover chuột, không bị pause thủ công, và không đang kéo
    if (!isHovered && !isManuallyPaused && !isDragging) {
      currentAngle += baseSpeed * speedMultiplier * direction;
      if (currentAngle >= 360 || currentAngle <= -360) {
        currentAngle = currentAngle % 360;
      }
      if (carousel) {
        carousel.style.transform = `rotateY(${currentAngle}deg)`;
      }
      if (angleDisplay) {
        angleDisplay.textContent = Math.round(((currentAngle % 360) + 360) % 360) + '°';
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * CÀI ĐẶT SỰ KIỆN CHÍNH THEO ĐÚNG YÊU CẦU ĐỀ BÀI:
   * - Đưa chuột vào 1 hình nào đó thì đèn dừng lại
   * - Rê chuột ra thì đèn quay tiếp
   */
  faces.forEach((face) => {
    // 1. Khi chuột đi vào một mặt đèn (ảnh)
    face.addEventListener('mouseenter', function () {
      isHovered = true;
      updateStatusUI();
    });

    // 2. Khi chuột rời khỏi mặt đèn
    face.addEventListener('mouseleave', function () {
      isHovered = false;
      updateStatusUI();
    });

    // 3. Khi nhấp vào ảnh để xem phóng to chi tiết (Lightbox)
    face.addEventListener('click', function () {
      const idx = this.getAttribute('data-index');
      const img = this.querySelector('.face-image');
      if (img) {
        openLightbox(img.src, idx);
      }
    });
  });

  // Nếu người dùng đưa chuột vào toàn bộ khung lồng đèn
  if (scene) {
    scene.addEventListener('mouseenter', function (e) {
      // Cho phép dừng khi rê vào vùng trung tâm đèn
      if (e.target.closest('.lantern-face') || e.target.closest('.lantern-stage')) {
        isHovered = true;
        updateStatusUI();
      }
    });

    scene.addEventListener('mouseleave', function () {
      isHovered = false;
      isDragging = false;
      updateStatusUI();
    });

    // HỖ TRỢ KÉO XOAY BẰNG CHUỘT (DRAG TO ROTATE)
    scene.addEventListener('mousedown', function (e) {
      if (e.target.closest('.lantern-controls') || e.target.closest('.lightbox-modal')) return;
      isDragging = true;
      startX = e.clientX;
      lastX = e.clientX;
      updateStatusUI();
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      const deltaX = e.clientX - lastX;
      lastX = e.clientX;
      currentAngle += deltaX * 0.4;
      if (carousel) {
        carousel.style.transform = `rotateY(${currentAngle}deg)`;
      }
      updateStatusUI();
    });

    window.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        updateStatusUI();
      }
    });

    // HỖ TRỢ CẢM ỨNG TRÊN ĐIỆN THOẠI (TOUCH EVENTS)
    scene.addEventListener('touchstart', function (e) {
      if (e.target.closest('.lantern-controls')) return;
      if (e.touches.length === 1) {
        isDragging = true;
        isHovered = true; // Chạm vào màn hình cũng dừng quay
        startX = e.touches[0].clientX;
        lastX = e.touches[0].clientX;
        updateStatusUI();
      }
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (!isDragging || e.touches.length !== 1) return;
      const clientX = e.touches[0].clientX;
      const deltaX = clientX - lastX;
      lastX = clientX;
      currentAngle += deltaX * 0.4;
      if (carousel) {
        carousel.style.transform = `rotateY(${currentAngle}deg)`;
      }
      updateStatusUI();
    }, { passive: true });

    window.addEventListener('touchend', function () {
      if (isDragging) {
        isDragging = false;
        isHovered = false;
        updateStatusUI();
      }
    });
  }

  /* ==========================================================================
     CÁC NÚT ĐIỀU KHIỂN BỔ SUNG (CONTROLS)
     ========================================================================== */

  // Nút Play / Pause
  if (btnTogglePlay) {
    btnTogglePlay.addEventListener('click', function () {
      isManuallyPaused = !isManuallyPaused;
      updateStatusUI();
    });
  }

  // Nút Đổi chiều quay
  if (btnToggleDir) {
    btnToggleDir.addEventListener('click', function () {
      direction = direction * -1;
      updateStatusUI();
    });
  }

  // Nút Bật / Tắt ánh sáng tim đèn
  if (btnToggleLight && coreLight) {
    btnToggleLight.addEventListener('click', function () {
      const isVisible = coreLight.style.display !== 'none';
      if (isVisible) {
        coreLight.style.display = 'none';
        btnToggleLight.innerHTML = '<span class="icon">💡</span> Bật đèn';
        btnToggleLight.classList.remove('active');
      } else {
        coreLight.style.display = 'block';
        btnToggleLight.innerHTML = '<span class="icon">🕯️</span> Tắt đèn';
        btnToggleLight.classList.add('active');
      }
    });
  }

  // Thanh trượt tốc độ quay
  if (speedSlider) {
    speedSlider.addEventListener('input', function () {
      speedMultiplier = parseFloat(this.value);
      if (speedVal) {
        speedVal.textContent = speedMultiplier.toFixed(1) + 'x';
      }
    });
  }

  /* ==========================================================================
     LIGHTBOX PHÓNG TO ẢNH KHI NHẤP CHUỘT
     ========================================================================== */
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, index) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    const data = photosData[index] || { title: `Ảnh ${index}`, desc: "Nguyễn Hoàng Anh - 241A010633" };
    if (lightboxTitle) lightboxTitle.textContent = data.title;
    if (lightboxDesc) lightboxDesc.textContent = data.desc;
    lightbox.classList.add('active');
    isHovered = true; // Dừng đèn khi đang mở lightbox
    updateStatusUI();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    isHovered = false;
    updateStatusUI();
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Khởi động vòng lặp và cập nhật UI ban đầu
  updateStatusUI();
  animate();

})();
