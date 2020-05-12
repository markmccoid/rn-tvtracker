import styled from "styled-components";

export const PasswordInput = styled.TextInput`
  border-radius: 5px;
  width: 85%;
  margin: 10px;
  padding: 15px;
  font-size: 16px;
  border-color: ${props => (props.error ? "red" : "#d3d3d3")};
  border-bottom-width: 1px;
  text-align: center;
`;
export const Header = styled.Text`
  font-size: 40px;
  margin-bottom: 20px;
`;
export const IntroText = styled.Text`
  font-size: 18px;
  margin-horizontal: 30px;
`;

export const ButtonT = styled.TouchableOpacity`
  margin-top: 30px;
  margin-bottom: 20px;
  padding-vertical: 5px;
  align-items: center;
  background-color: #2cb978;
  border-color: #107a8b;
  border-width: 1px;
  border-radius: 5px;
  width: 120px;
`;
export const BigButton = styled.TouchableOpacity`
  width: 85%;
  background-color: #52aac9;
  padding: 15px;
  margin-vertical: 40px;
  border-radius: 5px;
`;
export const ButtonView = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;
export const ButtonText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  text-align: center;
`;

export const ClickText = styled.Text`
  font-size: 18px;
  color: #3b5441;
`;
