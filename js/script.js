/* =========================================================
   POLANCO'S MIGRACIÓN — script.js
   JavaScript vanilla, sin dependencias externas.
   ========================================================= */

(function () {
  "use strict";

  /* -------------------------------------------------
     1. Header: sombra/fondo sólido al hacer scroll
     ------------------------------------------------- */
  var header = document.querySelector(".site-header");

  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  if (header) {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------------------------------------------------
     1b. Botón flotante de WhatsApp: aparece solo después
     de pasar el hero (donde ya hay un CTA de WhatsApp visible)
     ------------------------------------------------- */
  var floatingWhatsapp = document.getElementById("floating-whatsapp");
  var heroSection = document.getElementById("inicio");

  function onScrollFloating() {
    if (!floatingWhatsapp || !heroSection) return;
    var heroBottom = heroSection.getBoundingClientRect().bottom;
    if (heroBottom < 0) {
      floatingWhatsapp.classList.add("is-visible");
    } else {
      floatingWhatsapp.classList.remove("is-visible");
    }
  }

  if (floatingWhatsapp && heroSection) {
    onScrollFloating();
    window.addEventListener("scroll", onScrollFloating, { passive: true });
  }

  /* -------------------------------------------------
     1c. Scroll-spy: resalta el enlace de la sección visible
     ------------------------------------------------- */
  var navLinks = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window && navLinks.length) {
    var spySections = Array.prototype.map
      .call(navLinks, function (link) {
        var href = link.getAttribute("href");
        return href && href.charAt(0) === "#" ? document.querySelector(href) : null;
      })
      .filter(Boolean);

    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var activeHref = "#" + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    spySections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* -------------------------------------------------
     2. Menú móvil
     ------------------------------------------------- */
  var menuToggle = document.querySelector(".menu-toggle");
  var mainNav = document.querySelector(".main-nav");

  function closeMenu() {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* -------------------------------------------------
     3. Acordeón de preguntas frecuentes
     ------------------------------------------------- */
  var accordionTriggers = document.querySelectorAll(".accordion-trigger");

  accordionTriggers.forEach(function (trigger) {
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;

    trigger.addEventListener("click", function () {
      var isOpen = trigger.getAttribute("aria-expanded") === "true";

      // Cierra los demás paneles (solo uno abierto a la vez)
      accordionTriggers.forEach(function (otherTrigger) {
        if (otherTrigger === trigger) return;
        var otherPanel = document.getElementById(otherTrigger.getAttribute("aria-controls"));
        otherTrigger.setAttribute("aria-expanded", "false");
        if (otherPanel) otherPanel.style.maxHeight = null;
      });

      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
    });
  });

  /* -------------------------------------------------
     4. Formulario de contacto -> WhatsApp
     Sin backend propio: arma el mensaje y abre WhatsApp
     con los datos precargados hacia el número de la empresa.
     ------------------------------------------------- */
  var WHATSAPP_NUMBER = "18094018199"; // +1 809 401 8199, sin signos
  var contactForm = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = contactForm.querySelector("#cf-name").value.trim();
      var phone = contactForm.querySelector("#cf-phone").value.trim();
      var service = contactForm.querySelector("#cf-service").value;
      var message = contactForm.querySelector("#cf-message").value.trim();

      if (!name || !phone || !message) {
        if (formStatus) {
          formStatus.textContent = "Por favor completa nombre, teléfono y mensaje.";
          formStatus.dataset.state = "error";
        }
        return;
      }

      var lines = [
        "Hola, mi nombre es " + name + ".",
        service ? "Estoy interesado/a en: " + service + "." : "",
        "Teléfono de contacto: " + phone + ".",
        "",
        message
      ].filter(Boolean);

      var text = encodeURIComponent(lines.join("\n"));
      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;

      if (formStatus) {
        formStatus.textContent = "Abriendo WhatsApp para enviar tu mensaje...";
        formStatus.dataset.state = "success";
      }

      window.open(url, "_blank", "noopener");
      contactForm.reset();
    });
  }

  /* -------------------------------------------------
     5. Año actual en el footer
     ------------------------------------------------- */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
