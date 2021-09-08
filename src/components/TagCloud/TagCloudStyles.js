import styled, { css } from "styled-components";
import { colors } from "../../globalStyles";

export const TagContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: ${(props) => props.alignment};
`;

export const Tag = styled.TouchableOpacity`
  background-color: ${(props) => (props.isSelected ? colors.includeGreen : "white")};
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
  padding-left: 7px;
  padding-right: 7px;
  margin: 5px;
  ${(props) =>
    props.size === "s" &&
    css`
      border-radius: 7px;
      padding: 3px;
      padding-left: 5px;
      padding-right: 5px;
      margin: 3px;
    `}

  align-self: center;
`;

export const TagReadOnly = styled(Tag)`
  background-color: ${colors.includeGreen};
  opacity: 0.8;
  border: 1px solid red;
`;
export const TagIcon = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TagText = styled.Text`
  font-size: ${(props) => (props.size === "s" ? "12px" : "14px")};
`;

export const TagExtended = styled.TouchableOpacity`
  background-color: ${(props) =>
    props.isSelected === "include"
      ? colors.includeGreen
      : props.isSelected === "exclude"
      ? colors.excludeRed
      : "white"};
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
  padding-left: 7px;
  padding-right: 7px;
  margin: 5px;
  ${(props) =>
    props.size === "s" &&
    css`
      border-radius: 7px;
      padding: 3px;
      padding-left: 5px;
      padding-right: 5px;
      margin: 3px;
    `}

  align-self: center;
`;
