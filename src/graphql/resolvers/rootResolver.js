export default {
  Query: {
    _(_parent, _args, _context, _info) {
      return "_Hello_Query_"
    },
    hello(_parent, _args, _context, _info) {
      console.log('hello')
      return "Hello GraphQL World"
    },
  },
  Mutation: {
    _(_parent, _args, _context, _info) {
      return "_Hello_Mutation"
    },
  }
}