import { Url } from '~/constants/urls';

type ImageDir = 'main' | 'market' | 'product' | 'slide';
export const getImageUrl = (dir: ImageDir, image: string) =>
  `${Url.Static}/${dir}/${image}.webp`;
