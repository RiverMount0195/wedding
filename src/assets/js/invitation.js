// Invitation page: guest greeting, local countdown + reveal-on-scroll.
(function () {
  // Guest greeting --------------------------------------------------------
  // The booth page stores the guest's name in localStorage; if that's missing
  // (direct visit), fetch it. The API response is HTTP-cached, so a fetch that
  // follows the booth's one is served from cache.
  const greeting = document.getElementById("guest-greeting");
  const token = new URLSearchParams(location.search).get("g");
  let guestName = "";
  const renderGreeting = () => {
    if (greeting && guestName) greeting.textContent = t("greeting", { name: guestName });
  };
  document.addEventListener("i18n:change", renderGreeting);
  const validToken = token && /^[A-Za-z0-9_-]{22}$/.test(token);
  // Keep the personal link when going back to the photo booth.
  const back = document.querySelector('.topbar a[href="/"]');
  if (back && validToken) back.href = "/?g=" + token;
  if (greeting && validToken) {
    const show = (name) => {
      guestName = name;
      renderGreeting();
      const field = document.getElementById("reply-name");
      if (field && !field.value) field.value = name;
    };
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem("guest"));
    } catch (e) {}
    if (stored && stored.token === token && stored.name) {
      show(stored.name);
    } else {
      fetch("/api/guest?g=" + token)
        .then((res) => (res.ok ? res.json() : null))
        .then((guest) => {
          if (!guest || !guest.name) return;
          show(guest.name);
          try {
            localStorage.setItem("guest", JSON.stringify({ token, name: guest.name }));
          } catch (e) {}
        })
        .catch(() => {});
    }
  }

  // Reply ------------------------------------------------------------------
  const form = document.getElementById("reply-form");
  if (form && token && /^[A-Za-z0-9_-]{22}$/.test(token)) {
    const fields = document.getElementById("reply-fields");
    const note = document.getElementById("reply-note");
    const status = document.getElementById("reply-status");
    const guestsField = document.getElementById("reply-guests-field");
    const attendingInputs = form.querySelectorAll('input[name="attending"]');
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

    fields.disabled = false;
    setNote("reply.noteOpen");
    syncGuests();

    // A guest who already replied sees (and can change) their answer.
    fetch("/api/reply?g=" + token)
      .then((res) => (res.ok ? res.json() : null))
      .then((reply) => {
        if (!reply) return;
        form.elements.name.value = reply.name;
        form.elements.attending.value = reply.attending ? "yes" : "no";
        if (reply.attending) form.elements.guests.value = String(reply.guests);
        form.elements.message.value = reply.message;
        syncGuests();
        setNote("reply.noteDone");
      })
      .catch(() => {});

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const attending = form.elements.attending.value === "yes";
      fields.disabled = true;
      setStatus("reply.sending");
      try {
        const res = await fetch("/api/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            g: token,
            name: form.elements.name.value,
            attending,
            guests: Number(form.elements.guests.value),
            message: form.elements.message.value,
          }),
        });
        if (res.ok) {
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
