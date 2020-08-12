import * as fs from 'fs'
export function addDtabaseConnection(database: string, config: any) {
    process.chdir(config.path);
    if (config.language === "Javascript ECMAScript 6") {
        if (database === 'MongoDB') {
            const mongoConnection = 'mongo connection\nmongoose.Promise = global.Promise;\nmongoose.connect(\'mongodb:\/\/root:mongodb@mongodb:27017\/test?authSource=admin\', {useNewUrlParser: true, useUnifiedTopology: true});\nvar mongodb = mongoose.connection; \nmongodb.on(\'error\', console.error.bind(console, \'Erreur lors de la connexion\')); \nmongodb.once(\'open\', function (){\n    console.log(\"Connexion à la base OK\"); \n}); \n\n';
            fs.readFile('./src/server.js', function(err, data) {
                if(err) throw err;
                const existentData = data.toString();
                let temp = existentData.split('//');
                console.log(temp);
                temp.splice(2,0, mongoConnection);
                let newData = temp.join('//');
                
                fs.writeFile('./src/server.js', newData, function(err) {
                    err || console.log('Data replaced \n', data);
                });
            });
        }
    }
}