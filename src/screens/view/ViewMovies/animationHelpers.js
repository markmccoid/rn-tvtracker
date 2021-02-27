//* Helpers to get animation values for use in the main flatlist that displays movies.

export const getViewMoviesRotates = (offsetY, animConstants) => {
  const { itemSize, itemIndex } = animConstants;
  const rotateInputRange = [-1, 0, itemSize * (itemIndex + 0.5), itemSize * (itemIndex + 2)];
  const rotateY = offsetY.interpolate({
    inputRange: rotateInputRange,
    outputRange: ["0deg", "0deg", "0deg", "180deg"],
  });
  const rotateX = offsetY.interpolate({
    inputRange: rotateInputRange,
    outputRange: ["0deg", "0deg", "0deg", "10deg"],
  });
  const rotateZ = offsetY.interpolate({
    inputRange: rotateInputRange,
    outputRange: ["0deg", "0deg", "0deg", "25deg"],
  });

  return [rotateX, rotateY, rotateZ];
};

export const getViewMoviesTranslates = (offsetY, animConstants) => {
  const { itemSize, itemIndex, absIndex, posterHeight, posterWidth, margin } = animConstants;
  const inputRange = [-1, 0, itemSize * (itemIndex + 0.5), itemSize * (itemIndex + 4)];
  const xOut =
    absIndex % 2 === 0 ? (posterWidth - margin) / 2 : ((posterWidth - margin) / 2) * -1;
  const translateX = offsetY.interpolate({
    inputRange,
    outputRange: [0, 0, 0, xOut],
  });

  const yOut = (posterHeight - margin * 2) / 2;
  const translateY = offsetY.interpolate({
    inputRange,
    outputRange: [0, 0, 0, yOut],
  });

  return [translateX, translateY];
};

export const getViewMoviesScale = (offsetY, animConstants) => {
  const { itemSize, itemIndex } = animConstants;
  const inputRange = [-1, 0, itemSize * (itemIndex + 0.5), itemSize * (itemIndex + 4)];
  const scale = offsetY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0],
  });
  return scale;
};

export const getViewMoviesOpacity = (offsetY, animConstants) => {
  const { itemSize, itemIndex } = animConstants;
  return offsetY.interpolate({
    inputRange: [
      itemSize * itemIndex,
      itemSize * (itemIndex + 0.6),
      itemSize * (itemIndex + 1),
    ],
    outputRange: [1, 0.8, 0.2],
  });
};
