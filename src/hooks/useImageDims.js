import { useDimensions } from '@react-native-community/hooks';

export const useImageDims = (size = 'm') => {
  //Size is going to be be how many posters fit across??

  const { width, height } = useDimensions().window;
  let posterWidth;
  let posterHeight;
  //NOTE-- posterURL images are 300 x 450
  // Height is 1.5 times the width
  if (size === 'm') {
    posterWidth = width / 2.2;
  } else if (size === 'l') {
    posterWidth = width / 1.1;
  }

  posterHeight = posterWidth * 1.5;
  return [posterWidth, posterHeight];
};
