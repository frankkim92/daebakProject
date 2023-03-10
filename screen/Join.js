import React, { useRef, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";

import { Entypo } from "@expo/vector-icons";

import styled from "@emotion/native";

import { authService } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { emailRegex, pwRegex } from "../util";
const BgSafeAreaView = styled.View`
  flex: 1;
  justify-content: center;

  background-color: white;
`;

const Background = styled.View`
  align-items: flex-start;
  justify-content: center;

  background-color: white;
  padding: 20px;
`;

const ContainerStyle = styled.TextInput`
  width: 100%;
  background-color: white;
  border-color: cornflowerblue;
  border-width: 1px;
  border-radius: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 8px;
  padding: 13px;
`;

const CustomButton = styled.TouchableOpacity`
  background-color: #3b71f3;
  width: 100%;
  padding: 15px;
  margin: 5px 0px;
  border-radius: 5px;
  align-items: center;
  margin-top: 15px;
`;

const CustomButton2 = styled.TouchableOpacity`
  background-color: #b7bdc7;
  width: 100%;
  padding: 15px;
  margin: 5px 0px;
  border: #bdbdc9;
  border-radius: 5px;
  align-items: center;
  margin-top: 15px;
`;

const CustomButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const CustomButtonText2 = styled.Text`
  color: black;
  font-weight: bold;
`;

const JoinTopText = styled.Text`
  color: black;
  font-size: 44px;
  font-weight: bold;
  margin-left: 0px;
  margin-top: -30px;
`;

const JoinMiddleText = styled.Text`
  color: gray;
  font-size: 24px;
  font-weight: bold;
  margin-left: 0px;
`;

const JoinTopView = styled.View`
  margin-bottom: 80px;
`;

export default function Join({ navigation: { navigate } }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const checkPasswordRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordShortError, setPasswordShortError] = useState(false);
  const [visablePassword, setVisablePassword] = useState(true);

  const visibleToggle = () => {
    setVisablePassword(!visablePassword);
  };

  const handleRegister = () => {
    const matchedEmail = email.match(emailRegex);
    const matchedPw = password.match(pwRegex);

    if (matchedEmail === null) {
      setEmailError(true);
      emailRef.current.focus();
      return;
    } else {
      setEmailError(false);
    }

    if (matchedPw === null) {
      setPasswordShortError(true);
      passwordRef.current.focus();
      return;
    } else {
      setPasswordShortError(false);
    }

    if (password !== checkPassword) {
      setPasswordError(true);
      checkPasswordRef.current.focus();
      return;
    } else {
      setPasswordError(false);
    }

    createUserWithEmailAndPassword(authService, email, password)
      .then(() => {
        console.log("??????????????????");
        setEmail("");

        setPassword("");
        setCheckPassword("");
        navigate("Login");
      })
      .catch((err) => {
        console.log("err.message:", err.message);
        if (err.message.includes("already-in-use")) {
          alert("?????? ???????????? ????????? ?????????.");
        }
      });
  };

  return (
    <BgSafeAreaView>
      <Background>
        <JoinTopView>
          <JoinTopText>????????????</JoinTopText>
          <JoinMiddleText>Enter Your Details to Register</JoinMiddleText>
        </JoinTopView>

        <Text style={{ color: "black", marginTop: 10 }}>?????????</Text>

        <ContainerStyle ref={emailRef} value={email} onChangeText={setEmail} />
        {emailError && (
          <Text style={{ color: "red", marginTop: 10 }}>
            ???????????? ???????????? ????????????.
          </Text>
        )}

        <View style={{ width: "100%" }}>
          <Text style={{ color: "black", marginTop: 10 }}>????????????</Text>
          <ContainerStyle
            secureTextEntry={visablePassword}
            ref={passwordRef}
            value={password}
            onChangeText={setPassword}
            style={{ position: "relative" }}
          />
          <TouchableOpacity onPress={visibleToggle}>
            {visablePassword ? (
              <Entypo
                name="eye"
                size={24}
                color="gray"
                style={{
                  marginTop: 10,
                  position: "absolute",
                  top: -46,
                  right: 10,
                }}
              />
            ) : (
              <Entypo
                name="eye-with-line"
                size={24}
                color="gray"
                style={{
                  marginTop: 10,
                  position: "absolute",
                  top: -46,
                  right: 10,
                }}
              />
            )}
          </TouchableOpacity>
        </View>

        {passwordShortError && (
          <Text style={{ color: "red", marginTop: 10 }}>
            8?????? ?????? ?????????, ??????, ???????????? ??????????????? ?????????.
          </Text>
        )}
        <Text style={{ color: "black", marginTop: 10 }}>???????????? ??????</Text>
        <ContainerStyle
          secureTextEntry={visablePassword}
          ref={checkPasswordRef}
          value={checkPassword}
          onChangeText={setCheckPassword}
        />
        {passwordError && (
          <Text style={{ color: "red", marginTop: 10 }}>
            ??????????????? ???????????? ????????????.
          </Text>
        )}

        <CustomButton onPress={handleRegister}>
          <CustomButtonText>????????????</CustomButtonText>
        </CustomButton>
        <CustomButton2>
          <CustomButtonText2 onPress={() => navigate("Login")}>
            ??????
          </CustomButtonText2>
        </CustomButton2>
      </Background>
    </BgSafeAreaView>
  );
}
