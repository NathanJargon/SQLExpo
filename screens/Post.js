import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Modal, TextInput, ScrollView } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { formatDistanceToNow } from 'date-fns';
import { insertComment, updateLikes, updateDislikes, getComments } from './Database';

const { width, height } = Dimensions.get('window');

export function Post({ post, onDelete, onEdit }) {
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [timeString, setTimeString] = useState('');
    const { width, height } = Dimensions.get('window');
    const [likes, setLikes] = useState(post.likes || 0);
    const [dislikes, setDislikes] = useState(post.dislikes || 0);
    const [likeImage, setLikeImage] = useState(require('../assets/like.png'));
    const [dislikeImage, setDislikeImage] = useState(require('../assets/dislike.png'));
    const [isCommentModalVisible, setCommentModalVisible] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
      getComments(post.id)
        .then(fetchedComments => {
          setComments(fetchedComments);
        })
        .catch(error => {
          console.error(error);
        });
    }, []);

    const handleComment = () => {
      if (comment.trim() !== '') {
        insertComment(comment, post.id)
          .then(() => {
            setComment('');
            getComments(post.id)
              .then(fetchedComments => {
                setComments(fetchedComments);
              })
              .catch(error => {
                console.error(error);
              });
          })
          .catch(error => {
            console.error(error);
          });
      }
    };
    
    const handleLike = () => {
      if (likeImage === require('../assets/like.png')) {
        setLikes(likes + 1);
        setLikeImage(require('../assets/like-color.png'));
        updateLikes(post.id, 1)
          .then(() => {
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        setLikes(likes - 1);
        setLikeImage(require('../assets/like.png'));
        updateLikes(post.id, -1)
          .then(() => {
          })
          .catch(error => {
            console.error(error);
          });
      }
    };
    
    const handleDislike = () => {
      if (dislikeImage === require('../assets/dislike.png')) {
        setDislikes(dislikes + 1);
        setDislikeImage(require('../assets/dislike-color.png'));
        updateDislikes(post.id, 1)
          .then(() => {
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        setDislikes(dislikes - 1);
        setDislikeImage(require('../assets/dislike.png'));
        updateDislikes(post.id, -1)
          .then(() => {
          })
          .catch(error => {
            console.error(error);
          });
      }
    };

    useEffect(() => {
      const updateTimeString = () => {
        setTimeString(formatDistanceToNow(new Date(post.time), { addSuffix: true }));
      };
  
      updateTimeString();
      const intervalId = setInterval(updateTimeString, 60000); 
  
      return () => clearInterval(intervalId); 
    }, [post.time]);

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Image source={require('../assets/user.png')} style={styles.userImage} />
          <View style={styles.headerContent}>
            <Text style={styles.userName}>{post.userName || 'User'}</Text>
            <Text style={styles.postTime}>{timeString}</Text>
          </View>
          <Menu>
            <MenuTrigger>
              <Image source={require('../assets/three_dots.png')} style={styles.menuIcon} />
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: { borderRadius: 10 } }}>
            <MenuOption onSelect={() => onEdit(post.id)}>
                <Text style={styles.menuOptionText1}>Edit</Text>
            </MenuOption>
            <MenuOption onSelect={() => onDelete(post.id)}>
                <Text style={styles.menuOptionText2}>Delete</Text>
            </MenuOption>
            </MenuOptions>
          </Menu>
          </View>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDescription}>{post.description}</Text>
          <TouchableOpacity onPress={() => {
            if (post.image) {
              setImageModalVisible(true);
            } else {
              alert('Image is empty, please edit to add a picture.');
            }
          }}>
            <Image 
              source={post.image ? { uri: post.image } : require('../assets/empty.png')} 
              style={styles.postImage} 
            />
          </TouchableOpacity>
          <View style={styles.postStats}>
            <Text style={styles.statsText}>{likes} likes</Text>
            <Text style={styles.statsText}>{dislikes} dislikes</Text>
            <Text style={styles.statsText}>{post.comments || 0} comments</Text>
          </View>
          <View style={styles.lineStyle} />
          <View style={styles.postActions}>
            <TouchableOpacity onPress={handleLike}>
              <Image source={likeImage} style={styles.actionIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDislike}>
              <Image source={dislikeImage} style={styles.actionIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.commentButton} onPress={() => setCommentModalVisible(true)}>
              <Text style={styles.actionText}>Comment</Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isCommentModalVisible}
            onRequestClose={() => {
              setCommentModalVisible(!isCommentModalVisible);
            }}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View style={{ width: '80%', height: '80%', backgroundColor: 'white', borderRadius: 20, padding: 20 }}>
              <ScrollView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Comments</Text>
                  <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                    <Image
                      source={require('../assets/arrow_back_modal.png')}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableOpacity>
                </View>
                {comments.map((comment, index) => (
                <View key={index} style={styles.commentContainer}>
                  <Text style={styles.commentUser}>{comment.user || 'User'}:</Text>
                  <Text style={styles.commentText}>"{comment.text}"</Text>
                </View>
              ))}
              </ScrollView>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <TextInput
                    style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding: 10 }}
                    onChangeText={text => setComment(text)}
                    value={comment}
                  />
                  <TouchableOpacity onPress={handleComment}>
                    <Image
                      source={comment ? require('../assets/send-color.png') : require('../assets/send.png')}
                      style={{ width: 30, height: 30, margin: 10 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isImageModalVisible}
            onRequestClose={() => {
              setImageModalVisible(!isImageModalVisible);
            }}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <Image source={{ uri: post.image }} style={{ width: '80%', height: '80%' }} resizeMode="contain" />
              <TouchableOpacity
                style={{ marginTop: height * 0.02, borderRadius: 20, padding: width * 0.04, backgroundColor: 'white' }}
                onPress={() => setImageModalVisible(!isImageModalVisible)}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          </View>
          );
}

const styles = StyleSheet.create({
    actionIcon: {
        width: width * 0.05,
        height: width * 0.05,
        margin: width * 0.03,
    },
    commentButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 115,
    },
  postContainer: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  postTime: {
    color: '#aaa',
  },
  postTitle: {
    marginVertical: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionText: {
    color: '#888',
  },
  headerContent: {
    flex: 1,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  menuOptionText1: {
    color: 'black',
  },
  menuOptionText2: {
    color: 'red',
  },
  postDescription: {
    marginVertical: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  fullImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain'
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 5,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
  },
  statsText: {
    color: '#888',
  },
  commentContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  commentUser: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  commentText: {
    flex: 1,
  },
});