const Teacher = require("../models/Teacher")
const { age, date } = require("../../lib/utils")



module.exports = {

  list(req, res) {

   Teacher.all(function(teachers) {

    return res.render("teachers/list", { teachers })
   })

  },

  create(req, res) {

   return res.render('teachers/create')

  },

  post(req, res) {

    const keys = Object.keys(req.body)

    for(key of keys) {

      if (req.body[key] == "") {

        return res.send('Please, fill all fields!')
      }

      Teacher.create(req.body, function(teacher) {

        return res.redirect(`/teachers/${teacher.id}`)
      })

    }
  },

  show(req, res) {

    Teacher.find(req.params.id, function(teacher) {

      if(!teacher) return res.send("Teacher not found!")

      teacher.birth_date = age(teacher.birth_date)
      teacher.subjects_taught = teacher.subjects_taught.split(",")
      teacher.created_at = date(teacher.created_at).format

      return res.render("teachers/show", { teacher })

    })
  
  },

  edit(req, res) {
    
    Teacher.find(req.params.id, function(teacher) {

      if(!teacher) return res.send("Teacher not found!")

      teacher.birth_date = date(teacher.birth_date).iso

      return res.render("teachers/show", { teacher })

    })

  },

  put(req, res) {

    const keys = Object.keys(req.body)

    for(key of keys) {

      if (req.body[key] == "") {

        return res.send('Please, fill all fields!')
      }

      Teacher.update( req.body, function() {

        return res.redirect(`/teachers/${req.body.id}`)
      })

    }

  },

  delete(req, res) {

    Teacher.delete( req.body.id, function() {

      return res.redirect('/teachers')

    })

  }

}








