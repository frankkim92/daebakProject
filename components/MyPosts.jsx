import React, { useState, useCallback } from "react";

import {
  onSnapshot,
  query,
  collection,
  orderBy,
  where,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { authService, dbService } from "../firebase";
import PostCards from "./PostCards";

const MyPosts = ({ navigate }) => {
  const [posts, setPosts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      // 현재 로그인 사용자의 post만 나오도록 구현
      const q = query(
        collection(dbService, "posts"),
        orderBy("createdAt", "desc"),
        where(
          "userId",
          "==",
          !authService.currentUser || authService.currentUser?.uid
        )
      );

      const unsubcribe = onSnapshot(q, (snapshot) => {
        const newPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(newPosts);
      });

      return unsubcribe;
    }, [])
  );

  return (
    <>
      {posts.map((post) => {
        return (
          <PostCards
            posts={posts}
            post={post}
            key={post.id}
            navigate={navigate}
          />
        );
      })}
    </>
  );
};

export default MyPosts;
