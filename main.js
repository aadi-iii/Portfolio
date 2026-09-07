/* ==========================================================================
   ADITYA SHARMA - INTERACTIVE PORTFOLIO JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initTheme();
  initMobileMenu();
  initTypingEffect();
  initBackgroundCanvas();
  initScrollProgress();
  initCounters();
  initSkillBars();
  initFilters();
  initTerminalTabs();
  initProjectModals();
  initContactForm();
  initResumeQuickSpecs();
});

/* ==========================================================================
   1. Theme Switcher Module (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check localStorage or default to dark
  const savedTheme = localStorage.getItem('aditya_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('aditya_portfolio_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode!`, 'success');
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-moon';
    } else {
      themeIcon.className = 'fa-solid fa-sun';
    }
  }
}

/* ==========================================================================
   2. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isOpen = navMenu.classList.contains('active');
    mobileBtn.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileBtn.querySelector('i').className = 'fa-solid fa-bars';
    });
  });
}

/* ==========================================================================
   3. Typing Effect Engine for Hero Subtitle
   ========================================================================== */
function initTypingEffect() {
  const typingText = document.getElementById('typing-text');
  if (!typingText) return;

  const roles = [
    "Computer Engineering Student",
    "Full-Stack Web Developer",
    "IoT & Robotics Creator",
    "Firebase & Backend Architect"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. Background Interactive Particle / Constellation Canvas
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 150 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  // Create particles
  const particleCount = Math.min(Math.floor(width / 20), 70);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.radius = Math.random() * 2 + 1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse proximity interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 242, 254, ${1 - dist / 120})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   5. Scroll Progress Bar & Navigation Active Link Observer
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Scroll progress bar width
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Active Section Highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. Animated Stat Counters
   ========================================================================== */
function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNums.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'), 10);
          if (target === 785) {
            animateCGPA(num, 7.85);
          } else {
            animateNumber(num, target);
          }
        });
      }
    });
  }, { threshold: 0.5 });

  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) observer.observe(heroVisual);

  function animateNumber(element, target) {
    let count = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        element.textContent = `${target}+`;
        clearInterval(timer);
      } else {
        element.textContent = `${count}+`;
      }
    }, 50);
  }

  function animateCGPA(element, target) {
    let count = 0;
    const timer = setInterval(() => {
      count += 0.2;
      if (count >= target) {
        element.textContent = target.toFixed(2);
        clearInterval(timer);
      } else {
        element.textContent = count.toFixed(2);
      }
    }, 40);
  }
}

/* ==========================================================================
   7. Skill Progress Bars Animation
   ========================================================================== */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress;
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   8. Category Filtering Engine (Skills & Projects)
   ========================================================================== */
function initFilters() {
  // Skill Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // Project Filters
  const projFilterBtns = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-proj-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   9. Terminal Snippet Tab Switcher
   ========================================================================== */
function initTerminalTabs() {
  const termTabs = document.querySelectorAll('.term-tab');
  const codeViews = document.querySelectorAll('.code-view');

  termTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      termTabs.forEach(t => t.classList.remove('active'));
      codeViews.forEach(v => v.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetView = document.getElementById(targetId);
      if (targetView) targetView.classList.add('active');
    });
  });
}

/* ==========================================================================
   10. Native Dialog Modal System for Project Specifications
   ========================================================================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body-content');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalCloseAction = document.getElementById('modal-close-action');
  const modalExternalLink = document.getElementById('modal-external-link');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const projectDetails = {
    toxicmatch: {
      title: "Toxic Match ☠️ - Relationship Toxicity & Assessment Platform",
      link: "https://aadi-iii.github.io/toxic-match/",
      content: `
        <h4><i class="fa-solid fa-skull-crossbones text-toxic"></i> About Toxic Match</h4>
        <p style="margin-bottom:1rem;">An interactive relationship assessment platform designed to answer: <em>“Is this love… or are you just ignoring the red flags?”</em></p>

        <h5 style="color:var(--primary-color); margin-bottom:0.5rem;">Core Experiences Built:</h5>
        <ul style="margin-left:1.25rem; margin-bottom:1rem; color:var(--text-muted);">
          <li><strong>🚩 Red Flag Quiz:</strong> A solo assessment that analyzes relationship scenarios and calculates a toxicity score.</li>
          <li><strong>💔 Toxicity Match Calculator:</strong> A two-person experience comparing responses to determine dynamic toxicity and compatibility.</li>
        </ul>

        <h5 style="color:var(--primary-color); margin-bottom:0.5rem;">Tech Stack & Engineering Highlights:</h5>
        <ul style="margin-left:1.25rem; margin-bottom:1rem; color:var(--text-muted);">
          <li>⚡ Dynamic quiz and scoring system using Vanilla JavaScript.</li>
          <li>🧠 Personalized toxicity classifications & result messages.</li>
          <li>🔥 Firebase Firestore integration for storing anonymous analytics.</li>
          <li>🔐 Strict Firestore security rules preventing unauthorized reads, updates & deletes.</li>
          <li>🎨 Custom UI/UX with interactive states, smooth animations, and responsive layouts.</li>
          <li>🚀 Live deployment on GitHub Pages.</li>
        </ul>
      `
    },
    onedrop: {
      title: "OneDrop - Full-Stack Blood Donation Platform",
      link: "https://1drop4u.online",
      content: `
        <h4 style="font-style:italic; color:var(--primary-color); margin-bottom:0.75rem;">“Saving Lives, One Drop at a Time.”</h4>
        <p style="margin-bottom:1rem;"><strong>OneDrop (1drop4u.online)</strong> is a centralized web-based blood donation and request management platform bringing Donors, Receivers, and Admins into one seamless workflow.</p>
        
        <h5 style="color:var(--primary-color); margin-bottom:0.5rem;">Key Built Features:</h5>
        <ul style="margin-left:1.25rem; margin-bottom:1rem; color:var(--text-muted);">
          <li><strong>Role-Based Platform:</strong> Dedicated tailored dashboards for Donors, Receivers, and Admins.</li>
          <li><strong>Blood Request Workflow:</strong> Receivers create urgent requests; eligible donors discover and respond.</li>
          <li><strong>Request Acceptance & Confirmation Flow:</strong> Acceptance updates request state; confirmation moves donations toward admin verification.</li>
          <li><strong>Privacy Profile System:</strong> Donor contact information is strictly protected until a request is accepted.</li>
          <li><strong>QR-Verified Digital Certificates:</strong> QR-based verification system allowing external verification of completed donation certificates.</li>
          <li><strong>Firebase Infrastructure:</strong> Authentication & Cloud Firestore backends for accounts, requests, and history.</li>
        </ul>
      `
    },
    lovecalc: {
      title: "Love Calculator ❤️ - Gamified Compatibility Suite",
      link: "https://aadi-iii.github.io/Love-Calculator/",
      content: `
        <h4 style="font-style:italic; color:var(--secondary-color); margin-bottom:0.75rem;">“Forget random percentages. Earn your love score.”</h4>
        <p style="margin-bottom:1rem;">A playful interactive compatibility experience that turns percentage scoring into a mini gaming journey.</p>
        
        <h5 style="color:var(--primary-color); margin-bottom:0.5rem;">Interactive Challenge Modules:</h5>
        <ul style="margin-left:1.25rem; margin-bottom:1rem; color:var(--text-muted);">
          <li><strong>🧠 Heart Memory Match:</strong> Match hidden pairs while managing moves and time.</li>
          <li><strong>🔤 Love Word Scramble:</strong> Unscramble romantic terms under attempt-based scoring.</li>
          <li><strong>🏹 Cupid's Arrow:</strong> Test timing accuracy to hit moving heart targets.</li>
          <li><strong>💘 Who Falls First?:</strong> Rapid-fire scenario game tracking reactions to determine who falls first.</li>
          <li><strong>📊 Dynamic Scoring & Analytics:</strong> Combines performance across all games into a final score, backed by Firebase Firestore analytics and security rules.</li>
        </ul>
      `
    },
    citycare: {
      title: "City Care Hospital - Healthcare Web Application",
      link: "https://aadi-iii.github.io/city-care-hospital-new/",
      content: `
        <h4><i class="fa-solid fa-hospital text-blue"></i> Responsive Hospital Web App</h4>
        <p style="margin-bottom:1rem;">Comprehensive responsive healthcare portal designed for department navigation, doctor appointment scheduling, emergency contacts, and accessibility.</p>
        
        <h5 style="color:var(--primary-color); margin-bottom:0.5rem;">Key Highlights:</h5>
        <ul style="margin-left:1.25rem; margin-bottom:1rem; color:var(--text-muted);">
          <li>Interactive doctor scheduling & booking interface.</li>
          <li>Responsive HTML5/CSS3 layout optimized for desktop & mobile.</li>
          <li>Deployed live on GitHub Pages.</li>
        </ul>
      `
    },
    spiderbot: {
      title: "IoT Spider Robot - 12 Servo Quad Systems",
      link: null,
      content: `
        <h4><i class="fa-solid fa-spider text-teal"></i> Robotics & Hardware Kinematics</h4>
        <p style="margin-bottom:1rem;">A 12 Servo Motor Quadruped Robotics System engineered using Arduino Nano microcontrollers.</p>
        
        <h5 style="color:var(--primary-color); margin-bottom:0.5rem;">Hardware & Specs:</h5>
        <ul style="margin-left:1.25rem; margin-bottom:1rem; color:var(--text-muted);">
          <li><strong>Microcontroller:</strong> Arduino Nano ATmega328P.</li>
          <li><strong>Actuators:</strong> 12 SG90 Micro Servo Motors providing 3-DOF per leg.</li>
          <li><strong>Power Distribution:</strong> Dedicated high-current external power bus to avoid brownouts.</li>
          <li><strong>Gait Control:</strong> Synchronized tripod walking pattern and turning routines programmed in C/C++.</li>
        </ul>
      `
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-proj');
      const data = projectDetails[key];

      if (data && modal) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;

        if (data.link && data.link.startsWith('http')) {
          modalExternalLink.href = data.link;
          modalExternalLink.classList.remove('hidden');
        } else {
          modalExternalLink.classList.add('hidden');
        }

        if (typeof modal.showModal === 'function') {
          modal.showModal();
        } else {
          modal.setAttribute('open', '');
        }
      }
    });
  });

  const closeModal = () => {
    if (modal) {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    }
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalCloseAction) modalCloseAction.addEventListener('click', closeModal);

  // Close on clicking backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) closeModal();
    });
  }
}

/* ==========================================================================
   11. Quick Resume Specs Modal Trigger
   ========================================================================== */
function initResumeQuickSpecs() {
  const resumeBtn = document.getElementById('quick-resume-btn');
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body-content');
  const modalExternalLink = document.getElementById('modal-external-link');

  if (!resumeBtn) return;

  resumeBtn.addEventListener('click', () => {
    modalTitle.textContent = "Aditya Sharma - Resume Summary Specs";
    modalBody.innerHTML = `
      <div style="font-family:var(--font-body);">
        <h4 style="color:var(--primary-color); margin-bottom:0.5rem;"><i class="fa-solid fa-user-graduate"></i> Education</h4>
        <p style="margin-bottom:1rem; color:var(--text-muted);">
          <strong>Diploma in Computer Science & Engineering</strong><br>
          Amity University, Greater Noida (2024 - 2027) | <strong>CGPA: 7.85 / 10</strong>
        </p>

        <h4 style="color:var(--primary-color); margin-bottom:0.5rem;"><i class="fa-solid fa-gears"></i> Technical Skill Matrix</h4>
        <ul style="margin-left:1.25rem; margin-bottom:1rem; color:var(--text-muted);">
          <li><strong>Languages:</strong> Java, Python, C, JavaScript</li>
          <li><strong>Web & Cloud:</strong> HTML, CSS, JS, Firebase Auth, Cloud Firestore, Responsive Design</li>
          <li><strong>IoT & Robotics:</strong> Arduino Nano, 12 Servo Motor Control, Embedded Programming</li>
          <li><strong>Tools:</strong> GitHub, GitHub Pages, Custom Domain Deployment, DSA Fundamentals</li>
        </ul>

        <h4 style="color:var(--primary-color); margin-bottom:0.5rem;"><i class="fa-solid fa-phone"></i> Contact Details</h4>
        <p style="color:var(--text-muted);">
          Location: Ghaziabad, UP | Phone: +91 7838376187<br>
          Email: adityasharma59444@gmail.com<br>
          GitHub: github.com/aadi-iii | LinkedIn: linkedin.com/in/aditya-sharma-624177355
        </p>
      </div>
    `;
    modalExternalLink.classList.add('hidden');

    if (modal) {
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
    }
  });
}

/* ==========================================================================
   12. Contact Form Validation & Toast Notification System
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showFieldError('contact-name', true);
      isValid = false;
    } else {
      showFieldError('contact-name', false);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showFieldError('contact-email', true);
      isValid = false;
    } else {
      showFieldError('contact-email', false);
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      showFieldError('contact-subject', true);
      isValid = false;
    } else {
      showFieldError('contact-subject', false);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      showFieldError('contact-message', true);
      isValid = false;
    } else {
      showFieldError('contact-message', false);
    }

    if (isValid) {
      showToast(`Thank you, ${nameInput.value.trim()}! Your message has been sent to Aditya.`, 'success');
      form.reset();
    } else {
      showToast('Please correct the highlighted errors before submitting.', 'error');
    }
  });

  function showFieldError(inputId, isError) {
    const input = document.getElementById(inputId);
    const parent = input.parentElement;
    if (isError) {
      parent.classList.add('error');
    } else {
      parent.classList.remove('error');
    }
  }
}

/* Helper function: Toast Notifications */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="${type === 'success' ? 'fa-solid fa-circle-check text-green' : 'fa-solid fa-triangle-exclamation text-red'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
