import { Middleware } from '~/types';

interface Props {
  type:string
}

const pagination = (props: Props): Middleware => ({
  name: 'pagination',
  callback: (slider) => {
    const paginationWrapper = slider.element.querySelector('.s-slider-pagination');

    if (!paginationWrapper) return;

    let paginationBulletHTML = '';

    if (props.type === 'bullet') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      slider.slides.forEach((slide) => {
        paginationBulletHTML += '<div class="s-slider-pagination-bullets-item"></div>';
      });
    }

    if (props.type === 'bulletNumber') {
      let counter = 1;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      slider.slides.forEach((slide) => {
        paginationBulletHTML += `<div class="s-slider-pagination-bullets-item">${counter}</div>`;
        counter += 1;
      });
    }

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

    if (props.type === 'number') {
      let counter = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      slider.slides.forEach((slide) => {
        counter += 1;
      });

      const paginationNumber = () => {
        let paginationNumberHTML = '';
        paginationNumberHTML += `<div class="s-slider-pagination-number">${slider.activeView + 1}/${counter}</div>`;
        paginationWrapper.innerHTML = paginationNumberHTML;
      };

      paginationNumber();

      slider.onSlideChange(paginationNumber);
    }
  },
});

export default pagination;
