// file name: slider.js
// Простой рабочий слайдер для галереи с циклическим переключением
document.addEventListener('DOMContentLoaded', function() {
    const galleryTrack = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slides = document.querySelectorAll('.gallery-slide');
    
    if (!galleryTrack || !prevBtn || !nextBtn || slides.length === 0) {
        console.error('Элементы слайдера не найдены');
        return;
    }
    
    // Определяем язык страницы
    const isHebrew = document.documentElement.lang === 'he';
    console.log(`Язык страницы: ${document.documentElement.lang}, Иврит: ${isHebrew}`);
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;
    let indicatorsContainer = null;
    
    console.log(`Слайдер инициализирован. Всего слайдов: ${totalSlides}`);
    
    // Инициализация слайдера
    function initSlider() {
        console.log('Инициализация слайдера...');
        
        // Сначала сбрасываем все стили
        galleryTrack.style.transform = 'translateX(0)';
        
        // Убедимся, что все слайды имеют правильную ширину
        const containerWidth = galleryTrack.parentElement.offsetWidth;
        slides.forEach((slide, index) => {
            slide.style.flex = '0 0 100%';
            slide.style.minWidth = '100%';
            slide.style.width = '100%';
            
            if (index === 0) {
                slide.classList.add('active');
                slide.style.opacity = '1';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            }
        });
        
        // Обновляем состояние кнопок
        updateButtonsState();
        
        // Создаем индикаторы
        createIndicators();
        
        // Запускаем автослайд
        startAutoSlide();
    }
    
    // Обновление состояния кнопок
    function updateButtonsState() {
        // Для циклического слайдера кнопки никогда не отключаются
        prevBtn.classList.remove('disabled');
        nextBtn.classList.remove('disabled');
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }
    
    // Создание индикаторов
    function createIndicators() {
        // Проверяем, не созданы ли уже индикаторы
        const existingIndicators = document.querySelector('.slider-indicators');
        if (existingIndicators) {
            existingIndicators.remove();
        }
        
        indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slider-indicators';
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'slider-indicator';
            indicator.setAttribute('data-index', i);
            
            if (i === currentSlide) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                goToSlide(index);
            });
            
            indicatorsContainer.appendChild(indicator);
        }
        
        // Добавляем индикаторы после слайдера
        const sliderContainer = document.querySelector('.gallery-slider');
        if (sliderContainer) {
            sliderContainer.parentNode.insertBefore(indicatorsContainer, sliderContainer.nextSibling);
        }
    }
    
    // Обновление индикаторов
    function updateIndicators() {
        if (!indicatorsContainer) return;
        
        const indicators = indicatorsContainer.querySelectorAll('.slider-indicator');
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Плавный переход к слайду
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        // Если индекс совпадает с текущим, ничего не делаем
        if (index === currentSlide) return;
        
        console.log(`Переход к слайду ${index} (с ${currentSlide})`);
        
        // Анимация через opacity для надежности
        const current = slides[currentSlide];
        const next = slides[index];
        
        // Прячем текущий слайд
        if (current) {
            current.classList.remove('active');
            current.style.opacity = '0';
            current.style.transition = 'opacity 0.5s ease';
        }
        
        // Показываем следующий слайд
        if (next) {
            next.classList.add('active');
            next.style.opacity = '1';
            next.style.transition = 'opacity 0.5s ease';
            
            // Для иврита может потребоваться сдвиг
            if (isHebrew) {
                // Для иврита используем transform
                const translateX = -index * 100;
                galleryTrack.style.transform = `translateX(${translateX}%)`;
                galleryTrack.style.transition = 'transform 0.5s ease';
            } else {
                // Для других языков тоже используем transform
                const translateX = -index * 100;
                galleryTrack.style.transform = `translateX(${translateX}%)`;
                galleryTrack.style.transition = 'transform 0.5s ease';
            }
        }
        
        // Обновляем текущий слайд
        currentSlide = index;
        
        // Обновляем индикаторы
        updateIndicators();
        
        // Перезапускаем автослайд
        restartAutoSlide();
    }
    
    // Следующий слайд с циклическим переходом
    function nextSlide() {
        console.log('nextSlide вызван, текущий слайд:', currentSlide);
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }
    
    // Предыдущий слайд с циклическим переходом
    function prevSlide() {
        console.log('prevSlide вызван, текущий слайд:', currentSlide);
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }
    
    // Автослайд
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            console.log('Автослайд: переход к следующему слайду');
            nextSlide();
        }, 5000); // Меняем слайд каждые 5 секунд
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Обработчики событий для кнопок - простая версия
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Нажата кнопка prevBtn');
        prevSlide();
    });
    
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Нажата кнопка nextBtn');
        nextSlide();
    });
    
    // Простой swipe без учета языка
    let startX = 0;
    let isSwiping = false;
    
    galleryTrack.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isSwiping = true;
        stopAutoSlide();
    });
    
    galleryTrack.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        isSwiping = false;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        const minSwipe = 50;
        
        if (Math.abs(diff) > minSwipe) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                nextSlide();
            } else {
                // Свайп вправо - предыдущий слайд
                prevSlide();
            }
        }
        
        startAutoSlide();
    });
    
    // Останавливаем автослайд при наведении
    galleryTrack.addEventListener('mouseenter', stopAutoSlide);
    galleryTrack.addEventListener('mouseleave', startAutoSlide);
    prevBtn.addEventListener('mouseenter', stopAutoSlide);
    nextBtn.addEventListener('mouseenter', stopAutoSlide);
    prevBtn.addEventListener('mouseleave', startAutoSlide);
    nextBtn.addEventListener('mouseleave', startAutoSlide);
    
    // Инициализация при загрузке
    setTimeout(() => {
        initSlider();
    }, 100);
    
    // Также инициализируем при полной загрузке страницы
    window.addEventListener('load', function() {
        setTimeout(() => {
            initSlider();
        }, 100);
    });
    
    // Обновление при изменении размера окна
    window.addEventListener('resize', function() {
        setTimeout(() => {
            initSlider();
        }, 100);
    });
    
    // Дебаг функции
    console.log('Для отладки используйте window.sliderDebug в консоли');
    window.sliderDebug = {
        getCurrentSlide: () => currentSlide,
        getTotalSlides: () => totalSlides,
        getLanguage: () => document.documentElement.lang,
        isHebrew: () => isHebrew,
        goToSlide: (index) => goToSlide(index),
        nextSlide: () => nextSlide(),
        prevSlide: () => prevSlide(),
        initSlider: () => initSlider()
    };
});