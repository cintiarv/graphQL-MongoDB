import graphql, {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLSchema,
  GraphQLList
} from 'graphql'

import { Course } from '../models/course.js'
import { Professor } from '../models/professor.js'

const users = [
  { id: '1', name: 'Beto', email: 'beto@gmail.com', password: 'abc123' },
  { id: '2', name: 'Lucy', email: 'lucy@gmail.com', password: 'abc123' },
  { id: '3', name: 'Ana', email: 'ana@gmail.com', password: 'abc123' },
  { id: '4', name: 'Ema', email: 'ema@gmail.com', password: 'abc123' }
]

const CourseType = new GraphQLObjectType({
  // nos permite las relaciones entre los diferentes tipos
  name: 'Course',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    language: { type: GraphQLString },
    date: { type: GraphQLString },
    professor: {
      // relación 1 a 1, un curso puede tener solo 1 profesor
      type: ProfessorType,
      resolve (parent, args) {
        // return professors.find(
        // (professor) => professor.id === parent.professorId
        return Professor.findById(parent.professorId)
      }
    }
  })
})

const ProfessorType = new GraphQLObjectType({
  name: 'Professor',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    active: { type: GraphQLBoolean },
    date: { type: GraphQLString },

    course: {
      // relación 1 a muchos, un profesor puede tener varios cursos
      type: new GraphQLList(CourseType),
      resolve (parent, args) {
        // return courses.filter((course) => course.professorId === parent.id);
        return Course.find(
          { professorId: args.id } // el professorId que coincida con el query id
        )
      }
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    course: {
      type: CourseType,
      args: {
        id: { type: GraphQLID }
      },
      resolve (parent, args) {
        // parent, cuando haya relaciones entre los tipos argument, lo que nos llega de la solicitud
        // return courses.find((curso) => curso.id === args.id);
        return Course.findById(args.id)
      }
    },
    courses: {
      type: new GraphQLList(CourseType),
      resolve (parent, args) {
        return Course.find(args.name)
      }
    },
    professor: {
      // parametro tal cual nos llega en la query
      type: ProfessorType,
      args: {
        name: { type: GraphQLString }
      },
      resolve (parent, args) {
        // parent, cuando haya relaciones entre los tipos argument, lo que nos llega de la solicitud
        // return professors.find((professor) => professor.name === args.name);
        return Professor.findOne({ name: args.name }) // buscará en la colección de profesores el campo de name que coincida con args.name
      }
    },
    professors: {
      type: new GraphQLList(ProfessorType),
      resolve (parent, args) {
        return Professor.find(args.name)
      }
    },
    user: {
      // parametro tal cual nos llega en la query
      type: UserType,
      args: {
        email: { type: GraphQLString }
      },
      resolve (user, args) {
        // parent, cuando haya relaciones entre los tipos argument, lo que nos llega de la solicitud
        return users.find((user) => user.email === args.email)
      }
    }
  }
})

// For create, update & delete
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // COURSES
    addCourse: {
      type: CourseType,
      args: {
        name: { type: GraphQLString },
        language: { type: GraphQLString },
        date: { type: GraphQLString },
        professorId: { type: GraphQLID }
      },
      resolve (parent, args) {
        const course = new Course({
          name: args.name,
          language: args.language,
          date: args.date,
          professorId: args.professorId
        })
        return course.save() // guardándolo en la DB
      }
    },
    updateACourse: {
      type: CourseType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        language: { type: GraphQLString },
        date: { type: GraphQLString },
        professorId: { type: GraphQLID }
      },
      resolve (parent, args) { // la función resolve es la que se encarga de actualizar
        return Course.findByIdAndUpdate(
          args.id, {
            name: args.name,
            language: args.language,
            date: args.date,
            professorId: args.professorId
          },
          {
            new: true // para que muestre la nueva data en la terminal cuando se actualice
          }
        )
      }
    },
    deleteACourse: {
      type: CourseType,
      args: {
        id: { type: GraphQLID }
      },
      resolve (parent, args) {
        return Course.findByIdAndDelete(args.id)
      }
    },
    deleteAllCourses: {
      type: CourseType,
      resolve (parent, args) {
        return Course.deleteMany({})
      }
    },

    // PROFESSORS
    addProfessor: {
      type: ProfessorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        active: { type: GraphQLBoolean },
        date: { type: GraphQLString }
      },
      resolve (parent, args) {
        return Professor(args).save()
      }
    },
    updateAProfessor: {
      type: ProfessorType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        active: { type: GraphQLBoolean },
        date: { type: GraphQLString }
      },
      resolve (parents, args) {
        return Professor.findByIdAndUpdate(args.id, {
          name: args.name,
          age: args.age,
          active: args.active,
          date: args.date
        },
        {
          new: true
        })
      }
    },
    deleteAProfessor: {
      type: ProfessorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve (parent, args) {
        return Professor.findByIdAndDelete(args.id)
      }
    },
    deleteAllProfessors: {
      type: ProfessorType,
      resolve (parent, args) {
        return Professor.deleteMany({})
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
export { schema }
