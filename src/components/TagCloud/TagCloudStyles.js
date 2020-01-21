import styled from "styled-components";

export const TagContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Tag = styled.TouchableOpacity`
  background-color: ${props => (props.isSelected ? "lightgreen" : "white")};
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin: 5px;
  align-self: center;
`;

export const TagIcon = styled.View`
  flex-direction: row;
  align-items: center;
`;
