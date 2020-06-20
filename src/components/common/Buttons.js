import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import styled from 'styled-components';
import tinycolor from 'tinycolor2';

//============================
//- Standard Button Start
//============================
const ButtonWrapper = styled.TouchableOpacity`
  width: ${(props) => (isNaN(props.width) ? props.width : `${props.width}px`)};
  background-color: ${(props) => `${props.backgroundColor}${props.bgOpacity}`};
  border: ${(props) => `1px solid ${props.borderColor}`};
  padding: ${(props) => props.size + 'px'};
  margin: ${(props) => props.margin};
  border-radius: 8px;
`;
const ButtonText = styled.Text`
  font-size: ${(props) => props.textSize}px;
  font-weight: 600;
  text-align: center;
  margin: auto;
`;

export const Button = ({
  onPress,
  title,
  bgOpacity = 'ff',
  bgColor = 'white',
  color = 'black',
  width = 'auto',
  small = false,
  medium = false,
  large = false,
  margin = 0,
  wrapperStyle = {},
  textStyle = {},
  disabled = false,
  noBorder = false,
  before = null, // Components to show before title
  after = null, // Components to show after title
}) => {
  // take small/medium/large prop and translate to a size to pass to styled component
  let size = (small && '5') || (medium && '10') || (large && '15') || 10; //10 becomes the default
  let textSize = (small && '14') || (medium && '18') || (large && '21') || 18; //18 becomes the default
  // if color passed convert to tinycolor object
  let bgTinyColor = tinycolor(bgColor);
  // Make sure a hex string so we can apply the alpha value
  let backgroundColor = disabled
    ? bgTinyColor.lighten(20).toHexString()
    : bgTinyColor.toHexString();
  // create a darkened border color
  let borderColor = bgTinyColor.darken(25).toHexString();
  // Set button text color
  let textColor = disabled
    ? tinycolor(color).lighten(30).toHexString()
    : tinycolor(color).toHexString();
  textStyle = { ...textStyle, color: textColor };

  return (
    <ButtonWrapper
      onPress={onPress}
      disabled={disabled}
      bgOpacity={bgOpacity}
      width={width}
      size={size}
      margin={margin}
      backgroundColor={backgroundColor}
      borderColor={borderColor + ((noBorder && '00') || '')} // tack on alpha channel of transparent if noBorder true, else tack on nothing
      style={{ ...wrapperStyle }}
    >
      {before}
      {title && (
        <ButtonText textSize={textSize} style={{ ...textStyle }}>
          {title}
        </ButtonText>
      )}
      {after}
    </ButtonWrapper>
  );
};

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string,
  // Color of button text, can be text, hex or rgb()
  color: PropTypes.string,
  // background opacity of button.  00 = transparent; ff = opaque
  bgOpacity: PropTypes.string,
  // background color of button, used to also create a darkened border
  bgColor: PropTypes.string,
  // width of the button
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  //Padding size of button
  small: PropTypes.bool,
  medium: PropTypes.bool,
  large: PropTypes.bool,
  //Accepts margin in form of standard css use px  '10px' or '10px 20px' or '10px 20px 5px 20px'
  margin: PropTypes.string,
  // puts button in disabled state
  disabled: PropTypes.bool,
  // Turn border off
  noBorder: PropTypes.bool,
  // TouchableOpacity extra style
  wrapperStyle: PropTypes.object,
  // Text extra style
  textStyle: PropTypes.object,
};

//============================
//- Circle Button
//============================
const CircleButtonWrapper = styled.TouchableOpacity`
  width: ${(props) => props.width}px;
  height: ${(props) => props.width}px;
  background-color: ${(props) => `#52aac9${props.bgOpacity}`};
  border: 1px solid #52aac9;
  border-radius: ${(props) => props.width / 2}px;
  padding: 10px;
  margin: auto;
`;

export const CircleButton = ({
  onPress,
  title,
  width = 50,
  bgOpacity = 'ff',
}) => {
  return (
    <CircleButtonWrapper onPress={onPress} bgOpacity={bgOpacity} width={width}>
      <ButtonText>{title}</ButtonText>
    </CircleButtonWrapper>
  );
};

CircleButton.propTypes = {
  ...Button.propTypes,
};
