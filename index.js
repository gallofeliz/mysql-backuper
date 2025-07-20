const { runApp } = require('@gallofeliz/application')
const { mysqlDump } = require('@gallofeliz/mysql-dump')
const { runServer } = require('@gallofeliz/http-server')

function readEnvOrThrow(envname) {
    if (!(envname in process.env)) {
        throw new Error(envname + ' not found')
    }

    return process.env[envname]
}

const config = {
    host: readEnvOrThrow('DB_HOST'),
    user: readEnvOrThrow('DB_USER'),
    password: readEnvOrThrow('DB_PASSWORD'),
    dbname: readEnvOrThrow('DB_NAME'),
    outputFile: readEnvOrThrow('OUTPUT_FILE'),
}

runApp({
    run({abortSignal, logger}) {
        runServer({
            abortSignal,
            logger,
            port: 80,
            routes: [{
                path: '/dump',
                async handler({abortSignal, logger}) {
                    await mysqlDump({
                        abortSignal,
                        host: config.host,
                        user: config.user,
                        password: config.password,
                        database: config.dbname,
                        logger,
                        output: {
                            type: 'file',
                            filepath: config.outputFile
                        },
                        lockTables: false,
                        dumpDate: false,
                        noTablespaces: true
                    })
                }
            }]
        })
    }
})