import { Middleware } from '~/types';

const pagination = (): Middleware => ({
  name: 'pagination',
  callback: (slider) => {
    const arraySlides = [...slider.slides];
    const paginationBulletsWrapper = document.querySelector('.s-slider-pagination-bullets');
    const paginationBulletHtml = `
    <div class="s-slider-pagination-bullets-item"></div>
    `;

    if (!paginationBulletsWrapper) return;

    arraySlides.forEach((slide) => {
      console.log(slide);
      paginationBulletsWrapper.insertAdjacentHTML('beforeend', paginationBulletHtml);
    });

    const bullets = paginationBulletsWrapper.querySelectorAll('.s-slider-pagination-bullets-item');

    bullets.forEach((bullet) => {
      bullet.addEventListener('click', () => {
        console.log(bullet);
      });
    });
  },
});

export default pagination;
