const API_BASE = window.TECH_IT_OUT_API || "/api";

const services = [
  { icon: "🛜", title: "Free IT Support", text: "Help with Wi-Fi, connectivity, basic setup, account guidance and everyday technology problems.", action: "Ask for Help" },
  { icon: "🔧", title: "Repairs & Troubleshooting", text: "Tell us about a device or technical problem and request support.", action: "Request Support" },
  { icon: "🛒", title: "Product Guidance", text: "Free help choosing the right laptop, PlayStation, Xbox or other electronics before you buy.", action: "Get Advice" },
  { icon: "🎮", title: "Gaming & Accounts", text: "Guidance with PSN / Xbox account setup and general gaming technology support.", action: "Ask for Help" },
  { icon: "🎓", title: "Education & Tutoring", text: "Exam questions, tutoring and school / college technology tips.", action: "Learn More" },
  { icon: "🌐", title: "Web & Technology Services", text: "Technology projects and digital services, with more offerings to be added.", action: "Enquire" },
  { icon: "📦", title: "Technology Products", text: "Technology products and projects can be added as Tech It Out expands.", action: "Enquire" },
  { icon: "🏠", title: "Home Technology Help", text: "Practical guidance for setting up and using technology at home.", action: "Ask for Help" },
  { icon: "🤖", title: "Future AI Support", text: "An AI-powered technology help experience is planned as the business grows.", action: "Coming Soon" }
];

const serviceGrid = document.querySelector("#service-grid");
if (serviceGrid) {
  serviceGrid.innerHTML = services.map((s, i) => `
    <article class="service-card">
      <div class="service-icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
      <a class="service-link" href="#contact" data-service="${i}">${s.action} →</a>
    </article>
  `).join("");
}

document.addEventListener("click", e => {
  const link = e.target.closest("[data-service]");
  if (!link) return;
  const service = services[Number(link.dataset.service)];
  const category = document.querySelector('[name="category"]');
  if (category) {
    const match = [...category.options].find(o => o.textContent.includes(service.title.split(" & ")[0]));
    if (match) category.value = match.value;
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
document.querySelector("#year")?.replaceChildren(document.createTextNode(new Date().getFullYear()));

function setStatus(form, message, ok = true) {
  const el = form.querySelector(".form-status");
  if (el) {
    el.textContent = message;
    el.style.color = ok ? "#138a54" : "#b42318";
  }
}
function showToast(message) {
  const t = document.querySelector("#toast");
  if (!t) return;
  t.textContent = message;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3500);
}

async function submitEnquiry(form, type) {
  const button = form.querySelector("button[type=submit]");
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Sending…";
  setStatus(form, "");
  const data = Object.fromEntries(new FormData(form).entries());
  data.type = type;
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.error || "Unable to send message.");
    setStatus(form, "Thanks — your message has been sent. We’ll be in touch.");
    form.reset();
    showToast("Message sent successfully.");
  } catch (err) {
    setStatus(form, "The online form is not connected yet. Please use the email address shown on this page while the production backend is being configured.", false);
    showToast(err.message);
  } finally {
    button.disabled = false;
    button.textContent = original;
  }
}

document.querySelector("#contact-form")?.addEventListener("submit", e => {
  e.preventDefault();
  submitEnquiry(e.currentTarget, "contact");
});
document.querySelector("#repair-form")?.addEventListener("submit", e => {
  e.preventDefault();
  submitEnquiry(e.currentTarget, "repair");
});