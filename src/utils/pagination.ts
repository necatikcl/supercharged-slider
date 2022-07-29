import { Middleware } from '~/types';

const pagination = (): Middleware => ({
  name: 'pagination',
  callback: (slider) => {
    const arraySlides = [...slider.slides];
    const paginatonWrapper = slider.element.querySelector('.s-slider-pagination');

    if (!paginatonWrapper) return;

    const paginationBulletsWrapper = paginatonWrapper.querySelector('.s-slider-pagination-bullets');
    const paginationBulletHtml = `
    <div class="s-slider-pagination-bullets-item"></div>
    `;
    const paginationPrevButton = paginatonWrapper.querySelector('.s-slider-pagination-prev');
    const paginationNextButton = paginatonWrapper.querySelector('.s-slider-pagination-next');

    paginationPrevButton?.addEventListener('click', () => {
      slider.prev();
    });

    paginationNextButton?.addEventListener('click', () => {
      slider.next();
    });

    if (!paginationBulletsWrapper) return;

    arraySlides.forEach((slide) => {
      console.log(slide);
      paginationBulletsWrapper.insertAdjacentHTML('beforeend', paginationBulletHtml);
    });

    const bullets = paginationBulletsWrapper.querySelectorAll('.s-slider-pagination-bullets-item');

    bullets.forEach((bullet) => {
      bullet.addEventListener('click', () => {
        slider.next();
      });
    });
  },
});

export default pagination;
