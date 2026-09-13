(() => {
  "use strict";
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const closeMenu = () => { mobileNav.hidden = true; toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open navigation"); };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    mobileNav.hidden = open;
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
  });
  mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => { if(event.key === "Escape" && !mobileNav.hidden) { closeMenu(); toggle.focus(); } });
  window.matchMedia("(min-width: 761px)").addEventListener("change", event => { if(event.matches) closeMenu(); });
  const form = document.querySelector("#enquiry-form");
  const result = document.querySelector("#enquiry-result");
  document.querySelectorAll("[data-interest]").forEach(link => link.addEventListener("click", () => {
    form.hidden = false; result.hidden = true;
    const value = link.dataset.interest;
    form.querySelectorAll('input[name="interest"]').forEach(input => { input.checked = input.value === value; });
  }));
  form.addEventListener("submit", event => {
    event.preventDefault();
    const nameInput = form.querySelector('[name="firstName"]');
    nameInput.setCustomValidity(nameInput.value.trim() ? "" : "Please enter a first name.");
    if(!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("firstName") || "").trim();
    document.querySelector("#result-intro").textContent = "Here’s how your enquiry would look, " + name + ".";
    document.querySelector("#result-interest").textContent = String(data.get("interest") || "");
    document.querySelector("#result-email").textContent = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    document.querySelector("#result-message").textContent = message;
    document.querySelector("#result-message-row").hidden = !message;
    form.hidden = true; result.hidden = false; result.focus({preventScroll:true});
  });
  form.querySelector('[name="firstName"]').addEventListener("input", event => event.target.setCustomValidity(""));
  document.querySelector("#edit-enquiry").addEventListener("click", () => { result.hidden = true; form.hidden = false; form.querySelector("input").focus({preventScroll:true}); });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if("IntersectionObserver" in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      for(const entry of entries) if(entry.isIntersecting) { entry.target.classList.remove("pending"); observer.unobserve(entry.target); }
    }, {threshold: 0.08, rootMargin:"0px 0px 0px 0px"});
    document.querySelectorAll(".reveal").forEach(element => { element.classList.add("pending"); observer.observe(element); });
    reduced.addEventListener("change", event => { if(event.matches) { document.querySelectorAll(".pending").forEach(element => element.classList.remove("pending")); observer.disconnect(); } });
  }
})();