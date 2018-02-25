const levelup = require('levelup')
const leveldown = require('leveldown')
const { StringDecoder } = require('string_decoder');


const main = async () => {
  const decoder = new StringDecoder('utf8');
  const db = levelup(leveldown('./mydb'))
  await db.put('posts/234', 'blah')
  await db.put('post/345', 'foobar')
  await db.put('users/1233', 'Big Shaq')
  await db.put('users/1234', JSON.stringify({nickname: 'King James', firstName: "Lebron", last_name: "James", number: 23}))
  await db.put('users/1235', 'Big Man Lukaku')
  await db.put('users/1236', 'Akinfenwa')
  const users = User.where(db, {gte: 'users/1233', lte: 'users/1235'})
  users.on('data', user => {
    const {key, value} = user
    const [k,v] = [key, value].map(e => decoder.write(e))
    console.log(k,v)
  })  
}


class User {

  static all(db) {
    return db.createReadStream({gt: 'users/', lt: 'users/\xff'})
  }

  static where(db, query) {
    return db.createReadStream(query)
  }
}

try {
  main()
} catch(error) {
  console.error(error)
}
