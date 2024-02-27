import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, Modal, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Post } from './Post';
import { setupDatabase, insertPost, getPosts, deletePost } from './Database';

const db = SQLite.openDatabase('db.db');

const { width, height } = Dimensions.get('window');

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', description: '', image: '' });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setupDatabase()
      .then(() => getPosts())
      .then(posts => setPosts(posts))
      .catch(error => console.log(error));
  }, []);

  const addPost = () => {
    insertPost(newPost)
      .then(() => getPosts())
      .then(posts => setPosts(posts))
      .catch(error => console.log(error));
    setNewPost({ title: '', description: '', image: '' });
    setModalVisible(false);
  };

  const handleDeletePost = (id) => {
    deletePost(id)
      .then(() => getPosts())
      .then(posts => setPosts(posts))
      .catch(error => console.log(error));
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>POST SECTION</Text>
      </View>
      <ScrollView>
        {posts.map(post => (
          <Post key={post.id} post={post} onDelete={id => handleDeletePost(id)} />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Image source={require('../assets/plus.png')} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput placeholder="Title" value={newPost.title} onChangeText={title => setNewPost(prevState => ({ ...prevState, title }))} />
            <TextInput placeholder="Description" value={newPost.description} onChangeText={description => setNewPost(prevState => ({ ...prevState, description }))} />
            <TextInput placeholder="Image URL" value={newPost.image} onChangeText={image => setNewPost(prevState => ({ ...prevState, image }))} />
            <Button title="Add Post" onPress={addPost} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}


const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    right: width * 0.07,
    top: height * 0.07,
    padding: width * 0.03,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  header: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    marginTop: height * 0.035,
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});