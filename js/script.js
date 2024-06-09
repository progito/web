document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const megaMenu = document.getElementById('mega-menu');
    const megaMenuContents = document.querySelectorAll('.mega-menu-content');

    navItems.forEach(item => {
        item.addEventListener('mouseover', function() {
            const targetPanel = this.getAttribute('data-target');
            showPanel(targetPanel);
        });
    });

    function showPanel(targetPanel) {
        megaMenu.style.display = 'block';
        megaMenuContents.forEach(content => {
            if (content.getAttribute('data-panel') === targetPanel) {
                content.style.display = 'block';
                content.classList.add('fadeIn'); // добавляем класс анимации
            } else {
                content.style.display = 'none';
                content.classList.remove('fadeIn'); // удаляем класс анимации
            }
        });
    }

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.site-header') && !event.target.closest('.mega-menu')) {
            megaMenu.style.display = 'none';
        }
    });
});
