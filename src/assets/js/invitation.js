// Invitation page: local countdown + reveal-on-scroll.
(function () {
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
        countdown.outerHTML = '<p class="countdown__done">Today is the day</p>';
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
