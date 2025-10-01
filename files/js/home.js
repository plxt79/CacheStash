document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-links a');
    const contentSections = document.querySelectorAll('.content-section');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const scrollContainer = document.querySelector('.container');

    function resetScroll(smooth = false) {
        const behavior = smooth ? 'smooth' : 'auto';
        scrollContainer.scrollTo({ top: 0, behavior });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('data-target');

            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');

            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });

            resetScroll(false);

            if (window.innerWidth < 992) {
                sidebar.classList.remove('active');
            }
        });
    });

    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (window.innerWidth < 992 &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target) &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    document.getElementById('sidebarManifestBtn').addEventListener('click', function () {
        window.location.href = "/manifest";
    });
});