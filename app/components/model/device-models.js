import iphone11 from '~/assets/iphone-11.glb';
import macbookPro from '~/assets/macbook-pro.glb';

export const ModelAnimationType = {
  SpringUp: 'spring-up',
  LaptopOpen: 'laptop-open',
};

export const deviceModels = {
  phone: {
    url: iphone11,
    width: 374,
    height: 512,
    materialColor: 0x261116,
    accentMaterialColor: 0xa63440,
    position: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.SpringUp,
  },
  laptop: {
    url: macbookPro,
    width: 1280,
    height: 800,
    materialColor: 0x21191b,
    accentMaterialColor: 0xb6925b,
    position: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.LaptopOpen,
  },
};
