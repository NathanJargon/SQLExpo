import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { formatDistanceToNow } from 'date-fns';

const { width, height } = Dimensions.get('window');

export function Post({ post, onDelete }) {
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Image source={require('../assets/user.png')} style={styles.userImage} />
          <View style={styles.headerContent}>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.postTime}>{formatDistanceToNow(new Date(post.time), { addSuffix: true })}</Text>
          </View>
          <Menu>
            <MenuTrigger>
              <Image source={require('../assets/three_dots.png')} style={styles.menuIcon} />
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: { borderRadius: 10 } }}>
                <MenuOption onSelect={() => onDelete(post.id)}>
                    <Text style={styles.menuOptionText}>Delete</Text>
                </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postDescription}>{post.description}</Text>
        <Image source={require('../assets/postImage.jpeg')} style={styles.postImage} />
        <View style={styles.postActions}>
          <TouchableOpacity>
            <Image source={require('../assets/like.png')} style={styles.actionIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/dislike.png')} style={styles.actionIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentButton}>
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
        </View>
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
  menuOptionText: {
    color: 'red',
  },
  postDescription: {
    marginVertical: 10,
  },
});