import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('posts.db');

export const setupDatabase = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'create table if not exists posts (id integer primary key not null, userName text, time text, title text, description text, image text);',
          [],
          resolve,
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