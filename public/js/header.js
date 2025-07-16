fetch("partials/header.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header-placeholder").innerHTML = data;

        // scroll-aware header
        let lastScroll = 0;
        const header = document.getElementById('site-header');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > lastScroll && currentScroll > 50) {
                header.classList.add('hide-header');
                header.classList.remove('bg-orange-400/70', 'backdrop-blur-lg');
                header.classList.add('bg-orange-600');
            } else {
                header.classList.remove('hide-header');
                header.classList.remove('bg-orange-600');
                header.classList.add('bg-orange-400/90', 'backdrop-blur-lg');
            }

            lastScroll = currentScroll;
        });


        // active state menu
        const currentPath = window.location.pathname.split("/").pop();
        document.querySelectorAll(".nav-link").forEach(link => {
            const href = link.getAttribute("href");
            if (href === currentPath || (href === "index.html" && currentPath === "")) {
                link.classList.add("font-semibold", "border-b-2", "border-white", "pb-1");
            }
        });

        // smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                }
            });
        });

        // responsive menu toggle
        const btn = document.getElementById("menu-btn");
        const menu = document.getElementById("menu");
        const overlay = document.getElementById("overlay");
        const icon = document.getElementById("menu-icon");

        btn.addEventListener("click", () => {
            const isOpen = menu.classList.contains("translate-x-0");

            menu.classList.toggle("translate-x-full");
            menu.classList.toggle("translate-x-0");
            overlay.classList.toggle("hidden");

            icon.textContent = isOpen ? "☰" : "✕";
            btn.setAttribute("aria-expanded", !isOpen);
        });

        overlay.addEventListener("click", () => {
            menu.classList.add("translate-x-full");
            menu.classList.remove("translate-x-0");
            overlay.classList.add("hidden");
            icon.textContent = "☰";
            btn.setAttribute("aria-expanded", false);
        });
    });
