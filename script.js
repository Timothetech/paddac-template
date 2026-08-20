document.addEventListener("DOMContentLoaded", () => {
  setupStickyNavbar();
  setupMobileMenu();
  setupVideoModal();
  initHeroSlider();
  initAnimateStats();
  initShowcaseFilters();
  initAdhesionForm();
  initProductSlider();
  setupBottomNavScroll();
});

// 1. NAVBAR FIXE UNIQUEMENT AU SCROLL
function setupStickyNavbar() {
  const navbar = document.getElementById("mainNavbar");
  const headerGlobal = document.querySelector(".header-global");

  if (!navbar || !headerGlobal) return;

  window.addEventListener("scroll", () => {
    const stickyPoint = headerGlobal.offsetTop + 80;
    if (window.scrollY > stickyPoint) {
      navbar.classList.add("sticky");
    } else {
      navbar.classList.remove("sticky");
    }
  });
}

// 2. MENU RESPONSIVE MOBILE
function setupMobileMenu() {
  const burger = document.getElementById("burgerMenu");
  const navLinks = document.getElementById("navLinks");
  const dropdowns = document.querySelectorAll(".dropdown");

  if (!burger || !navLinks) return;

  // Toggle Menu Burger
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Toggle Sous-menus au clic sur mobile (<= 992px)
  dropdowns.forEach((dropdown) => {
    const link = dropdown.querySelector("a");
    if (!link) return;

    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        dropdown.classList.toggle("active");
      }
    });
  });
}

// 3. HERO SLIDER CAROUSEL
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dotsContainer = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");

  if (!slides.length || !dotsContainer) return;

  let currentIndex = 0;
  let autoSlideTimer = null;

  // Clear existing dots
  dotsContainer.innerHTML = "";

  // Génération dynamique des Dots
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".dot");

  function goToSlide(index) {
    slides[currentIndex].classList.remove("active");
    if (dots[currentIndex]) dots[currentIndex].classList.remove("active");

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add("active");
    if (dots[currentIndex]) dots[currentIndex].classList.add("active");
    resetTimer();
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  function startTimer() {
    autoSlideTimer = setInterval(nextSlide, 7000);
  }

  function resetTimer() {
    clearInterval(autoSlideTimer);
    startTimer();
  }

  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  startTimer();
}

// 4. ANIMATION DES COMPTEURS AU SCROLL
function initAnimateStats() {
  const statNumbers = document.querySelectorAll(".stat-number");
  const targetSection = document.querySelector(".stats-section");
  if (!statNumbers.length || !targetSection) return;

  let animated = false;

  const observerOptions = { threshold: 0.3 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach((num) => animateCounter(num));
      }
    });
  }, observerOptions);

  observer.observe(targetSection);
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-target"), 10);
  if (isNaN(target)) return;

  const duration = 2000;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString("fr-FR");
      clearInterval(timer);
    } else {
      element.textContent = Math.ceil(current).toLocaleString("fr-FR");
    }
  }, stepTime);
}

// 5. FILTRES DES RÉALISATIONS (SHOWCASE)
function initShowcaseFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".showcase-card");

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// 6. FORMULAIRE D'ADHÉSION
function initAdhesionForm() {
  const selectMembership = document.getElementById("membershipType");
  const totalAmount = document.getElementById("totalAmount");

  if (selectMembership && totalAmount) {
    selectMembership.addEventListener("change", (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const price = selectedOption.getAttribute("data-price");

      if (price) {
        totalAmount.textContent = parseInt(price, 10).toLocaleString("fr-FR") + " FCFA";
      } else {
        totalAmount.textContent = "0 FCFA";
      }
    });
  }
}

// 7. CARROUSEL PRODUITS
function initProductSlider() {
  const slider = document.getElementById("productsSlider");
  const prevBtn = document.getElementById("prevProductBtn");
  const nextBtn = document.getElementById("nextProductBtn");

  if (slider && prevBtn && nextBtn) {
    const scrollAmount = 270;

    nextBtn.addEventListener("click", () => {
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }
}

// 8. MODALE PRODUIT & COMMANDES WHATSAPP
function openProductModal(title, price, desc, imgSrc, stock) {
  const modalTitle = document.getElementById("modalProductTitle");
  const modalPrice = document.getElementById("modalProductPrice");
  const modalDesc = document.getElementById("modalProductDesc");
  const modalImg = document.getElementById("modalProductImg");
  const modalStock = document.getElementById("modalProductStock");
  const orderBtn = document.getElementById("modalOrderBtn");
  const modal = document.getElementById("productModal");

  if (modalTitle) modalTitle.textContent = title;
  if (modalPrice) modalPrice.textContent = price;
  if (modalDesc) modalDesc.textContent = desc;
  if (modalImg) modalImg.src = imgSrc;
  if (modalStock) modalStock.textContent = stock;

  if (orderBtn) {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('Bonjour PADDAC, je souhaite commander le produit : ' + title + ' (' + price + ')')}`;
    orderBtn.href = whatsappUrl;
  }

  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// 9. MODAL VIDÉO
function setupVideoModal() {
  const videoModal = document.getElementById("videoModal");
  const playBtn = document.getElementById("playVideoBtn");
  const closeBtn = document.getElementById("closeVideoModal");

  if (playBtn && videoModal) {
    playBtn.onclick = () => (videoModal.style.display = "flex");
    if (closeBtn) closeBtn.onclick = () => (videoModal.style.display = "none");
    window.onclick = (e) => {
      if (e.target === videoModal) videoModal.style.display = "none";
    };
  }
}

// 10. BOTNAV MOBILE ET ACTIF AU SCROLL
function setupBottomNavScroll() {
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");
      const navLink = document.querySelector(`.mobile-bottom-nav a[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll(".mobile-bottom-nav .nav-item").forEach((item) => item.classList.remove("active"));
          navLink.classList.add("active");
        }
      }
    });
  });
}

/* Ouverture/Fermeture du Support Popover */
function toggleSupportPopover() {
  const widget = document.getElementById('supportWidget');
  if (widget) {
    widget.classList.toggle('open');
  }
}

/* Fermeture du Popover si on clique en dehors */
document.addEventListener('click', (event) => {
  const widget = document.getElementById('supportWidget');
  if (widget && !widget.contains(event.target) && widget.classList.contains('open')) {
    widget.classList.remove('open');
  }
});