const express = require('express')
const app = express()
////
const session = require('express-session')
////
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
////
const mysql = require('mysql')
const pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  database: 'order',
  password: '',
})

app.use(express.static('./public'))
app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

app.use(session({
  secret: 'banana juice'
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.render('auth')
})

app.post(
  '/auth',
  passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: '/',
  })
)

app.get('/main', authentication(), (req, res) => {
  const profession = query(`SELECT name as profession FROM profession WHERE id = ${session.prof_id}`)
  const projects = query(`SELECT * FROM projects`)

  Promise.all([projects, profession])
    .then(results => {
      const profession = results[1][0].profession
      const progress = results[0].filter(e => e.status === 0)
      const ready = results[0].filter(e => e.status === 1)
      res.render('main', {
        first_name: session.fname,
        last_name: session.lname,
        profession,
        ready,
        progress,
        isAdmin: session.prof_id === 4 ? true : false
      })
    })
})

function getCOlor() {
  return '#' + (Math.random().toString(16) + "000000").substring(2, 8)
}


// const express = require("express");
// const app = express();
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const mysql = require("mysql");
// const session = require("express-session");
// // const routes = require('./routes')
// const pool = mysql.createPool({
//   connectionLimit: 5,
//   host: "localhost",
//   user: "root",
//   database: "project",
//   password: "",
// });

// //middleware
// app.use(express.static("./public"));
// app.set("views", "./views");
// app.set("view engine", "pug");
// app.use(express.json());
// app.use(express.urlencoded({
//   extended: false
// }));

// app.use(session({
//   secret: "banana juice"
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.get("/", (req, res) => {
//   res.render("auth");
// });

// app.post(
//   "/auth",
//   passport.authenticate("local", {
//     successRedirect: "/main",
//     failureRedirect: "/",
//   })
// );

// app.get("/main", authentication(), (req, res) => {

//   query(`SELECT prof_id FROM \`prof-user\` WHERE user_id = ${session.id}`)
//     .then(user => {
//       if (user[0].prof_id === 4) {
//         const projects = query(`SELECT title, status, pic FROM projects`)
//         const types = query(`SELECT type FROM \`tasks-type\``)
//         const employees = query(`
//       SELECT first_name, last_name 
//       FROM users INNER JOIN \`prof-user\`  
//       ON \`prof-user\`.prof_id <> 4 and users.id = \`prof-user\`.user_id`)
//         const user = query(`SELECT first_name, last_name FROM users WHERE id = ${session.id}`)

//         const test = Promise.all([projects, types, employees, user])

//         test.then(result => {
//           const progress = result[0].filter(e => e.status === 0)
//           const ready = result[0].filter(e => e.status === 1)
//           const taskTypes = result[1].map(e => e.type)
//           const employees = result[2].map(e => `${e.first_name} ${e.last_name}`)

//           res.render('main', {
//             progress,
//             ready,
//             tasks_type: taskTypes,
//             employees,
//             last_name: result[3][0].last_name,
//             first_name: result[3][0].first_name,
//             admin: 1
//           })
//         }).catch(err => {
//           console.log('Error', err.msg)
//           res.json({
//             status: '500',
//             msg: 'Ошибка БД'
//           })
//         })
//       } else {
//         query(`SELECT prof_id FROM \`prof-user\` WHERE user_id = ${session.id}`)
//           .then(result1 => {
//             query(`SELECT name FROM professions WHERE id = ${result1[0].prof_id}`)
//               .then(result2 => {
//                 query(`SELECT title, status, pic FROM projects`)
//                   .then(result3 => {
//                     console.log(result3)
//                     const progress = result3.filter(e => e.status === 0)
//                     const ready = result3.filter(e => e.status === 1)

//                     res.render('main', {
//                       first_name: session.fname,
//                       last_name: session.lname,
//                       profession: result2[0].name,
//                       ready,
//                       progress,
//                       admin: 0
//                     })
//                   })
//               }).catch(err => console.log(err))
//           })
//           .catch(err => {
//             console.log(err)
//           })
//         // const user = query(`SELECT id, first_name, last_name FROM users WHERE id = ${session.id}`)
//         // .then(result => {

//         //   // query(`SELECT task_id FROM \`tasks-executors\` WHERE user_id = ${result[0].id}`)
//         //   // .then(result1 => {
//         //   //   const data = {
//         //   //     first_name: result[0].first_name,
//         //   //     last_name: result[0].last_name,
//         //   //     tasks: result1.map(e => e.task_id)
//         //   //   }
//         //   //   // profession send
//         //   // })
//         // }).catch(err => {
//         //   console.log(err)
//         // })
//       }
//     })
//     .catch(err => {
//       console.log(err)
//     })
// })

// app.post('/createProject', (req, res) => {

//   const title = req.body['title']
//   const dateEnd = req.body['date']
//   const pic = req.body['pic']

//   console.log(dateEnd)

//   const dn = new Date()
//   const dateNow = `${dn.getFullYear()}-${dn.getMonth() + 1}-${dn.getDate()}`

//   query(`
//   INSERT INTO projects (title, time_start, time_end, pic)
//   VALUES ('${ title}', '${dateNow}', '${dateEnd}', '${pic}')
//   `)
//     .then(result => {
//       res.json({
//         status: '200'
//       })
//     })
//     .catch(err => {
//       res.json({
//         status: '500'
//       })
//     })
// })

// app.post('/infoProject', (req, res) => {
//   const title = req.body.title

//   const tasksInfo = query(`SELECT id, title, time_expected FROM tasks
//   WHERE project_id = (
//     SELECT id FROM projects
//     WHERE title = '${title}'
//     ) and status = 0`)
//   tasksInfo
//     .then(task => {
//       if (task.length !== 0) {
//         const task_user = query(`SELECT user_id, task_id FROM \`tasks-executors\``).then(task_ids => {

//           const users = query(`SELECT id, first_name, last_name FROM users WHERE id = ${task_ids.map(e => e.user_id).join(' or id = ')}`).then(result => {
//             const userInfo = []
//             for (let i = 0; i < task_ids.length; i++) {
//               for (let j = 0; j < result.length; j++) {
//                 if (task_ids[i].user_id === result[j].id) {
//                   const obj = {
//                     fn: result[j].first_name,
//                     ln: result[j].last_name,
//                     task_id: task_ids[i].task_id
//                   }
//                   userInfo.push(obj)
//                 }
//               }
//             }

//             const data = []
//             for (let i = 0; i < task.length; i++) {
//               if (task[i].id = userInfo[i].task_id) {
//                 const obj = {
//                   id: task[i].id,
//                   title: task[i].title,
//                   name: `${userInfo[i].fn} ${userInfo[i].ln}`,
//                   timeEnd: new Date(Date.parse(task[i].time_expected)).toLocaleDateString('ru-RU', {
//                     year: 'numeric',
//                     month: '2-digit',
//                     day: '2-digit'
//                   })
//                 }
//                 data.push(obj)
//               }
//             }

//             res.json({
//               tasks: data
//             })
//           }).catch(err => {
//             console.log(err)
//           })
//         }).catch(err => console.log(err))
//       } else {
//         res.json({
//           tasks: task
//         })
//       }

//     })
//     .catch(err => {
//       console.log(err)
//       res.json({
//         msg: 'Error',
//         status: '500',
//         err
//       })
//     })
// })

// app.post('/addTask', (req, res) => {
//   const dn = new Date()
//   const dateNow = `${dn.getFullYear()}-${dn.getMonth() + 1}-${dn.getDate()}`

//   const titleTask = req.body.title
//   const titleProject = req.body.projectTitle
//   const employer = req.body.employer.split(' ')
//   const timeEnd = req.body.time

//   const task_type = query(`SELECT id FROM \`tasks-type\` WHERE type = '${titleTask}'`)
//   const project_id = query(`SELECT id FROM projects WHERE title = '${titleProject}'`)

//   Promise.all([task_type, project_id]).then(result => {
//     const insertTask = query(`INSERT INTO tasks (title, time_start, time_expected, type_id, status, project_id) VALUES
//     ('${titleTask}','${dateNow}', '${timeEnd}', '${result[0][0].id}', 0, ${result[1][0].id})`).then(o => {
//       const executor = query(`SELECT id FROM users WHERE first_name = '${employer[0]}' and last_name = '${employer[1]}'`)
//       const test = query(`SELECT MAX(id) as id FROM tasks WHERE project_id = ${result[1][0].id}`)

//       Promise.all([insertTask, executor, test]).then(result => {
//         query(`INSERT INTO \`tasks-executors\` (task_id, user_id) VALUES (${[...result[2]][0].id}, ${result[1][0].id})`).then(r => {
//           query(`SELECT task_id FROM \`tasks-executors\` order by id desc LIMIT 1 `).then(result => {
//             res.json({
//               id: result[0].task_id
//             })
//           })
//         }).catch(err => console.log(err))
//       }).catch(err => {
//         console.log(err)
//       })
//     })
//   }).catch(err => {
//     console.log(err)
//   })
// })

// app.post('/deleteTask', (req, res) => {
//   const taskId = req.body.id
//   const deleteTask = query(`DELETE FROM tasks WHERE id = ${taskId}`)
//   const deleteExecutors = query(`DELETE FROM \`tasks-executors\` WHERE task_id = ${taskId}`)

//   Promise.all([deleteTask, deleteExecutors]).then(result => {
//     res.json({ status: 'ok' })
//   }).catch(err => {
//     res.json({ msg: 'Error', err })
//   })
// })

// app.post('/deleteProject', (req, res) => {

// })

// app.post('/userProjectInfo', (req, res) => {
//   query(`SELECT task_id FROM \`tasks-executors\` WHERE user_id = ${session.id}`)
//     .then(tasks => {
//       query(`SELECT id FROM projects WHERE title = '${req.body.title}'`)
//         .then(project_id => {
//           const ids = tasks.map(e => e.task_id).join(' or id = ')
//           query(`SELECT id, title, time_expected as time, type_id as type, status, project_id FROM tasks WHERE id = ${ids}`).then(task => {
//             const taskData = task.filter(e => e.project_id === project_id[0].id)
//             const data = []

//             for (let i = 0; i < taskData.length; i++) {
//               const obj = {
//                 id: taskData[i].id,
//                 title: taskData[i].title,
//                 timeEnd: new Date(Date.parse(taskData[i].time)).toLocaleDateString('ru-RU', {
//                   year: 'numeric',
//                   month: '2-digit',
//                   day: '2-digit'
//                 })
//               }
//               data.push(obj)
//             }

//             res.json(data)

//           })
//         })
//         .catch(err => {
//           console.log(err)
//         })
//     })
//     .catch(err => console.log(err))
// })

/**
 * input
 * String query
 * return Promise
 */
function query(query) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {

      if (err) reject({
        msg: 'Ошибка getConnection',
        error: err
      })

      connection.query(query, function (error, results) {
        connection.release()

        if (error) reject({
          msg: 'Ошибка connection',
          error: error
        })

        resolve(results)
      })
    })
  })
}

// ////////////////////// passport-config ////////////////////
function authentication() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  };
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  if (user !== undefined) {
    session.login = user.login
    session.id = user.id
    session.prof_id = user.prof_id
    session.fname = user.first_name
    session.lname = user.last_name
    // session.isAdmin = user.isAdmin;
    done(null, user)
  } else {
    done(null, false)
  }
});

passport.use(
  new LocalStrategy({
      usernameField: "login",
      passwordField: "password"
    },
    function (login, password, done) {
      pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(
          `SELECT * FROM \`users\` WHERE login='${login}' and password='${password}'`,
          function (error, results) {
            connection.release()

            if (error) throw error;

            if (results.length !== 0) {
              return done(null, results[0]); // results[0] === user
            } else {
              return done(null, false);
            }
          }
        )
      })
    }
  )
)

app.listen(8080, () => {
  console.log("Development server is running on port 8080");
})