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

const moment = require('moment')
moment.locale('ru')

const pug = require('pug')

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

  if (session.prof_id === 4) {
    const profession = query(`SELECT name as profession FROM profession WHERE id = ${session.prof_id}`)
    const projects = query(`SELECT * FROM projects`)
    const tasks_type = query(`SELECT * FROM task_type`)
    const workers = query(`SELECT id, first_name as f, last_name as l FROM users WHERE prof_id <> 4`)

    Promise.all([projects, profession, tasks_type, workers])
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
          isAdmin: session.prof_id === 4 ? true : false,
          workers: results[3],
          tasks_type: results[2]
        })
      })
  } else {
    const projects = query(`SELECT * FROM projects`)
    const worker = query(`
    SELECT users.id, first_name as f, last_name as l, name FROM users
    INNER JOIN profession ON prof_id = profession.id
    WHERE prof_id = ${session.prof_id} and users.id = ${session.id}
    `)

    Promise.all([projects, worker])
      .then(results => {
        const progress = results[0].filter(e => e.status === 0)
        const ready = results[0].filter(e => e.status === 1)

        res.render('user', {

          first_name: session.fname,
          last_name: session.lname,
          profession: results[1][0].name,
          ready,
          progress,
          tasks_type: [],
          workers: []
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
})

app.post('/info', (req, res) => {
  query(`SELECT tasks.id, tasks.title, tasks.time_start, tasks.time_end,
  tasks.status, first_name, last_name, name
  FROM tasks
  INNER JOIN users ON tasks.user_id = users.id
  INNER JOIN task_type ON tasks.type_id = task_type.id
  WHERE project_id = ${req.body.project_id}`)
    .then(result => {
      console.log(result)
      res.json({
        project_id: req.body.project_id,
        progress: result.filter(e => e.status === 0 || e.status === 2), // добавить статус 2 для отображения задач, которые находятся в статусе ожидание
        ready: result.filter(e => e.status === 1)
      })
    })
    .catch(err => {
      res.json(err)
      console.log(err)
    })
})

app.post('/deleteTask', (req, res) => {
  query(`DELETE FROM tasks WHERE id = ${req.body.task_id}`)
    .then(result => {
      res.json('ok')
    })
    .catch(err => {
      console.log(err)
    })
})

app.post('/addTask', (req, res) => {
  query(`INSERT INTO tasks (title, time_start, time_end, type_id, status, project_id, user_id)
  VALUES ('${req.body.title}', '${req.body.timeStart}',
  '${req.body.timeEnd}', ${req.body.task_type}, 0,
  ${req.body.project_id}, ${req.body.user})`)
    .then(result => {
      res.json('ok')
    })
    .catch(err => {
      console.log(err)
    })
})

app.post('/addProject', (req, res) => {
  query(`INSERT INTO projects (pic, title, time_start, time_end, status)
  VALUES ('${req.body.pic}', '${req.body.title}', '${req.body.dateStart}', '${req.body.dateEnd}', 0)`)
    .then(result => {
      res.json('ok')
    })
    .catch(err => {
      console.log(err)
    })
})

app.post('/closeProject', (req, res) => {
  query(`UPDATE tasks 
  SET status = 1 WHERE project_id = ${req.body.project_id}`)
    .then(result => {
      query(`UPDATE projects 
      SET status = 1 WHERE id = ${req.body.project_id}`)
        .then(results => {
          res.json('ok')
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
})

app.post('/userInfo', (req, res) => {
  query(`
  SELECT tasks.id, tasks.title, tasks.time_start, tasks.time_end,
  tasks.status, first_name, last_name, name
  FROM tasks
  INNER JOIN users ON tasks.user_id = users.id
  INNER JOIN task_type ON tasks.type_id = task_type.id
  WHERE project_id = ${req.body.project_id} AND users.id = ${session.id}`)
    .then(result => {
      res.json({
        project_id: req.body.project_id,
        progress: result.filter(e => e.status === 0),
        ready: result.filter(e => e.status === 1)
      })
    })
    .catch(err => {
      console.log(err)
    })
})

app.post('/closeTask', (req, res) => {
  query(`UPDATE tasks 
  SET status = 1 WHERE id = ${req.body.task_id}`)
    .then(result => {

      query(`SELECT time_success FROM tasks WHERE id = ${req.body.task_id}`)
        .then(results => {
          let dateB = Date.parse(results[0].time_success) //moment()
          let dateC = Date.now() //moment()
          query(`UPDATE tasks 
          SET time_success = '${formatDate(new Date(new Date - (dateC - dateB)))}' WHERE id = ${req.body.task_id}`).then(resultz => {
            res.json('ok')
          }).catch(err => console.log(err))

        })
    })
    .catch(err => {
      console.log(err)
    })
})
//, time_success = ${new Date()}

app.post('/getTasks', (req, res) => {
  query(`
    SELECT user_id, COUNT(DISTINCT(title)) as task_count, 
    sum(status) as status_sum, 
    first_name, last_name 
    FROM tasks 
    INNER JOIN users ON user_id = users.id
    WHERE project_id = ${req.body.project_id}
    GROUP BY user_id
  `)
    .then(result => {
      res.json({
        tasks: result
      })
    })
    .catch(err => {
      console.log(err)
    })
})

app.post('/getUserTasks', (req, res) => {
  query(`
    SELECT user_id, COUNT(DISTINCT(title)) as task_count, 
    sum(status) as status_sum, 
    first_name, last_name 
    FROM tasks 
    INNER JOIN users ON user_id = users.id
    WHERE project_id = ${req.body.project_id} and users.id = ${session.id}
    GROUP BY user_id
  `)
    .then(result => {
      res.json({
        tasks: result
      })
    })
    .catch(err => {
      console.log(err)
    })
})

app.post('/getAllTasksDate', (req, res) => {
  query(`
  SELECT * FROM tasks
  INNER JOIN users ON user_id = users.id
  WHERE time_start >= '${req.body.time_start}'
  AND
  time_end <= '${req.body.time_end}'
  AND
  project_id = ${req.body.project_id}
  `)
    .then(result => {
      res.json(result)
    })
    .catch(err => console.log(err))
})

app.post('/getUserTasksDate', (req, res) => {
  query(`
  SELECT * FROM tasks
  WHERE time_start >= '${req.body.time_start}'
  AND
  time_end <= '${req.body.time_end}'
  AND
  project_id = ${req.body.project_id}
  AND
  user_id = ${session.id}`)
    .then(result => {
      res.json(result)
    })
    .catch(err => console.log(err))
})

app.post('/updateTaskStatus', (req, res) => {
  console.log('time time time', req.body.date)
  query(`UPDATE tasks 
  SET status = 2 WHERE id = ${req.body.task_id}`)
    .then(result => {
      query(`UPDATE tasks SET time_success = '${req.body.date}' WHERE id = ${req.body.task_id}`)
        .then(results => res.json('ok'))
        .catch(err => console.log(err))
    })
    .catch(err => res.json(err))
})

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
    done(null, user)
  } else {
    done(null, false)
  }
})

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

            if (error) throw error

            if (results.length !== 0) {
              return done(null, results[0])
            } else {
              return done(null, false)
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


function formatDate(date) {
  let diff = new Date() - date; // разница в миллисекундах

  if (diff < 1000) { // меньше 1 секунды
    return `0000-00-00 00:00:01`
  }

  let sec = Math.floor(diff / 1000); // преобразовать разницу в секунды

  if (sec < 60) {
    return `0000-00-00 00:00:${sec}`
  }

  let min = Math.floor(diff / 60000); // преобразовать разницу в минуты
  if (min < 60) {
    return `0000-00-00 00:${min}:00`
  }

  // отформатировать дату
  // добавить ведущие нули к единственной цифре дню/месяцу/часам/минутам
  let d = date;
  d = [
    '0' + d.getDate(),
    '0' + (d.getMonth() + 1),
    '' + d.getFullYear(),
    '0' + d.getHours(),
    '0' + d.getMinutes()
  ].map(component => component.slice(-2)); // взять последние 2 цифры из каждой компоненты

  // соединить компоненты в дату
  return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':');
}