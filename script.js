// ===== DYNAMIC DATA =====
const servicesData = [
  {
    title: "Website Development",
    description: "Custom, responsive websites built with modern standards — fast, SEO friendly, and secure.",
    icon: "🌐"
  },
  {
    title: "App Development",
    description: "Android & iOS apps with great UX and robust backends for production-ready products.",
    icon: "📱"
  },
  {
    title: "Software & Automation",
    description: "Automation tools and custom software that reduce manual work and increase productivity.",
    icon: "⚙️"
  }
];

const founderData = {
  name: "Narala Nitish Kumar",
  fatherName: "Mr.Narala Srinivasulu",
  title: "Founder & Lead Developer",
  bio: "Passionate software engineer with 1+ years of experience in web and mobile app development. Nithish founded NNK Software Solutions to help startups and small businesses build digital products that scale.",
  expertise: ["Web Development", "Mobile Apps", "Automation", "System Design", "UI/UX Design","Graphic Design"],
  image: "nithish.png",
  contact: "nnksoftwaresolutions@gmail.com",
  social: {
    linkedin: "https://www.linkedin.com/in/narala-nitishkumar-22a744280/",
    github: "#",
    twitter: "#"
  }
};

const projectsData = [
  {
    id: 1,
    title: "Simple Billing Software",
    description: "Desktop billing app built for small shops to automate invoice generation.",
    image: "images/project1.jpg",
    category: "Desktop App"
  },
  {
    id: 2,
    title: "Flipkart Scraper Automation",
    description: "Web automation tool to gather product listings and price data.",
    image: "images/project2.jpg",
    category: "Automation"
  },
  {
    id: 3,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with payment gateway integration.",
    image: "images/project3.jpg",
    category: "Web Development"
  },
  {
    id: 4,
    title: "Task Management App",
    description: "Mobile app for team collaboration and task tracking.",
    image: "images/project4.jpg",
    category: "Mobile App"
  }
];

// ===== DYNAMIC RENDERING =====
function renderServices() {
  const container = document.querySelector('.cards');
  if (!container) return;
  
  container.innerHTML = servicesData.map(service => `
    <article class="card" style="opacity: 0; animation: fadeInUp 0.6s ease-out forwards;">
      <div style="font-size: 2.5rem; margin-bottom: 15px;">${service.icon}</div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    </article>
  `).join('');
}

function renderFounder() {
  const container = document.querySelector('.founder-section');
  if (!container) return;
  
  const expertiseList = founderData.expertise.map(exp => `<span class="badge">${exp}</span>`).join('');
  
  container.innerHTML = `
    <div class="founder-container" style="opacity: 0; animation: fadeInUp 0.8s ease-out forwards;">
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
        </div>
      </div>
    </div>
  `;
}

function renderProjects(limit = 2) {
  const container = document.querySelector('.projects-grid');
  if (!container) return;
  
  const projectsToShow = projectsData.slice(0, limit);
  container.innerHTML = projectsToShow.map((proj, idx) => `
    <div class="proj" style="opacity: 0; animation: slideIn 0.6s ease-out ${idx * 0.1}s forwards;">
      <img src="${proj.image}" alt="${proj.title}" loading="lazy">
      <div class="proj-content">
        <span class="proj-category">${proj.category}</span>
        <h4>${proj.title}</h4>
        <p>${proj.description}</p>
      </div>
    </div>
  `).join('');
}

// ===== FETCH FROM API (with fallback) =====
async function fetchDataFromAPI() {
  const base = '';
  try {
    const [sRes, fRes, pRes] = await Promise.all([
      fetch(base + '/api/services'),
      fetch(base + '/api/founder'),
      fetch(base + '/api/projects')
    ]);

    if (sRes.ok && fRes.ok && pRes.ok) {
      const servicesRemote = await sRes.json();
      const founderRemote = await fRes.json();
      const projectsRemote = await pRes.json();

      // Replace local data only if responses valid
      if (Array.isArray(servicesRemote) && servicesRemote.length) servicesData.splice(0, servicesData.length, ...servicesRemote);
      if (founderRemote && founderRemote.name) Object.assign(founderData, founderRemote);
      if (Array.isArray(projectsRemote) && projectsRemote.length) projectsData.splice(0, projectsData.length, ...projectsRemote);
    }
  } catch (err) {
    // network error or no backend — fallback to local data (no-op)
    console.warn('Could not fetch from API, using local data.', err);
  }
}

// ===== NAVIGATION HIGHLIGHTING =====
function highlightActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.style.borderBottom = '3px solid #ffd700';
      link.style.paddingBottom = '5px';
    }
  });
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== SCROLL ANIMATION =====
function setupScrollAnimation() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.card, .proj').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ===== HEADER EFFECTS =====
function setupHeaderEffect() {
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      header.style.backgroundColor = 'rgba(0,0,0,0.95)';
    } else {
      header.style.boxShadow = 'none';
      header.style.backgroundColor = 'rgb(0,0,0)';
    }
    
    lastScrollTop = scrollTop;
  });
}

// ===== MOBILE NAV TOGGLE =====
function toggleNav(toggleId, navSelector){
  const t = document.getElementById(toggleId);
  if (!t) return;
  t.addEventListener('click', ()=> {
    const nav = document.querySelector('.nav');
    if (nav) nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
  });
}
toggleNav('nav-toggle','nav');
toggleNav('nav-toggle-2','nav');
toggleNav('nav-toggle-3','nav');
toggleNav('nav-toggle-4','nav');
toggleNav('nav-toggle-5','nav');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  // Set footer year
  const y = new Date().getFullYear();
  ['year','year2','year3','year4','year5'].forEach(id=>{
    const el = document.getElementById(id);
    if (el) el.textContent = y;
  });

  // Render dynamic content
  // Try to fetch from backend API first, then render
  await fetchDataFromAPI();
  renderServices();
  renderFounder();
  renderProjects(2);
  
  // Setup interactions
  highlightActiveNav();
  setupSmoothScroll();
  setupScrollAnimation();
  setupHeaderEffect();

  // Contact form behaviour
  const form = document.getElementById('contactForm');
  if (form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('formMsg');
      const submitBtn = form.querySelector('button[type="submit"]');
      if (msg) msg.textContent = '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(form);
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await res.json().catch(() => ({}));
        if (res.ok) {
          if (msg) msg.textContent = 'Message sent — thank you!';
          form.reset();
        } else {
          if (msg) msg.textContent = result.error || 'Failed to send message. Try again later.';
        }
      } catch (err) {
        if (msg) msg.textContent = 'Network error. Please try again.';
        console.error('Contact submit error:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }
    });
  }
});

// ===== ANIMATION STYLES =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .nav-links a {
    transition: all 0.3s ease;
  }
  
  .nav-links a:hover {
    color: #ffd700;
    transform: translateY(-2px);
  }
  
  .card, .proj {
    transition: all 0.3s ease;
  }
  
  .card:hover, .proj:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  }
  
  /* Founder Styles */
  .founder-container {
    display: flex;
    gap: 50px;
    align-items: center;
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  }
  
  .founder-image {
    flex: 0 0 300px;
  }
  
  .founder-image img {
    width: 100%;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  .founder-info {
    flex: 1;
  }
  
  .founder-info h3 {
    font-size: 2rem;
    margin: 0 0 5px 0;
    color: #333;
  }
  
  .founder-family {
    font-size: 1.05rem;
    color: #666;
    margin: 0 0 15px 0;
    font-weight: 500;
  }
  
  .founder-title {
    font-size: 1.2rem;
    color: #ffd700;
    font-weight: 600;
    margin: 0 0 20px 0;
  }
  
  .founder-bio {
    font-size: 1rem;
    line-height: 1.8;
    color: #666;
    margin: 0 0 25px 0;
  }
  
  .expertise {
    margin: 25px 0;
  }
  
  .expertise h4 {
    margin: 0 0 15px 0;
    color: #333;
  }
  
  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .badge {
    display: inline-block;
    background: #ffd700;
    color: black;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .founder-contact {
    margin-top: 25px;
    padding-top: 25px;
    border-top: 1px solid #eee;
  }
  
  .founder-contact a {
    color: #ffd700;
    text-decoration: none;
    font-weight: 600;
  }
  
  .founder-contact a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .founder-container {
      flex-direction: column;
      gap: 30px;
    }
    
    .founder-image {
      flex: 0 0 auto;
    }
  }
`;
document.head.appendChild(style);
// Year update
document.getElementById("year").textContent = new Date().getFullYear();

// Dynamic Services
const services = [
  { title: "Website Development", text: "Fast, modern websites for businesses." },
  { title: "App Development", text: "Android & iOS apps built professionally." },
  { title: "Automation", text: "Save time with Python & cloud automation." },
  { title: "Branding", text: "Logos, UI/UX design and digital identity." }
];

const serviceContainer = document.querySelector(".cards");

services.forEach(s => {
  const card = `
    <div class="card">
      <h3>${s.title}</h3>
      <p>${s.text}</p>
    </div>
  `;
  serviceContainer.innerHTML += card;
});

// Founder
const founderSection = document.querySelector(".founder-section");

founderSection.innerHTML = `
  <div class="founder-card">
    <img src="founder.png" alt="Founder" class="founder-img">
    <h3>Nitish — Founder of NNK</h3>
    <p>Building modern digital products with passion & precision.</p>
  </div>
`;
