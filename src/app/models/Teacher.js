const db = require("../../config/db")
const { date } = require("../../lib/utils")

module.exports = {

  all(callback) {

    db.query(`
    SELECT teachers.*, count(students) AS total_students
    FROM teachers
    LEFT JOIN students ON (teachers.id = students.teacher_id)
    GROUP BY teachers.id
    ORDER BY total_students DESC`, function(err, results) {

      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })

  },

  create(data, callback) {

    const query = `
      INSERT INTO teachers (
        avatar_url,
        name,
        birth,
        educational_level,
        class_type,
        occupation_areas,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `
    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.educational_level,
      data.class_type,
      data.occupation_areas,
      date(Date.now()).iso
    ]

    db.query(query, values, function(err, results) {

      if(err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })
  },

  find(id, callback) {

    db.query(`
      SELECT *
      FROM teachers
      WHERE id = $1`, [id], function(err, results) {

        if(err) throw `Database Error! ${err}`

        callback(results.rows[0])
      })

  },

  findBy(filter, callback) {
    db.query(`
    SELECT teachers.*, count(students) AS total_students
    FROM teachers
    LEFT JOIN students ON (teachers.id = students.teacher_id)
    WHERE teachers.name ILIKE '%${filter}%'
    OR teachers.occupation_areas ILIKE '%${filter}%'
    GROUP BY teachers.id
    ORDER BY total_students DESC`, function(err, results) {

      if(err) throw `Database error! ${err}`

      callback(results.rows)
    })

  },

  update(data, callback) {

    const query = `
    UPDATE teachers SET
      avatar_url = ($1),
      name = ($2),
      birth = ($3),
      educational_level = ($4),
      class_type = ($5),
      occupation_areas = ($6)
    WHERE id = $7
    `
    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.educational_level,
      data.class_type,
      data.occupation_areas,
      data.id
    ]

  db.query(query, values, function(err, results) {

    if(err) `Database Error! ${err}`

    callback()

  })

  },

  delete(id, callback) {

    db.query(`
      DELETE 
      FROM teachers 
      WHERE id = $1`, [id], function(err, results) {

      if(err) `Database Error! ${err}`
      
      callback()

    })

  },

  paginate(params) {

   const { filter, limit, offset, callback } = params

   let query = "",
      filterQuery = "",
      totalQuery = `(
        SELECT count(*) FROM teachers 
      ) AS total`


   if ( filter ) {

     filterQuery = `
     WHERE teachers.name ILIKE '%${filter}%'
     OR teachers.occupation_areas ILIKE '%${filter}%'
     `

     totalQuery = `(
       SELECT count(*) FROM teachers
       ${filterQuery}
     ) AS total`

   }

   query = `
   SELECT teachers.*, ${totalQuery}, count(students) AS total_students
   FROM teachers
   LEFT JOIN students ON (teachers.id = students.teacher_id)
   ${filterQuery}
   GROUP BY teachers.id LIMIT $1 OFFSET $2
   `

   db.query(query, [limit, offset], function(err, results) {
     if (err) throw `Database Error! ${err}`

     callback(results.rows)
   })
  }

}