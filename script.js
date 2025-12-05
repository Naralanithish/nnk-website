// Client-side site script (script.js)

// ===== Helpers =====
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

// ===== Data =====
const servicesData = [
  { title: "Website Development", description: "Custom, responsive websites built with modern standards — fast, SEO friendly, and secure.", icon: "🌐" },
  { title: "App Development", description: "Android & iOS apps with great UX and robust backends for production-ready products.", icon: "📱" },
  { title: "Software & Automation", description: "Automation tools and custom software that reduce manual work and increase productivity.", icon: "⚙️" },
  { title: "Branding & UI/UX Design", description: "Logo, brand identity, and user-friendly interfaces that make products delightful.", icon: "🎨" }
];

const founderData = {
  name: "Narala Nitish Kumar",
  fatherName: "Mr. Narala Srinivasulu",
  title: "Founder & Lead Developer",
  bio: "Passionate software engineer with 1+ years of experience in web and mobile app development. Nithish founded NNK Software Solutions to help startups and small businesses build digital products that scale.",
  expertise: ["Web Development","Mobile Apps","Automation","System Design","UI/UX Design","Graphic Design"],
  image: "images/nithish.png",
  contact: "nnksoftwaresolutions@gmail.com",
  social: { linkedin: "https://www.linkedin.com/in/narala-nitishkumar-22a744280/" }
};

const projectsData = [
  { id:1, title:"Simple Billing Software", description:"Desktop billing app built for small shops to automate invoice generation.", image:"images/project1.jpg", category:"Desktop App" },
  { id:2, title:"Flipkart Scraper Automation", description:"Web automation tool to gather product listings and price data.", image:"images/project2.jpg", category:"Automation" },
  { id:3, title:"E-Commerce Platform", description:"Full-stack e-commerce solution with payment gateway integration.", image:"images/project3.jpg", category:"Web Development" },
  { id:4, title:"Task Management App", description:"Mobile app for team collaboration and task tracking.", image:"images/project4.jpg", category:"Mobile App" }
];

// ===== Rendering =====
function renderServices(selector = '.cards') {
  const container = document.querySelector(selector);
  if (!container) return;

  if (selector === '.cards') {
    container.innerHTML = servicesData.map(s => `
      <article class="card">
        <div style="font-size: 2.5rem; margin-bottom: 15px;">${s.icon}</div>
        <h3>${s.title}</h3>
        <p>${s.description}</p>
      </article>
    `).join('');
  } else {
    container.innerHTML = servicesData.map(s => `
      <article class="service-item">
        <h3>${s.title}</h3>
        <p>${s.description}</p>
      </article>
    `).join('');
  }
}

function renderFounder() {
  const container = document.querySelector('.founder-section');
  if (!container) return;

  const expertiseList = founderData.expertise.map(e => `<span class="badge">${e}</span>`).join('');

  container.innerHTML = `
    <div class="founder-container">
      <div class="founder-image">
        <img src="${founderData.image}" alt="${founderData.name}">
      </div>
      <div class="founder-info">
        <h3>${founderData.name}</h3>
        <p class="founder-family"><strong>Father:</strong> ${founderData.fatherName}</p>
        <p class="founder-title">${founderData.title}</p>
        <p class="founder-bio">${founderData.bio}</p>
        <div class="expertise">
          <h4>Expertise:</h4>
          <div class="badges">${expertiseList}</div>
        </div>
        <div class="founder-contact">
          <p><strong>Email:</strong> <a href="mailto:${founderData.contact}">${founderData.contact}</a></p>
          <p><strong>LinkedIn:</strong> <a href="${founderData.social.linkedin}" target="_blank">Connect</a></p>
        </div>
      </div>
    </div>
  `;
}

function renderProjects(limit = null, selector = '.projects-grid') {
  const container = document.querySelector(selector);
  if (!container) return;
  const list = limit ? projectsData.slice(0, limit) : projectsData;
  container.innerHTML = list.map(p => `
    <div class="proj">
      <img src="${p.image}" alt="${p.title}" loading="lazy">
      <div class="proj-content">
        <span class="proj-category">${p.category}</span>
        <h4>${p.title}</h4>
        <p>${p.description}</p>
      </div>
    </div>
  `).join('');
}

// ===== API fetch (optional remote override) =====
async function fetchDataFromAPI() {
  try {
    const [sRes, fRes, pRes] = await Promise.all([
      fetch('/api/services').catch(()=>null),
      fetch('/api/founder').catch(()=>null),
      fetch('/api/projects').catch(()=>null)
    ]);

    if (sRes && sRes.ok) {
      const data = await sRes.json();
      if (Array.isArray(data) && data.length) servicesData.splice(0, servicesData.length, ...data);
    }
    if (fRes && fRes.ok) {
      const data = await fRes.json();
      if (data && data.name) Object.assign(founderData, data);
    }
    if (pRes && pRes.ok) {
      const data = await pRes.json();
      if (Array.isArray(data) && data.length) projectsData.splice(0, projectsData.length, ...data);
    }
  } catch (err) {
    console.warn('API fetch failed, using local data', err);
  }
}

// ===== Contact form submission (client) =====
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Grab values
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const subject = document.getElementById('subject')?.value.trim();
    const message = document.getElementById('message')?.value.trim();
    const agree = document.getElementById('agree')?.checked;

    // Clear prev errors
    ['nameError','emailError','subjectError','messageError','agreeError'].forEach(clearError);

    let hasError = false;
    if (!name) { showError('nameError','Full name is required'); hasError = true; }
    if (!email || !validateEmail(email)) { showError('emailError','Valid email required'); hasError = true; }
    if (!subject) { showError('subjectError','Subject required'); hasError = true; }
    if (!message || message.length < 10) { showError('messageError','Message must be 10+ characters'); hasError = true; }
    if (!agree) { showError('agreeError','Please agree to be contacted'); hasError = true; }

    if (hasError) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const msgEl = document.getElementById('formMsg');
    if (msgEl) { msgEl.textContent = ''; msgEl.className = 'form-msg'; }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

    const payload = { name, email, phone: phone||'', subject, message };

    try {
      console.log('Contact payload', payload);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json().catch(()=>({}));
      console.log('Contact response', res.status, result);

      if (res.ok && result.ok) {
        if (msgEl) { msgEl.textContent = result.message || 'Message sent successfully.'; msgEl.classList.add('success'); }
        form.reset();
      } else {
        if (msgEl) { msgEl.textContent = result.error || 'Failed to send message'; msgEl.classList.add('error'); }
      }
    } catch (err) {
      console.error('Contact submit error', err);
      if (msgEl) { msgEl.textContent = 'Network error. Try again.'; msgEl.classList.add('error'); }
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
    }
  });
}

// ===== UI helpers =====
function highlightActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
    else a.classList.remove('active');
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function setupHeaderEffect() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset || document.documentElement.scrollTop;
    if (y > 50) { header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)'; header.style.backgroundColor = 'rgba(0,0,0,0.95)'; }
    else { header.style.boxShadow = 'none'; header.style.backgroundColor = ''; }
  });
}

// ===== Animations (intersection observer) =====
function setupScrollAnimation() {
  const opts = { threshold: 0.12, rootMargin: '0px 0px -80px 0px' };
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity = '1';
        en.target.style.transform = 'translateY(0)';
        obs.unobserve(en.target);
      }
    });
  }, opts);

  document.querySelectorAll('.card, .proj, .founder-container').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    io.observe(el);
  });
}

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', async () => {
  // Footer year(s)
  document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

  // Attempt to fetch remote data
  await fetchDataFromAPI();

  // Render depending on page
  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (page === 'index.html' || page === '') {
    renderServices('.cards');
    renderFounder();
    renderProjects(2);
  } else if (page === 'services.html') {
    renderServices('.service-list');
  } else if (page === 'project.html') {
    renderProjects(null, '.projects-grid');
  } else if (page === 'about.html') {
    renderFounder();
  }

  // Setup interactions
  highlightActiveNav();
  setupSmoothScroll();
  setupHeaderEffect();
  setupScrollAnimation();
  setupContactForm();
});