// Invitation page: guest greeting, reply form, local countdown + reveal-on-scroll.
(function () {
  // Guest data -------------------------------------------------------------
  // Everything we know about the guest (token, name, last reply) is kept in
  // localStorage under "guest". A personal link (?g=<token>) fills it; later
  // visits without a token use the saved copy. The server stays the source of
  // truth and refreshes the saved copy in the background.
  const TOKEN = /^[A-Za-z0-9_-]{22}$/;
  const urlToken = new URLSearchParams(location.search).get("g");
  const linkToken = urlToken && TOKEN.test(urlToken) ? urlToken : "";

  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem("guest"));
  } catch (e) {}
  if (!saved || !TOKEN.test(saved.token || "")) saved = null;
  // A different personal link means a different guest: forget the old data.
  if (linkToken && saved && saved.token !== linkToken) saved = null;

  const token = linkToken || (saved ? saved.token : "");
  const remember = (patch) => {
    saved = Object.assign({ token }, saved, patch);
    try {
      localStorage.setItem("guest", JSON.stringify(saved));
    } catch (e) {}
  };
  if (linkToken && !saved) remember({});

  // Keep the personal link when going back to the photo booth.
  const back = document.querySelector('.topbar a[href="/"]');
  if (back && linkToken) back.href = "/?g=" + linkToken;

  // Greeting --------------------------------------------------------------
  const greeting = document.getElementById("guest-greeting");
  let guestName = "";
  const renderGreeting = () => {
    if (greeting && guestName) greeting.textContent = t("greeting", { name: guestName });
  };
  document.addEventListener("i18n:change", renderGreeting);
  const nameField = document.getElementById("reply-name");
  const showName = (name) => {
    guestName = name;
    renderGreeting();
    if (nameField && !nameField.value) nameField.value = name;
  };
  if (token) {
    if (saved && saved.name) {
      showName(saved.name);
    } else {
      fetch("/api/guest?g=" + token)
        .then((res) => (res.ok ? res.json() : null))
        .then((guest) => {
          if (!guest || !guest.name) return;
          remember({ name: guest.name });
          showName(guest.name);
        })
        .catch(() => {});
    }
  }

  // Reply ------------------------------------------------------------------
  const form = document.getElementById("reply-form");
  if (form && token) {
    const fields = document.getElementById("reply-fields");
    const note = document.getElementById("reply-note");
    const status = document.getElementById("reply-status");
    const guestsField = document.getElementById("reply-guests-field");
    const attendingInputs = form.querySelectorAll('input[name="attending"]');
    const MAX_GUESTS = 5;
    const guestsInput = document.getElementById("reply-guests");
    const guestsValue = document.getElementById("reply-guests-value");
    const stepButtons = form.querySelectorAll(".stepper__btn");
    const setGuests = (n) => {
      const count = Math.min(MAX_GUESTS, Math.max(1, Math.round(Number(n)) || 1));
      guestsInput.value = String(count);
      guestsValue.textContent = String(count);
      stepButtons[0].classList.toggle("is-limit", count <= 1);
      stepButtons[1].classList.toggle("is-limit", count >= MAX_GUESTS);
      stepButtons.forEach((button) => button.setAttribute("aria-disabled", button.classList.contains("is-limit")));
    };
    stepButtons.forEach((button) =>
      button.addEventListener("click", () => setGuests(Number(guestsInput.value) + Number(button.dataset.step)))
    );
    // Notes and statuses are keys, so i18n.apply() keeps them in the current language.
    const setNote = (key) => {
      note.dataset.i18n = key;
      note.textContent = t(key);
    };
    const setStatus = (key, isError) => {
      if (key) status.dataset.i18n = key;
      else delete status.dataset.i18n;
      status.textContent = key ? t(key) : "";
      status.classList.toggle("is-error", Boolean(isError));
    };
    const syncGuests = () => {
      guestsField.hidden = form.elements.attending.value === "no";
    };
    attendingInputs.forEach((input) => input.addEventListener("change", syncGuests));

    const fillForm = (reply) => {
      form.elements.name.value = reply.name;
      form.elements.attending.value = reply.attending ? "yes" : "no";
      if (reply.attending) setGuests(reply.guests);
      form.elements.message.value = reply.message;
      syncGuests();
      setNote("reply.noteDone");
    };

    fields.disabled = false;
    setNote("reply.noteOpen");
    syncGuests();

    // A guest who already replied sees (and can change) their answer: first
    // from the saved copy, then refreshed from the server.
    if (saved && saved.reply) fillForm(saved.reply);
    fetch("/api/reply?g=" + token)
      .then((res) => (res.ok ? res.json() : null))
      .then((reply) => {
        if (!reply) return;
        remember({ reply });
        fillForm(reply);
      })
      .catch(() => {});

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const attending = form.elements.attending.value === "yes";
      const reply = {
        name: form.elements.name.value.trim(),
        attending,
        guests: attending ? Number(form.elements.guests.value) : 0,
        message: form.elements.message.value.trim(),
      };
      fields.disabled = true;
      setStatus("reply.sending");
      try {
        const res = await fetch("/api/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.assign({ g: token }, reply)),
        });
        if (res.ok) {
          remember({ reply });
          setNote("reply.noteDone");
          setStatus(attending ? "reply.thanksYes" : "reply.thanksNo");
        } else {
          const data = await res.json().catch(() => null);
          const key = data && data.error ? "err." + data.error : "err.generic";
          setStatus(i18n.has(key) ? key : "err.generic", true);
        }
      } catch (e) {
        setStatus("err.generic", true);
      }
      fields.disabled = false;
    });
  }

  // Countdown -------------------------------------------------------------
  const countdown = document.getElementById("countdown");
  if (countdown) {
    const target = new Date(countdown.dataset.date).getTime();
    const units = {};
    countdown.querySelectorAll("[data-unit]").forEach((el) => {
      units[el.dataset.unit] = el;
    });
    const pad = (n) => String(n).padStart(2, "0");

    const tick = () => {
      const diff = target - Date.now();
      if (Number.isNaN(target)) return;
      if (diff <= 0) {
        countdown.outerHTML = '<p class="countdown__done" data-i18n="countdown.done"></p>';
        i18n.apply();
        clearInterval(timer);
        return;
      }
      const s = Math.floor(diff / 1000);
      units.days.textContent = Math.floor(s / 86400);
      units.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      units.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      units.seconds.textContent = pad(s % 60);
    };

    const timer = setInterval(tick, 1000);
    tick();
  }

  // Reveal on scroll ------------------------------------------------------
  const items = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
})();
