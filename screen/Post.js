import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Hyperlink from "react-native-hyperlink";
import { Linking } from "react-native";

import { YELLOW_COLOR, BLUE_COLOR } from "../color";
import styled from "@emotion/native";
import { authService, dbService } from "../firebase";
import CommentModal from "../components/CommentModal";
import CommentLoader from "../components/CommnetLoader";
import PostModifyModal from "../components/PostModifyModal";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useMutation } from "react-query";
import { deletePostText } from "../api";
import { StyleSheet } from "react-native";
export default function Post({
  navigation,
  route: {
    params: { post },
  },
}) {
  const isDark = useColorScheme() === "dark";
  const [comments, setComments] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModifyModal, setIsOpenModifyModal] = useState(false);

  // ------------- 상단 삭제 --------------
  const { mutate: removePost } = useMutation((body) => deletePostText(body), {
    onSuccess: () => {
      console.log("삭제성공");
    },
    onError: (err) => {
      console.log("err in delete:", err);
    },
  });

  const onDelete = async () => {
    Alert.alert("게시글 삭제", "정말 현재 게시글을 삭제하시겠습니까?", [
      { text: "cancel", style: "destructive" },
      {
        text: "OK. Delete it.",
        onPress: async () => {
          try {
            await removePost(post.id);
            Alert.alert("삭제가 완료되었습니다");
            navigation.navigate("Main");
          } catch (err) {
            console.log("err:", err);
          }
        },
      },
    ]);
  };

  const openURL = (url) => {
    Linking.openURL(url);
  };

  // ------------- 상단 삭제 --------------
  // ------------- 상단 header --------------
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: isDark ? YELLOW_COLOR : BLUE_COLOR }}>
            <Ionicons name="arrow-back" size={30} color="#3B71F3" />
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => {
        return (
          <View>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => {
                setIsOpenModifyModal(true);
              }}
            >
              <Text
                style={{
                  color: isDark ? YELLOW_COLOR : BLUE_COLOR,
                  // marginRight: "10%",
                }}
              >
                {post.userId === authService.currentUser?.uid ? (
                  <Feather name="edit" size={26} color="#3b71f3" />
                ) : (
                  ""
                )}
              </Text>
            </TouchableOpacity>
          </View>
        );
      },
    });

    const q = query(
      collection(dbService, "comment"),
      orderBy("createdAt", "desc"),
      where("postId", "==", post.id ?? "")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(newComments);
    });
    return unsubscribe;
  }, [post.id]);
  // ------------- 상단 header --------------
  // ------------- 댓글 box --------------
  const goToComment = async () => {
    const isLogin = !!authService.currentUser;
    if (!isLogin) {
      navigation.navigate("Login");
      return;
    }
    setIsOpenModal(true);
  };
  // ------------- 댓글 box --------------
  // ------------- Post 내용  --------------

  return (
    <Container>
      <SectionTitle>제목</SectionTitle>

      <Title>{post.title}</Title>

      <SectionTitle>내용</SectionTitle>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <Content>{post.contents}</Content>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <SectionUrl>URL:</SectionUrl>
      <Hyperlink onPress={(hyperUrl) => openURL(hyperUrl)}>
        <Content style={{ color: "blue" }}>{post.url}</Content>
      </Hyperlink>
      <CustomButtonBox>
        {post.userId === authService.currentUser?.uid ? (
          <CustomButton onPress={onDelete}>
            <BtnTitle>글 삭제하기</BtnTitle>
          </CustomButton>
        ) : (
          ""
        )}

        <CustomButton onPress={goToComment}>
          <BtnTitle>댓글추가</BtnTitle>
        </CustomButton>
      </CustomButtonBox>

      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          marginBottom: 50,
          justifyContent: "flex-start",
        }}
        keyExtractor={(item) => item.id}
        horizontal
        data={comments}
        ItemSeparatorComponent={HSeprator}
        renderItem={({ item }) => {
          return <CommentLoader comment={item} />;
        }}
      />
      <PostModifyModal
        id={post.id}
        isOpenModifyModal={isOpenModifyModal}
        setIsOpenModifyModal={setIsOpenModifyModal}
        navigation={navigation}
        post={post}
      />

      <CommentModal
        postId={post.id}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </Container>
  );
}
// ------------- Post 내용  --------------

export const SectionTitle = styled.Text`
  font-size: 30px;
  font-weight: 600;
  color: ${(props) => props.theme.color.title};
  margin-bottom: 15px;

  padding: 10px 0px;
`;
export const Title = styled.Text`
  font-size: 24px;
  font-weight: 500;
  /* color: ${(props) => props.theme.color.overview}; */
  color: gray;
  margin-bottom: 20px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props) => props.theme.color.title};
  align-self: center;
  width: 100%;
`;
export const Content = styled.Text`
  font-size: 20px;
  font-weight: 500;
  /* color: ${(props) => props.theme.color.overview}; */
  color: gray;
  line-height: 30px;
  margin: 10px 0px;
`;
export const SectionUrl = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.color.title};
  margin-top: 30px;
`;

const Container = styled.ScrollView`
  padding: 20px;
`;

const BtnTitle = styled.Text`
  color: ${(props) => (props.disabled ? "yellow" : "white")};
  font-size: 20px;
  font-weight: 700;
`;

const HSeprator = styled.View`
  width: 10px;
`;

export const CustomButton = styled.TouchableOpacity`
  background-color: #3b71f3;
  width: 100%;
  padding: 15px;
  margin: 5px 0px;
  border-radius: 5px;
  align-items: center;
  margin-top: 10px;
`;

export const CustomButtonBox = styled.View`
  margin-top: 50px;
  margin-bottom: 20px;
`;

export const CustomButtonText = styled.Text`
  color: white;
`;
