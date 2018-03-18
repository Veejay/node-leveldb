const levelup = require('level')
const leveldown = require('leveldown')
const sublevel = require('level-sublevel')
const uuid = require('uuid')
const through2 = require('through2')
class Model {
  constructor(name) {
    this.name = name
    this.db = sublevel(levelup('./db', {valueEncoding: 'json'})).sublevel(name)
  }
  get all() {
    return this.db.createReadStream({
      gt: `${this.name}`,
      lt: `${this.name}:~`
    })
  }
  find(id) {
    return this.db.get(id)
  }
  where(criteria) {
    return this.all
  }
  pluck(prop) {
    let plucker = function(chunk, encoding, callback){
      const value = chunk[prop]
      if (value > 40 && value < 55) {
        this.push(value)
      }
      // } else {
      //   const defaultValue = {}
      //   defaultValue[prop] = 999
      //   this.push(Object.assign(chunk, defaultValue))
      // }
      callback()  
    }
    // Get all the users
    return this.db.createValueStream().pipe(through2.obj(plucker))
  }
  create(data) {
    const id = uuid.v4()
    return new Promise((resolve, reject) => {
      const value = Object.assign(data, {id: id})
      this.db.put(id, value, function(error) {
        if (error) {
          reject(error)
        } else {
          resolve(value)
        }
      })
    })
  }
  set(key, value) {
    return this.db.put(key, value)
  }
  delete(key) {
    return this.db.del(id)
  }
}

let User = new Model('users')

async function main() {
  const userA = await User.create({
    firstName: "Bertrand",
    lastName: "Chardon",
    age: Math.ceil(Math.random() * 100),
    height: 190,
    weight: 80,
    hobbies: ['twitter', 'running', 'cycling', 'programming', 'coffee']
  })

  const userB = await User.create({
    firstName: "Gérard",
    lastName: "Chardon",
    age: Math.ceil(Math.random() * 100),
    height: 190,
    weight: 80,
    hobbies: ['twitter', 'running', 'cycling', 'programming', 'coffee']
  })
  const userC = await User.create({
    firstName: "Jean-Pierre",
    lastName: "Chardon",
    age: Math.ceil(Math.random() * 100),
    height: 190,
    weight: 80,
    hobbies: ['twitter', 'running', 'cycling', 'programming', 'coffee']
  })
  User.pluck('age').on('data', data => {
    console.log(data)
  })
}

try {
  main()
} catch(error) {
  console.error(error)
}

