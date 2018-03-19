const levelup = require('level')
const leveldown = require('leveldown')
const sublevel = require('level-sublevel')
const uuid = require('uuid')
const through2 = require('through2')
const faker = require('faker')
const http = require('http')

const rnd = upper => {return Math.floor(Math.random() * upper)}

function* userGenerator() {
  while(true) {
    const user = {
      firstName: faker.name.firstName(), 
      lastName: faker.name.lastName(), 
      address: faker.address.streetAddress(),
      age: rnd(90),
      height: 170 + rnd(30),
      phone: faker.phone.phoneNumber(),
      companies: Array.from({length: rnd(6) + 1}, () => {return faker.company.companyName()})
    }
    yield user
  }
}


const generator = userGenerator()

const randomUser = () => {
  return generator.next().value
}
let i = 0
let operations = []
while (i < 100) {
  const id = uuid.v4()
  operations.push({
    type: 'put',
    key: `users!${id}`,
    value: randomUser()
  })
  i++
}

const db = sublevel(levelup('./db', {valueEncoding: 'json'}))
const users = db.sublevel('users')


try {
  (async function main() {
    //const insert = await users.batch(operations)
    let count = 0
    
  })() 
} catch(error) {
  console.error(error)
}


const app = require('express')()



app.get('/users', (request, response) => {
  response.set('Content-Type', 'application/json')
  const userStream = users.createReadStream({
    gt: 'users!',
    lt: 'users!~'
  })
  userStream.on('data', user => {
    // Doesn't work because write expects String or Buffer
    // TODO: Explore a socket-based solution and try to stream the records as they come in
    response.write(user)
  })
  userStream.on('error', error => {
    console.error(error)
  })
  userStream.on('end', event => {
    res.status(200).send('Done')
  })
  
  
})

http.createServer(app).listen(8080, (error) => {
  if (error) {
    console.error('Something happened')
  } else {
    console.log('Up and running! Serving on port 8080')
  }
})





// class Model {
//   constructor(name) {
//     this.name = name
//     this.db = sublevel(levelup('./db', {valueEncoding: 'json'})).sublevel(name)
//   }
//   get all() {
//     return this.db.createReadStream({
//       gt: `${this.name}`,
//       lt: `${this.name}:~`
//     })
//   }
//   find(id) {
//     return this.db.get(id)
//   }
//   where(criteria) {
//     return this.all
//   }
//   pluck(prop) {
//     let plucker = function(chunk, encoding, callback){
//       const value = chunk[prop]
//       if (value > 40 && value < 55) {
//         this.push(value)
//       }
//       // } else {
//       //   const defaultValue = {}
//       //   defaultValue[prop] = 999
//       //   this.push(Object.assign(chunk, defaultValue))
//       // }
//       callback()  
//     }
//     // Get all the users
//     return this.db.createValueStream().pipe(through2.obj(plucker))
//   }
//   create(data) {
//     const id = uuid.v4()
//     return new Promise((resolve, reject) => {
//       const value = Object.assign(data, {id: id})
//       this.db.put(id, value, function(error) {
//         if (error) {
//           reject(error)
//         } else {
//           resolve(value)
//         }
//       })
//     })
//   }
//   set(key, value) {
//     return this.db.put(key, value)
//   }
//   delete(key) {
//     return this.db.del(id)
//   }
// }

// let User = new Model('users')


//   const userA = await User.create({
//     firstName: "Bertrand",
//     lastName: "Chardon",
//     age: Math.ceil(Math.random() * 100),
//     height: 190,
//     weight: 80,
//     hobbies: ['twitter', 'running', 'cycling', 'programming', 'coffee']
//   })

//   const userB = await User.create({
//     firstName: "Gérard",
//     lastName: "Chardon",
//     age: Math.ceil(Math.random() * 100),
//     height: 190,
//     weight: 80,
//     hobbies: ['twitter', 'running', 'cycling', 'programming', 'coffee']
//   })
//   const userC = await User.create({
//     firstName: "Jean-Pierre",
//     lastName: "Chardon",
//     age: Math.ceil(Math.random() * 100),
//     height: 190,
//     weight: 80,
//     hobbies: ['twitter', 'running', 'cycling', 'programming', 'coffee']
//   })
//   User.pluck('age').on('data', data => {
//     console.log(data)
//   })

// try {
//   main()
// } catch(error) {
//   console.error(error)
// }

