import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { authService, dbService } from '../firebase';
import { AntDesign } from '@expo/vector-icons';
import { GREEN_COLOR, YELLOW_COLOR } from '../color';
import { SelectList } from 'react-native-dropdown-select-list';
import styled from '@emotion/native';
import uuid from 'react-native-uuid';
import Drop from '../components/Drop';

export default function PostInput({
  navigation: { goBack, setOptions, navigate },
}) {
  const [addPostTitle, setAddPostTitle] = useState('');
  const [addPostContents, setAddPostContents] = useState('');
  const [addPostUrl, setAddPostUrl] = useState('');
  const [addPostCategory, setAddPostCategory] = useState('');

  const newPost = {
    title: addPostTitle,
    contents: addPostContents,
    url: addPostUrl,
    category: addPostCategory,
    createdAt: Date.now(),
    userId: authService.currentUser?.uid,
  };

  const addPost = async () => {
    await addDoc(collection(dbService, 'posts'), newPost);
    goBack();
  };

  const data = [
    { key: '1', value: '기술' },
    { key: '2', value: '교육' },
    { key: '3', value: '보건' },
    { key: '4', value: '문화' },
    { key: '5', value: '환경' },
    { key: '6', value: '교통' },
    { key: '7', value: '정치' },
    { key: '8', value: 'etc' },
  ];

  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Text style={{ color: isDark ? YELLOW_COLOR : GREEN_COLOR }}>
            뒤로
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => {
        return null;
      },
    });
  }, []);

  return (
    <Container>
      <SelectBox>
        {/* <Drop addPostCategory={addPostCategory} /> */}
        <SelectList
          setSelected={val => setAddPostCategory(val)}
          data={data}
          save="value"
          placeholder="Select category"
          value={addPostCategory}
          maxHeight={200}
        />
      </SelectBox>
      <InputBox>
        <TitleInput
          placeholder="  제목을 입력해주세요."
          value={addPostTitle}
          onChangeText={text => setAddPostTitle(text)}
        />
        <ContentInput
          style={{ flexShrink: 1 }}
          multiline={true}
          placeholder="  내용을 입력해주세요."
          value={addPostContents}
          onChangeText={text => setAddPostContents(text)}
        />
        <UrlInput
          placeholder="  Url을 입력해주세요."
          value={addPostUrl}
          onChangeText={text => setAddPostUrl(text)}
        />
        <Button title="작성완료" onPress={addPost} />
      </InputBox>
    </Container>
  );
}

export const Container = styled.View`
  padding: 20px;
  flex: 1;
  margin: 30px;
  flex-direction: column;
  /* justify-content: space-evenly; */
`;

export const TitleInput = styled.TextInput`
  border: 1px solid black;
  height: 45px;
  border-radius: 10px;
  margin-bottom: 20px;
  margin-top: 10px;
`;

export const ContentInput = styled.TextInput`
  border: 1px solid black;
  height: 150px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

export const UrlInput = styled.TextInput`
  border: 1px solid black;
  height: 45px;
  border-radius: 10px;
`;

export const SelectBox = styled.View``;

export const InputBox = styled.View``;
