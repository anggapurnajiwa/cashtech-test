/**
 * Module dependencies
 */

const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const chalk = require('chalk')
const laabr = require('laabr')
const Inert = require('@hapi/inert');
const Vision = require('vision'); 
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package.json');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' })

const resources = require('./services/resources.js')

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',           
    })

    // Init Database
    resources.mongoose()   

    // Swagger
    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: Pack.version,
        },
        tags: [           
            {
                name: 'External Documentation',
                description: 'How the Signature Works',
                externalDocs: {
                    description: 'Find out more about the signature works',
                    url: 'http://example.org'
                }
            }
        ],
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
        
    // Router    
    await server.register(require('./config/router'))
    await server.register({
        plugin: laabr,
        options: {            
            formats: {
                onPostStart: ':status',
                request: ':method :remoteAddress :url :status :payload (:responseTime ms)',
                response: `:method - ${chalk.magenta(':remoteAddress')} - ${chalk.gray(':url')} - ${chalk.green(':status')} - (:responseTime ms)`,
            },
        },
    })
    await server.start()
    .then(() => console.log(chalk.bold(chalk.green('✅ Server ', chalk.yellow(server.info.uri)))))
}

process.on('unhandledRejection', (err) => {
    console.log(chalk.bold(chalk.red('❌ error:')))
    console.log(chalk.bold(err))
    throw err
    process.exit(1)
})

init()

module.exports = { init }