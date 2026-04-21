/* =========================================================
   LuciData — Premium Digital Services
   File: script.js
   ========================================================= */

(() => {
  "use strict";

  /* =========================
     CONFIG
     ========================= */
  const SELECTORS = {
    header: ".site-header",
    navToggle: ".nav-toggle",
    mobileMenu: "#mobile-menu",
    mobileNavLinks: ".mobile-nav-link",
    navLinks: ".nav-link",
    allSectionLinks: 'a[href^="#"]',
    sections: "main section[id]",
    revealItems: ".reveal",
    contactForm: "#contactForm",
    formStatus: "#formStatus",
    backToTop: "#backToTop"
  };

  const CLASSNAMES = {
    headerScrolled: "is-scrolled",
    menuOpen: "is-open",
    toggleActive: "is-active",
    activeNav: "active",
    revealVisible: "is-visible",
    backToTopVisible: "is-visible",
    invalid: "is-invalid",
    valid: "is-valid",
    formSuccess: "is-success",
    formError: "is-error"
  };

  const CONTACT = {
    whatsappNumber: "40793664492",
    email: "LuciData2026@outlook.com",
    phone: "0793664492"
  };

  /* =========================
     ELEMENT REFERENCES
     ========================= */
  const header = document.querySelector(SELECTORS.header);
  const navToggle = document.querySelector(SELECTORS.navToggle);
  const mobileMenu = document.querySelector(SELECTORS.mobileMenu);
  const navLinks = Array.from(document.querySelectorAll(SELECTORS.navLinks));
  const mobileNavLinks = Array.from(document.querySelectorAll(SELECTORS.mobileNavLinks));
  const allAnchorSectionLinks = Array.from(document.querySelectorAll(SELECTORS.allSectionLinks));
  const sections = Array.from(document.querySelectorAll(SELECTORS.sections));
  const revealItems = Array.from(document.querySelectorAll(SELECTORS.revealItems));
  const contactForm = document.querySelector(SELECTORS.contactForm);
  const formStatus = document.querySelector(SELECTORS.formStatus);
  const backToTopButton = document.querySelector(SELECTORS.backToTop);

  /* =========================
     STATE
     ========================= */
  const state = {
    mobileMenuOpen: false
  };

  /* =========================
     HELPERS
     ========================= */
  const isElement = (value) => value instanceof Element;

  const getHeaderHeight = () => {
    if (!header) return 0;
    return header.offsetHeight || 0;
  };

  const getTargetFromHash = (hash) => {
    if (!hash || hash === "#") return null;
    try {
      return document.querySelector(hash);
    } catch (error) {
      return null;
    }
  };

  const scrollToElement = (element) => {
    if (!isElement(element)) return;

    const headerHeight = getHeaderHeight();
    const extraOffset = 14;
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    const targetY = Math.max(elementTop - headerHeight - extraOffset, 0);

    window.scrollTo({
      top: targetY,
      behavior: "smooth"
    });
  };

  const setActiveNavLink = (sectionId) => {
    if (!sectionId) return;

    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle(CLASSNAMES.activeNav, isMatch);
    });
  };

  const clearFormStateClasses = (element) => {
    if (!isElement(element)) return;
    element.classList.remove(CLASSNAMES.invalid, CLASSNAMES.valid);
  };

  const setFieldError = (fieldName, message = "") => {
    const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);
    const field = contactForm?.querySelector(`[name="${fieldName}"]`);

    if (errorElement) {
      errorElement.textContent = message;
    }

    if (field) {
      field.setAttribute("aria-invalid", message ? "true" : "false");

      if (message) {
        field.classList.remove(CLASSNAMES.valid);
        field.classList.add(CLASSNAMES.invalid);
      } else if (field.value.trim()) {
        field.classList.remove(CLASSNAMES.invalid);
        field.classList.add(CLASSNAMES.valid);
      } else {
        clearFormStateClasses(field);
      }
    }
  };

  const setFormStatus = (message, type = "") => {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.remove(CLASSNAMES.formSuccess, CLASSNAMES.formError);

    if (type === "success") {
      formStatus.classList.add(CLASSNAMES.formSuccess);
    }

    if (type === "error") {
      formStatus.classList.add(CLASSNAMES.formError);
    }
  };

  const sanitizeText = (value) => {
    return String(value || "").replace(/\s+/g, " ").trim();
  };

  const isValidEmail = (email) => {
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return emailPattern.test(email);
  };

  const closeMobileMenu = () => {
    if (!navToggle || !mobileMenu) return;

    state.mobileMenuOpen = false;
    navToggle.classList.remove(CLASSNAMES.toggleActive);
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");

    mobileMenu.classList.remove(CLASSNAMES.menuOpen);
    mobileMenu.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
  };

  const openMobileMenu = () => {
    if (!navToggle || !mobileMenu) return;

    state.mobileMenuOpen = true;
    navToggle.classList.add(CLASSNAMES.toggleActive);
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");

    mobileMenu.classList.add(CLASSNAMES.menuOpen);
    mobileMenu.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
  };

  const toggleMobileMenu = () => {
    if (state.mobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const updateHeaderState = () => {
    if (!header) return;
    const isScrolled = window.scrollY > 20;
    header.classList.toggle(CLASSNAMES.headerScrolled, isScrolled);
  };

  const updateBackToTopVisibility = () => {
    if (!backToTopButton) return;
    const shouldShow = window.scrollY > 500;
    backToTopButton.classList.toggle(CLASSNAMES.backToTopVisible, shouldShow);
  };

  /* =========================
     NAVIGATION
     ========================= */
  const setupSmoothScrolling = () => {
    if (!allAnchorSectionLinks.length) return;

    allAnchorSectionLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || !href.startsWith("#")) return;

        const targetElement = getTargetFromHash(href);
        if (!targetElement) return;

        event.preventDefault();

        if (state.mobileMenuOpen) {
          closeMobileMenu();
        }

        scrollToElement(targetElement);

        if (history.pushState) {
          history.pushState(null, "", href);
        } else {
          window.location.hash = href;
        }
      });
    });
  };

  const setupMobileMenu = () => {
    if (!navToggle || !mobileMenu) return;

    navToggle.addEventListener("click", toggleMobileMenu);

    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980 && state.mobileMenuOpen) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.mobileMenuOpen) {
        closeMobileMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!state.mobileMenuOpen) return;

      const clickedInsideMenu = mobileMenu.contains(event.target);
      const clickedToggle = navToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMobileMenu();
      }
    });
  };

  const setupActiveSectionHighlight = () => {
    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "-35% 0px -50% 0px",
      threshold: 0.01
    };

    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      visibleEntries.forEach((entry) => {
        const sectionId = entry.target.getAttribute("id");
        if (sectionId) {
          setActiveNavLink(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  };

  /* =========================
     REVEAL ANIMATIONS
     ========================= */
  const setupRevealAnimations = () => {
    if (!revealItems.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      revealItems.forEach((item) => item.classList.add(CLASSNAMES.revealVisible));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(CLASSNAMES.revealVisible);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  };

  /* =========================
     CONTACT FORM VALIDATION
     ========================= */
  const getFormValues = () => {
    if (!contactForm) {
      return {
        name: "",
        email: "",
        service: "",
        message: ""
      };
    }

    const formData = new FormData(contactForm);

    return {
      name: sanitizeText(formData.get("name")),
      email: sanitizeText(formData.get("email")),
      service: sanitizeText(formData.get("service")),
      message: sanitizeText(formData.get("message"))
    };
  };

  const validateFormValues = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Please enter your name.";
    } else if (values.name.length < 2) {
      errors.name = "Name must contain at least 2 characters.";
    }

    if (!values.email) {
      errors.email = "Please enter your email address.";
    } else if (!isValidEmail(values.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!values.service) {
      errors.service = "Please select the service you need.";
    }

    if (!values.message) {
      errors.message = "Please enter your message.";
    } else if (values.message.length < 20) {
      errors.message = "Message must contain at least 20 characters.";
    }

    return errors;
  };

  const renderValidationErrors = (errors, values) => {
    const fieldNames = ["name", "email", "service", "message"];

    fieldNames.forEach((fieldName) => {
      if (errors[fieldName]) {
        setFieldError(fieldName, errors[fieldName]);
      } else {
        const currentField = contactForm?.querySelector(`[name="${fieldName}"]`);
        if (currentField && sanitizeText(values[fieldName])) {
          currentField.classList.remove(CLASSNAMES.invalid);
          currentField.classList.add(CLASSNAMES.valid);
          currentField.setAttribute("aria-invalid", "false");
        }
        setFieldError(fieldName, "");
      }
    });
  };

  const buildMailtoLink = (values) => {
    const subject = encodeURIComponent(`LuciData Project Inquiry — ${values.service}`);
    const body = encodeURIComponent(
      [
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        `Service Needed: ${values.service}`,
        ``,
        `Message:`,
        `${values.message}`,
        ``,
        `Phone Contact: ${CONTACT.phone}`,
        `Brand: LuciData`
      ].join("\n")
    );

    return `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!contactForm) return;

    const values = getFormValues();
    const errors = validateFormValues(values);

    renderValidationErrors(errors, values);

    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      setFormStatus("Please correct the highlighted fields and try again.", "error");

      const firstInvalidField = contactForm.querySelector(`.${CLASSNAMES.invalid}`);
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    setFormStatus(
      "Your request looks excellent. Your email client will open so you can send the message directly to LuciData.",
      "success"
    );

    try {
      const mailtoLink = buildMailtoLink(values);
      window.location.href = mailtoLink;
    } catch (error) {
      setFormStatus(
        "Your message is valid, but the email client could not be opened automatically. Please email LuciData2026@outlook.com directly.",
        "error"
      );
      return;
    }

    window.setTimeout(() => {
      contactForm.reset();

      const fields = contactForm.querySelectorAll("input, textarea, select");
      fields.forEach((field) => {
        field.classList.remove(CLASSNAMES.invalid, CLASSNAMES.valid);
        field.setAttribute("aria-invalid", "false");
      });

      const errorElements = contactForm.querySelectorAll(".field-error");
      errorElements.forEach((element) => {
        element.textContent = "";
      });
    }, 300);
  };

  const handleLiveValidation = (event) => {
    const target = event.target;
    if (!target || !target.name || !contactForm?.contains(target)) return;

    const values = getFormValues();
    const errors = validateFormValues(values);

    if (target.name in errors) {
      setFieldError(target.name, errors[target.name]);
    } else {
      setFieldError(target.name, "");
    }

    const currentStatus = formStatus?.textContent?.trim();
    if (currentStatus) {
      setFormStatus("", "");
    }
  };

  const setupContactForm = () => {
    if (!contactForm) return;

    const fields = contactForm.querySelectorAll("input, textarea, select");
    fields.forEach((field) => {
      field.setAttribute("aria-invalid", "false");
      field.addEventListener("input", handleLiveValidation);
      field.addEventListener("change", handleLiveValidation);
      field.addEventListener("blur", handleLiveValidation);
    });

    contactForm.addEventListener("submit", handleFormSubmit);
  };

  /* =========================
     WHATSAPP IMPROVEMENTS
     ========================= */
  const setupWhatsAppLinks = () => {
    const whatsappLinks = document.querySelectorAll(`a[href*="wa.me/${CONTACT.whatsappNumber}"]`);
    whatsappLinks.forEach((link) => {
      const currentHref = link.getAttribute("href") || "";
      if (!currentHref.includes("?text=")) {
        const message = encodeURIComponent(
          "Hello LuciData, I would like to discuss a premium website or digital solution."
        );
        link.setAttribute("href", `https://wa.me/${CONTACT.whatsappNumber}?text=${message}`);
      }
    });
  };

  /* =========================
     BACK TO TOP
     ========================= */
  const setupBackToTop = () => {
    if (!backToTopButton) return;

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  };

  /* =========================
     LOAD HASH SUPPORT
     ========================= */
  const handleInitialHash = () => {
    if (!window.location.hash) return;

    const targetElement = getTargetFromHash(window.location.hash);
    if (!targetElement) return;

    window.setTimeout(() => {
      scrollToElement(targetElement);
    }, 120);
  };

  /* =========================
     SCROLL EVENTS
     ========================= */
  const handleScroll = () => {
    updateHeaderState();
    updateBackToTopVisibility();
  };

  /* =========================
     INIT
     ========================= */
  const init = () => {
    updateHeaderState();
    updateBackToTopVisibility();

    setupMobileMenu();
    setupSmoothScrolling();
    setupActiveSectionHighlight();
    setupRevealAnimations();
    setupContactForm();
    setupWhatsAppLinks();
    setupBackToTop();
    handleInitialHash();

    window.addEventListener("scroll", handleScroll, { passive: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
