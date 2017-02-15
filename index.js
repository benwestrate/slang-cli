#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program  = require('commander');
var chokidar = require('chokidar');
var slang    = require('aem-slang');


program
  .version('0.0.1')
  .option('-p, --port [port]', 'Port to push files to [4503]', '4503')
  .option('-u, --user [username]', 'User name for auth', 'admin')
  .option('-pass, --password [password]', 'Add the user password [admin]', 'admin')
  .parse(process.argv);

console.log(`Sending files to localhost:${program.port} with credentials ${program.user}:${program.password}`);


slang.setOptions({
    port     : program.port,
    host     : 'localhost',
    username : program.user,
    password : program.password
});

// One-liner for current directory, ignores .dotfiles
chokidar.watch('.', {ignored: [
    /(^|[\/\\])\../,
    'node_modules',
    'package.json'
]}).on('all', (event, path) => {


    switch (event) {
        case "change":
            pushFileToAEM( path )
            break;
        default:

    }


});


function pushFileToAEM( path ) {

    slang.up(path).then(function(status) {
        // any action for after successful upload
        // console.log( status );
    }).catch(function(err) {
        // handle error
        console.error( err );
    });

}
