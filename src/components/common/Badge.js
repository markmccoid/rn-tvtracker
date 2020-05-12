import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components";

const Wrapper = styled.View`
  width: 20px;
  height: 20px;
  border-radius: ${20 / 2}px;
  background-color: green;
  justify-content: center;
  align-items: center;
  border: 1px solid gray;
`;
const BadgeValue = styled.Text`
  color: white;
  font-size: 14px;
`;

const Badge = ({ containerStyle }) => {
  return (
    <Wrapper style={containerStyle}>
      <BadgeValue>100</BadgeValue>
    </Wrapper>
  );
};

export default Badge;
