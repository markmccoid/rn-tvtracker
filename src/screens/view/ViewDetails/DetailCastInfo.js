import React from 'react';
import { View, Text, Stylesheet } from 'react-native';
import styled from 'styled-components';

const PersonWrapper = styled.View`
  margin-top: 5px;
  margin-bottom: 10px;
  margin-left: 25px;
  width: ${(props) => props.width + 'px'};
`;
const Character = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
const Actor = styled.Text`
  font-size: 18px;
`;

const DetailCastInfo = ({ person, screenWidth }) => {
  const calcWidth = screenWidth / 1;
  return (
    <PersonWrapper width={calcWidth}>
      <Character>{person.characterName}</Character>
      <Actor>{person.name}</Actor>
    </PersonWrapper>
  );
};

export default DetailCastInfo;
