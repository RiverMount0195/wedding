// Translations (Vietnamese is the default). The chosen language is kept in
// localStorage only, never in the URL. The HTML ships with the Vietnamese
// text, so the default case needs no work on first paint.
//
// Markup: data-i18n="key" sets textContent;
//         data-i18n-attr="attr:key;attr:key" sets attributes.
(function () {
  const DICT = {
    vi: {
      "lang.toggle": "EN",
      "lang.label": "Switch to English",

      // Booth page
      "booth.title": "Tùng & Giang · Lưu ngày cưới",
      "booth.desc": "Chúng mình sắp cưới — hãy lưu lại ngày này nhé.",
      "booth.eyebrow": "Chúng mình sắp cưới!",
      "booth.strip": "Dải ảnh photobooth của cô dâu chú rể",
      "booth.date": "26. 06. 2027",
      "booth.open": "Mở thiệp mời",

      // Invitation: head and nav
      "inv.title": "Tùng & Giang · Thiệp mời",
      "inv.desc": "Trân trọng kính mời bạn đến dự lễ cưới của chúng mình.",
      "nav.label": "Điều hướng",
      "nav.back": "← Photobooth",
      "nav.reply": "Phản hồi",

      // Hero
      "hero.eyebrow": "Chúng mình sắp cưới",
      "hero.date": "Thứ Bảy · 26 tháng 6 · 2027",
      "hero.place": "Tên địa điểm, Thành phố",
      "hero.cta": "Xác nhận tham dự",
      "strip.est": "Từ 2027",
      "strip.forever": "Mãi mãi",
      "greeting": "Thân gửi {name}",

      // Countdown
      "countdown.eyebrow": "Đếm ngược",
      "countdown.title": "Đến ngày chúng mình về chung một nhà",
      "countdown.days": "Ngày",
      "countdown.hours": "Giờ",
      "countdown.minutes": "Phút",
      "countdown.seconds": "Giây",
      "countdown.done": "Hôm nay là ngày trọng đại",

      // Details
      "details.eyebrow": "Chi tiết",
      "details.title": "Thời gian & địa điểm",
      "details.ceremony": "Lễ thành hôn",
      "details.ceremonyTime": "16:00",
      "details.ceremonyPlace": "Tên nhà thờ",
      "details.ceremonyAddress": "123 Đường Ví Dụ, Thành phố",
      "details.reception": "Tiệc cưới",
      "details.receptionTime": "18:30",
      "details.receptionPlace": "Tên địa điểm",
      "details.receptionAddress": "456 Đại lộ Mẫu, Thành phố",
      "details.map": "Xem bản đồ",

      // Schedule
      "schedule.eyebrow": "Trong ngày cưới",
      "schedule.title": "Chương trình",
      "schedule.t1": "15:30",
      "schedule.a1": "Đón khách",
      "schedule.b1": "Đồ uống chào mừng trong vườn",
      "schedule.t2": "16:00",
      "schedule.a2": "Lễ thành hôn",
      "schedule.b2": "Xin mời quý khách an vị trước 15:50",
      "schedule.t3": "17:00",
      "schedule.a3": "Photobooth & cocktail",
      "schedule.b3": "In một dải ảnh mang về làm kỷ niệm",
      "schedule.t4": "18:30",
      "schedule.a4": "Tiệc tối",
      "schedule.b4": "Phát biểu và nâng ly chúc mừng",
      "schedule.t5": "20:30",
      "schedule.a5": "Khiêu vũ",
      "schedule.b5": "Đến thật khuya",

      // Video
      "video.eyebrow": "Câu chuyện của chúng mình",
      "video.title": "Một thước phim nhỏ",
      "video.placeholder": "Video của bạn sẽ ở đây",

      // Dress code
      "dress.eyebrow": "Nên mặc gì",
      "dress.title": "Trang phục",
      "dress.prose": "Trang phục lịch sự. Chúng mình rất muốn thấy những gam đỏ đậm, màu trung tính ấm áp và một chút ánh vàng.",
      "dress.swatches": "Màu sắc gợi ý",
      "dress.burgundy": "Đỏ burgundy",
      "dress.garnet": "Đỏ garnet",
      "dress.gold": "Vàng cổ điển",
      "dress.champagne": "Champagne",
      "dress.espresso": "Nâu espresso",

      // Reply form
      "reply.eyebrow": "Vui lòng phản hồi trước ngày 1 tháng 5, 2027",
      "reply.title": "Bạn sẽ đến chứ?",
      "reply.noteLocked": "Vui lòng mở đường dẫn thiệp mời riêng của bạn để phản hồi",
      "reply.noteOpen": "Phản hồi của bạn",
      "reply.noteDone": "Cảm ơn bạn! Bạn có thể thay đổi phản hồi bên dưới",
      "reply.name": "Họ và tên",
      "reply.namePlaceholder": "Tên của bạn",
      "reply.attending": "Tham dự",
      "reply.yes": "Rất vui được tham dự",
      "reply.no": "Tiếc là không thể tham dự",
      "reply.guests": "Số người tham dự",
      "reply.message": "Lời nhắn gửi đến cô dâu chú rể (không bắt buộc)",
      "reply.submit": "Gửi phản hồi",
      "reply.sending": "Đang gửi…",
      "reply.thanksYes": "Chúng mình rất mong được ăn mừng cùng bạn.",
      "reply.thanksNo": "Chúng mình sẽ nhớ bạn. Cảm ơn bạn đã cho chúng mình biết.",
      "err.name_required": "Vui lòng nhập họ và tên.",
      "err.attending_required": "Vui lòng cho chúng mình biết bạn có tham dự được không.",
      "err.guests_invalid": "Vui lòng chọn số người tham dự.",
      "err.message_too_long": "Lời nhắn quá dài.",
      "err.generic": "Đã có lỗi xảy ra. Vui lòng thử lại.",

      // Footer
      "footer.date": "26 tháng 6, 2027 · Thành phố",
    },

    en: {
      "lang.toggle": "VI",
      "lang.label": "Chuyển sang tiếng Việt",

      "booth.title": "Tùng & Giang · Save the Date",
      "booth.desc": "We are getting married — save the date.",
      "booth.eyebrow": "We are getting married!",
      "booth.strip": "Photo strip of the couple",
      "booth.date": "06. 26. 2027",
      "booth.open": "Open invitation",

      "inv.title": "Tùng & Giang · Invitation",
      "inv.desc": "Join us for our wedding celebration.",
      "nav.label": "Site",
      "nav.back": "← Photo booth",
      "nav.reply": "Reply",

      "hero.eyebrow": "We're getting married",
      "hero.date": "Saturday · June 26 · 2027",
      "hero.place": "The Venue Name, City",
      "hero.cta": "Kindly reply",
      "strip.est": "Est. 2027",
      "strip.forever": "Forever",
      "greeting": "Dear {name}",

      "countdown.eyebrow": "Counting down",
      "countdown.title": "Until we say I do",
      "countdown.days": "Days",
      "countdown.hours": "Hours",
      "countdown.minutes": "Minutes",
      "countdown.seconds": "Seconds",
      "countdown.done": "Today is the day",

      "details.eyebrow": "The details",
      "details.title": "Where & when",
      "details.ceremony": "Ceremony",
      "details.ceremonyTime": "4:00 PM",
      "details.ceremonyPlace": "The Chapel Name",
      "details.ceremonyAddress": "123 Example Street, City",
      "details.reception": "Reception",
      "details.receptionTime": "6:30 PM",
      "details.receptionPlace": "The Venue Name",
      "details.receptionAddress": "456 Sample Avenue, City",
      "details.map": "View map",

      "schedule.eyebrow": "On the day",
      "schedule.title": "Order of the day",
      "schedule.t1": "3:30 PM",
      "schedule.a1": "Guests arrive",
      "schedule.b1": "Welcome drinks in the garden",
      "schedule.t2": "4:00 PM",
      "schedule.a2": "Ceremony",
      "schedule.b2": "Please be seated by 3:50",
      "schedule.t3": "5:00 PM",
      "schedule.a3": "Photo booth & cocktails",
      "schedule.b3": "Print a strip to take home",
      "schedule.t4": "6:30 PM",
      "schedule.a4": "Dinner",
      "schedule.b4": "Speeches and toasts",
      "schedule.t5": "8:30 PM",
      "schedule.a5": "Dancing",
      "schedule.b5": "Until late",

      "video.eyebrow": "Our story",
      "video.title": "A little film",
      "video.placeholder": "Your video goes here",

      "dress.eyebrow": "What to wear",
      "dress.title": "Dress code",
      "dress.prose": "Black tie optional. We'd love to see deep reds, warm neutrals and a touch of gold.",
      "dress.swatches": "Suggested colours",
      "dress.burgundy": "Burgundy",
      "dress.garnet": "Garnet",
      "dress.gold": "Antique gold",
      "dress.champagne": "Champagne",
      "dress.espresso": "Espresso",

      "reply.eyebrow": "Kindly reply by May 1, 2027",
      "reply.title": "Will you join us?",
      "reply.noteLocked": "Please open your personal invitation link to reply",
      "reply.noteOpen": "Your reply",
      "reply.noteDone": "Thank you! You can change your reply below",
      "reply.name": "Full name",
      "reply.namePlaceholder": "Your name",
      "reply.attending": "Attending",
      "reply.yes": "Joyfully accepts",
      "reply.no": "Regretfully declines",
      "reply.guests": "Number of guests",
      "reply.message": "Message to the couple (optional)",
      "reply.submit": "Send reply",
      "reply.sending": "Sending…",
      "reply.thanksYes": "We can't wait to celebrate with you.",
      "reply.thanksNo": "We'll miss you. Thank you for letting us know.",
      "err.name_required": "Please enter your name.",
      "err.attending_required": "Please tell us if you can attend.",
      "err.guests_invalid": "Please choose the number of guests.",
      "err.message_too_long": "Your message is too long.",
      "err.generic": "Something went wrong. Please try again.",

      "footer.date": "June 26, 2027 · City",
    },
  };

  const root = document.documentElement;
  let lang = "vi";
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "vi" || saved === "en") lang = saved;
  } catch (e) {}

  function t(key, vars) {
    let text = (DICT[lang] && DICT[lang][key]) || DICT.vi[key] || key;
    if (vars) text = text.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m));
    return text;
  }

  function apply() {
    root.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":");
        el.setAttribute(attr, t(key));
      });
    });
    root.classList.remove("i18n-wait");
  }

  function set(next) {
    if (next !== "vi" && next !== "en") return;
    lang = next;
    try {
      localStorage.setItem("lang", lang);
    } catch (e) {}
    apply();
    document.dispatchEvent(new CustomEvent("i18n:change"));
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-lang-toggle]")) set(lang === "vi" ? "en" : "vi");
  });

  window.t = t;
  window.i18n = { apply, set, has: (key) => key in DICT.vi, get lang() { return lang; } };

  // Vietnamese is already in the HTML; only other languages need a pass.
  if (lang !== "vi") apply();
  else root.classList.remove("i18n-wait");
})();
