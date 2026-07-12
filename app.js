const content = document.getElementById("content");

const pages = {
    home: "<h2>صفحه اصلی</h2><p>به سایت ما خوش آمدید!</p>",
    about: "<h2>درباره ما</h2><p>ما یک تیم توسعه وب هستیم.</p>",
    contact: "<h2>تماس با ما</h2><p>از طریق ایمیل با ما در تماس باشید.</p>",
};

// بارگذاری صفحه بر اساس state
function loadPage(page) {
    content.innerHTML = pages[page] || "<h2>صفحه پیدا نشد</h2>";
}

// مدیریت کلیک روی لینک‌ها
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const page = link.dataset.page;
        history.pushState({ page }, "", link.getAttribute("href"));
        loadPage(page);
    });
});

// بارگذاری صفحه هنگام برگشت (back/forward)
window.addEventListener("popstate", e => {
    const page = e.state?.page || "home";
    loadPage(page);
});

// بارگذاری اولیه
const pathToPage = {
    "/": "home",
    "/about": "about",
    "/contact": "contact",
};
loadPage(pathToPage[location.pathname] || "home");
