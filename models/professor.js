import mongoose from 'mongoose'

const professorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  active: Boolean,
  date: String
})

const Professor = mongoose.model('professor', professorSchema)

export {
  Professor
}
