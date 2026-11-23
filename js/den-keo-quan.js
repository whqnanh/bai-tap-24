(function () {
  'use strict';

  const carousel = document.getElementById('lanternCarousel');
  const statusBadge = document.getElementById('lanternStatusText');
  const statusDot = document.getElementById('statusDot');
  const angleDisplay = document.getElementById('angleDisplay');
  const btnTogglePlay = document.getElementById('btnTogglePlay');
  const btnToggleDir = document.getElementById('btnToggleDir');
  const speedSlider = document.getElementById('speedSlider');
  const speedVal = document.getElementById('speedVal');
  const scene = document.querySelector('.lantern-scene');
  const faces = document.querySelectorAll('.lantern-face');

  let currentAngle = 0;
  let baseSpeed = 0.35;
  let speedMultiplier = 1;
  let direction = 1;
  let isHovered = false;
  let isManuallyPaused = false;
  let isDragging = false;
  let startX = 0;
  let lastX = 0;

  const photosData = {
    1: { title: "Ảnh 1", desc: "Nguyễn Hoàng Anh - MSSV: 241A010633" },
    2: { title: "Ảnh 2", desc: "Nguyễn Hoàng Anh - MSSV: 241A010633" },
    3: { title: "Ảnh 3", desc: "Nguyễn Hoàng Anh - MSSV: 241A010633" },
    4: { title: "Ảnh 4", desc: "Nguyễn Hoàng Anh - MSSV: 241A010633" },
    5: { title: "Ảnh 5", desc: "Nguyễn Hoàng Anh - MSSV: 241A010633" },
    6: { title: "Ảnh 6", desc: "Nguyễn Hoàng Anh - MSSV: 241A010633" }
  };

  function updateStatusUI() {
    if (!statusBadge || !statusDot) return;

    if (isHovered) {
      statusBadge.textContent = "Đã dừng (Rê chuột vào hình)";
      statusDot.className = "status-pulse-dot paused";
    } else if (isManuallyPaused) {
      statusBadge.textContent = "Tạm dừng";
      statusDot.className = "status-pulse-dot paused";
    } else if (isDragging) {
      statusBadge.textContent = "Kéo xoay thủ công";
      statusDot.className = "status-pulse-dot";
    } else {
      statusBadge.textContent = direction > 0 ? "Đang quay" : "Đang quay ngược";
      statusDot.className = "status-pulse-dot";
    }

    if (angleDisplay) {
      angleDisplay.textContent = Math.round(((currentAngle % 360) + 360) % 360) + '°';
    }

    if (btnTogglePlay) {
      btnTogglePlay.textContent = isManuallyPaused ? "Tiếp tục" : "Tạm dừng";
    }
  }

  function animate() {
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
    requestAnimationFrame(animate);
  }

  faces.forEach((face) => {
    face.addEventListener('mouseenter', function () {
      isHovered = true;
      updateStatusUI();
    });

    face.addEventListener('mouseleave', function () {
      isHovered = false;
      updateStatusUI();
    });

    face.addEventListener('click', function () {
      const idx = this.getAttribute('data-index');
      const img = this.querySelector('.face-image');
      if (img) {
        openLightbox(img.src, idx);
      }
    });
  });

  if (scene) {
    scene.addEventListener('mouseenter', function (e) {
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

    scene.addEventListener('touchstart', function (e) {
      if (e.target.closest('.lantern-controls')) return;
      if (e.touches.length === 1) {
        isDragging = true;
        isHovered = true;
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

  if (btnTogglePlay) {
    btnTogglePlay.addEventListener('click', function () {
      isManuallyPaused = !isManuallyPaused;
      updateStatusUI();
    });
  }

  if (btnToggleDir) {
    btnToggleDir.addEventListener('click', function () {
      direction = direction * -1;
      updateStatusUI();
    });
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', function () {
      speedMultiplier = parseFloat(this.value);
      if (speedVal) {
        speedVal.textContent = speedMultiplier.toFixed(1) + 'x';
      }
    });
  }

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
    isHovered = true;
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

  updateStatusUI();
  animate();
})();
