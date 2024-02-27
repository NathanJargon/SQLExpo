import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, Modal, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Post } from './Post';
import { setupDatabase, insertPost, getPosts, deletePost } from './Database';
import * as ImagePicker from 'expo-image-picker';

const db = SQLite.openDatabase('db.db');

const { width, height } = Dimensions.get('window');

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', description: '', image: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled) {
      setNewPost(prevState => ({ ...prevState, image: result.uri }));
      console.log(newPost);
    }
  };


  useEffect(() => {
    setupDatabase()
      .then(() => getPosts())
      .then(posts => setPosts(posts))
      .catch(error => console.log(error));
  }, []);

  const addPost = () => {
    const postToInsert = {
      ...newPost,
      userName: newPost.userName === '' ? 'User' : newPost.userName,
      time: new Date().toISOString(), // set the time to the current time
    };

    console.log(postToInsert);
  
    insertPost(postToInsert)
      .then(() => getPosts())
      .then(posts => setPosts(posts))
      .catch(error => console.log(error));
    setNewPost({ title: '', description: '', image: '', userName: '' });
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
            {posts.slice().reverse().map(post => (
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
                <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
            <Image source={require('../assets/arrow_back.png')} style={styles.backImage} />
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={newPost.title}
                onChangeText={title => setNewPost(prevState => ({ ...prevState, title }))}
                />
                <TextInput
                style={styles.input}
                placeholder="Description"
                value={newPost.description}
                onChangeText={description => setNewPost(prevState => ({ ...prevState, description }))}
                />
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {newPost.image ? (
                <Image source={{ uri: newPost.image }} style={styles.imagePreview} />
            ) : (
                <Text>Pick an image</Text>
            )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={addPost}>
                <Text style={styles.modalButtonText}>Add Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    </>
  );
}


const styles = StyleSheet.create({
    imagePreview: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        margin: 10,
        borderRadius: 10,
      },
      postImage: {
        width: '100%',
        height: 200,
      },
    imagePicker: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderColor: '#ccc',
        borderRadius: 10,
      },
    
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'transparent',
        borderColor: '#ddd',
        borderRadius: 10,
    },
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
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalView: {
    margin: 20,
    width: '80%', 
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  backImage: {
    width: 25,
    height: 25,
  },
});