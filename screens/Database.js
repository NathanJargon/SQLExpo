import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('posts.db');

export const setupDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists posts (id integer primary key not null, userName text, time text, title text, description text, image text, likeCount integer, dislikeCount integer, commentCount integer);',
        [],
        resolve,
        (_, error) => reject(error)
      );
      tx.executeSql(
        'create table if not exists comments (id integer primary key not null, text text, createdAt text, postId integer, FOREIGN KEY(postId) REFERENCES posts(id));',
        [],
        resolve,
        (_, error) => reject(error)
      );
      tx.executeSql(
        'create table if not exists likes (id integer primary key not null, userId integer, postId integer, FOREIGN KEY(postId) REFERENCES posts(id));',
        [],
        resolve,
        (_, error) => reject(error)
      );
      tx.executeSql(
        'create table if not exists dislikes (id integer primary key not null, userId integer, postId integer, FOREIGN KEY(postId) REFERENCES posts(id));',
        [],
        resolve,
        (_, error) => reject(error)
      );
    });
  });
};

export const updateLikes = async (postId, userId, like) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      if (like) {
        tx.executeSql(
          'insert into likes (userId, postId) values (?, ?)',
          [userId, postId],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      } else {
        tx.executeSql(
          'delete from likes where userId = ? and postId = ?',
          [userId, postId],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      }
    });
  });
};

export const updateDislikes = async (postId, userId, dislike) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      if (dislike) {
        tx.executeSql(
          'insert into dislikes (userId, postId) values (?, ?)',
          [userId, postId],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      } else {
        tx.executeSql(
          'delete from dislikes where userId = ? and postId = ?',
          [userId, postId],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      }
    });
  });
};

export const getComments = async (postId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'select * from comments where postId = ?',
        [postId],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};

export const insertComment = async (comment, postId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'insert into comments (text, createdAt, postId) values (?, ?, ?)',
        [comment, new Date().getTime(), postId],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
      tx.executeSql(
        'update posts set commentCount = commentCount + 1 where id = ?',
        [postId],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

  export const insertPost = async (post) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'insert into posts (userName, time, title, description, image) values (?, ?, ?, ?, ?)',
          [post.userName, post.time, post.title, post.description, post.image],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  };
  
export const getPosts = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'select * from posts',
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};

export const deletePost = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'delete from posts where id = ?;',
        [id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const updatePost = (post) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE posts SET title = ?, description = ?, image = ? WHERE id = ?;',
          [post.title, post.description, post.image, post.id],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  };