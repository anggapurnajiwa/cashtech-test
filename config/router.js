const routes = [].concat(
  require('../routes/404'),
  require('../routes/user'),
  require('../routes/merchant')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
