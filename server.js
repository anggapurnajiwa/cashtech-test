
const chalk = require('chalk')
const { init } = require('./setup')

const start = async () =>  {
    const server = await init()    
    await server.start()
    .then(() => console.log(chalk.bold(chalk.green('✅ Server ', chalk.yellow(server.info.uri)))))
}

start()