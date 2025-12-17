// Mobile menu toggle - исправленная версия
document.addEventListener('DOMContentLoaded', function() {
    // Theme switcher - добавьте этот элемент в header
    const themeSwitcher = document.createElement('button');
    themeSwitcher.id = 'themeSwitcher';
    themeSwitcher.className = 'theme-switcher-btn';
    themeSwitcher.innerHTML = '<i class="fas fa-moon"></i><span>תצוגה כהה</span>';
    
    // Добавляем переключатель темы в header
    const headerContainer = document.querySelector('.header-container');
    if (headerContainer) {
        headerContainer.appendChild(themeSwitcher);
    }
    
    // Theme management
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.toggle('light-theme', savedTheme === 'light');
        updateThemeSwitcher(savedTheme);
    }
    
    function updateThemeSwitcher(theme) {
        if (themeSwitcher) {
            const icon = themeSwitcher.querySelector('i');
            const text = themeSwitcher.querySelector('span');
            
            if (theme === 'light') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                text.textContent = 'תצוגה בהירה';
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                text.textContent = 'תצוגה כהה';
            }
        }
    }
    
    function toggleTheme() {
        const isLightTheme = document.body.classList.toggle('light-theme');
        const theme = isLightTheme ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        updateThemeSwitcher(theme);
    }
    
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', toggleTheme);
    }
    
    // Инициализируем тему
    initTheme();
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Блокируем скролл при открытом меню
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Восстанавливаем скролл
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(event.target) && 
                !mobileMenuBtn.contains(event.target)) {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие меню при нажатии ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    document.body.style.overflow = '';
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Новый улучшенный слайдер галереи с бесконечным пролистыванием
    const galleryTrack = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (galleryTrack && prevBtn && nextBtn) {
        let position = 0;
        let autoSlideInterval;
        let slidesPerView = 1;
        
        // Получаем все слайды
        const slides = document.querySelectorAll('.gallery-slide');
        
        // Функция для определения количества видимых слайдов
        function getSlidesPerView() {
            const width = window.innerWidth;
            if (width <= 768) {
                return 1; // 1 слайд на мобильных
            } else if (width <= 992) {
                return 2; // 2 слайда на планшетах
            } else {
                return 3; // 3 слайда на десктопе
            }
        }
        
        // Функция для обновления слайдера
        function updateSlider() {
            if (slides.length === 0) return;
            
            // Обновляем количество видимых слайдов
            slidesPerView = getSlidesPerView();
            
            // Рассчитываем ширину слайда (включая gap)
            const slideStyle = window.getComputedStyle(slides[0]);
            const slideWidth = slides[0].offsetWidth;
            const gap = 20; // Фиксированный gap из CSS
            const itemTotalWidth = slideWidth + gap;
            
            // Применяем трансформацию
            galleryTrack.style.transform = `translateX(${position * itemTotalWidth}px)`;
            
            // Обновляем состояние кнопок
            updateButtonsState();
            
            // Добавляем/убираем активный класс для текущих слайдов
            slides.forEach((slide, index) => {
                if (index >= position && index < position + slidesPerView) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        }
        
        // Функция для обновления состояния кнопок
        function updateButtonsState() {
            // Для бесконечного слайдера кнопки всегда активны
            prevBtn.disabled = false;
            nextBtn.disabled = false;
        }
        
        // Функция для перехода к следующему слайду
        function nextSlide() {
            if (slides.length === 0) return;
            
            position++;
            
            // Если достигли конца, переходим к началу
            if (position > slides.length - slidesPerView) {
                position = 0;
                // Плавный переход к началу
                galleryTrack.style.transition = 'none';
                galleryTrack.style.transform = `translateX(${position * (slides[0].offsetWidth + 20)}px)`;
                
                // Сбрасываем transition после перемотки
                setTimeout(() => {
                    galleryTrack.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            }
            
            updateSlider();
        }
        
        // Функция для перехода к предыдущему слайду
        function prevSlide() {
            if (slides.length === 0) return;
            
            position--;
            
            // Если достигли начала, переходим к концу
            if (position < 0) {
                position = slides.length - slidesPerView;
                // Плавный переход к концу
                galleryTrack.style.transition = 'none';
                galleryTrack.style.transform = `translateX(${position * (slides[0].offsetWidth + 20)}px)`;
                
                // Сбрасываем transition после перемотки
                setTimeout(() => {
                    galleryTrack.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            }
            
            updateSlider();
        }
        
        // Автоматическое слайд-шоу
        function startAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, 4000); // 4 секунды между слайдами
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Назначаем обработчики для кнопок
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            stopAutoSlide();
            nextSlide(); // ← двигает вперед
            startAutoSlide();
        });
        
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            stopAutoSlide();
            prevSlide(); // → двигает назад
            startAutoSlide();
        });
        
        // Swipe для мобильных устройств
        let startX = 0;
        let endX = 0;
        let isSwiping = false;
        
        galleryTrack.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            isSwiping = true;
            stopAutoSlide();
        });
        
        galleryTrack.addEventListener('touchmove', function(e) {
            if (!isSwiping) return;
            endX = e.touches[0].clientX;
        });
        
        galleryTrack.addEventListener('touchend', function() {
            if (!isSwiping) return;
            
            const diff = startX - endX;
            const minSwipe = 50; // Минимальная дистанция свайпа
            
            if (Math.abs(diff) > minSwipe) {
                if (diff > 0) {
                    // Свайп влево - следующий слайд
                    nextSlide();
                } else {
                    // Свайп вправо - предыдущий слайд
                    prevSlide();
                }
            }
            
            isSwiping = false;
            startAutoSlide();
        });
        
        // Автослайд при загрузке
        startAutoSlide();
        
        // Останавливаем автослайд при наведении
        galleryTrack.addEventListener('mouseenter', stopAutoSlide);
        galleryTrack.addEventListener('mouseleave', startAutoSlide);
        prevBtn.addEventListener('mouseenter', stopAutoSlide);
        nextBtn.addEventListener('mouseenter', stopAutoSlide);
        prevBtn.addEventListener('mouseleave', startAutoSlide);
        nextBtn.addEventListener('mouseleave', startAutoSlide);
        
        // Обновляем при изменении размера окна
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateSlider();
            }, 250);
        });
        
        // Инициализация слайдера
        updateSlider();
    }
    
    // Add active class to nav links on scroll
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Add smooth hover effects to all buttons
    const allButtons = document.querySelectorAll('.btn, .slider-btn, .social-icon, .theme-switcher-btn');
    allButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});