import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { authService, dbService } from "../firebase";
import { AntDesign } from "@expo/vector-icons";
import { GREEN_COLOR, YELLOW_COLOR } from "../color";
import Loader from "../components/Loader";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDoc,
  doc,
} from "firebase/firestore";
import styled from "@emotion/native";
import PostLoader from "../components/PostLoader";

export default function PostList({
  navigation: { goBack, navigate, setOptions },
  route: {
    params: { category },
  },
}) {
  const [posts, setPosts] = useState([]);

  const isDark = useColorScheme() === "dark";

  // ------------- 상단 header --------------

  useEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}
        >
          <Text style={{ color: isDark ? YELLOW_COLOR : GREEN_COLOR }}>
            뒤로
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => {
        if (!authService.currentUser) {
          return (
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => {
                navigate("Stacks", { screen: "PostInput" });
              }}
            >
              <AntDesign
                name="edit"
                size={24}
                color={isDark ? YELLOW_COLOR : GREEN_COLOR}
              />
              <Text style={{ color: isDark ? YELLOW_COLOR : GREEN_COLOR }}>
                게시글작성
              </Text>
            </TouchableOpacity>
          );
        }
      },
    });
  }, []);

  // ------------- 상단 header --------------

  // ------------- query로 snapshot 이용해서 실시간 read부분 --------------

  useEffect(() => {
    const q = query(
      collection(dbService, "posts"),
      orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => {
        const newPost = {
          id: doc.id,
          ...doc.data(),
        };
        return newPost;
      });
      setPosts(newPosts);
    });

    // ------------- Category 불러오는 부분 ------------

    // const getCategory = async () => {
    //   const snapshot = await getDoc(
    //     doc(dbService, 'category', 'currentCategory')
    //   );
    //   console.log('snapshot.id:', snapshot.id);
    //   console.log('snapshot.data():', snapshot.data());
    //   // setCategory(snapshot.data().category);
    // };
    // getCategory();
  }, []);

  return (
    <Container>
      <PostLoader key={posts.id} posts={posts} category={category} />
    </Container>
  );
}

export const Container = styled.ScrollView`
  flex: 1;
`;