import { Middleware } from '~/types';

const pagination = (): Middleware => ({
  name: 'pagination',
  callback: (slider) => {
    const paginationWrapper = slider.element.querySelector('.s-slider-pagination');

    if (!paginationWrapper) return;

    let paginationBulletHTML = '';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    slider.slides.forEach((slide) => {
      paginationBulletHTML += '<div class="s-slider-pagination-bullets-item"></div>';
    });

    paginationWrapper.innerHTML = paginationBulletHTML;

    const firstBullet = paginationWrapper.querySelector('.s-slider-pagination-bullets-item');
    const bullets = paginationWrapper.querySelectorAll('.s-slider-pagination-bullets-item');
    const arrayBullets = [...bullets];

    firstBullet?.classList.add('s-slider-pagination-bullets-item-active');

    const changeActiveBullet = () => {
      const isActiveBullet = paginationWrapper.querySelector('.s-slider-pagination-bullets-item-active');
      const bullet = arrayBullets[slider.activeView];

      if (isActiveBullet) {
        isActiveBullet.classList.remove('s-slider-pagination-bullets-item-active');
        bullet.classList.add('s-slider-pagination-bullets-item-active');
      }
    };

    bullets.forEach((bullet) => {
      const indexOfBullet = arrayBullets.indexOf(bullet);
      bullet.addEventListener('click', () => {
        slider.slideTo(indexOfBullet);
        changeActiveBullet();
      });
    });

    slider.onSlideChange(changeActiveBullet);
  },
});

export default pagination;
