import { Middleware } from '~/types';

const pagination = (): Middleware => ({
  name: 'pagination',
  callback: (slider) => {
    const paginationWrapper = slider.element.querySelector('.s-slider-pagination');

    if (!paginationWrapper) return;

    const paginationPrevButton = paginationWrapper.querySelector('.s-slider-pagination-prev');
    const paginationNextButton = paginationWrapper.querySelector('.s-slider-pagination-next');
    let paginationBulletHTML = '';

    paginationPrevButton?.addEventListener('click', () => {
      slider.prev();
    });

    paginationNextButton?.addEventListener('click', () => {
      slider.next();
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    slider.slides.forEach((slide) => {
      paginationBulletHTML += '<div class="s-slider-pagination-bullets-item"></div>';
    });

    paginationWrapper.innerHTML = paginationBulletHTML;

    const firstBullet = paginationWrapper.querySelector('.s-slider-pagination-bullets-item');
    const bullets = paginationWrapper.querySelectorAll('.s-slider-pagination-bullets-item');
    const arrayBullets = [...bullets];

    firstBullet?.classList.add('s-slider-pagination-bullets-item-active');

    const changeActiveBullet = (bullet:Element) => {
      const indexOfBullet = arrayBullets.indexOf(bullet);
      const isActiveBullet = paginationWrapper.querySelector('.s-slider-pagination-bullets-item-active');

      if (!isActiveBullet) return;

      isActiveBullet.classList.remove('s-slider-pagination-bullets-item-active');
      arrayBullets[indexOfBullet].classList.add('s-slider-pagination-bullets-item-active');
    };

    bullets.forEach((bullet) => {
      const indexOfBullet = arrayBullets.indexOf(bullet);
      bullet.addEventListener('click', () => {
        slider.slideTo(indexOfBullet);
        changeActiveBullet(bullet);
      });
    });
  },
});

export default pagination;
