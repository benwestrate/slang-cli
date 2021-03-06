#!/usr/bin/env node

/**
 * Module dependencies.
 */
var fs       = require('fs');
var program  = require('commander');
var chokidar = require('chokidar');
var author   = require('aem-slang');
var publish  = require('aem-slang');
var ready    = false;
var ignore   = [
    /(^|[\/\\])\../,
    /node_modules/,
    /package.json/,
    /\/target\//,
    /.java/,
    /.xml/
];
var userIgnore = [];
var path = '.';

program
  .version('1.1.6')
  .option('-p, --port [port]', 'Port to push files to default is publish 4503', '4503')
  .option('-pA, --portAuthor [port]', 'Port to push files to author', '4502')
  .option('-u, --user [username]', 'User name for auth', 'admin')
  .option('-pass, --password [password]', 'Add the user password [admin]', 'admin')
  .option('-b, --both', 'Push files to both author and publish', false)
  .option('-i, --ignore [ignoreFiles]', 'A comma seperated list of files or file types to ignore', null)
  .option('-pd, --pubDomain [localhost]', 'Specify a path to use for publish. Defaults to localhost', 'localhost')
  .option('-ad, --authDomain [localhost]', 'Specify a path to use for publish. Defaults to localhost', 'localhost')
  .option('-w, --watchPath [ ]', 'Specify root path to watch for file changes', '')
  .parse(process.argv);

console.log(`Sending files to ${program.pubDomain}:${program.port} with credentials ${program.user}:${program.password}`);

if( program.both ){
    console.log(`Sending files to ${program.authDomain}:${program.portAuthor} with credentials ${program.user}:${program.password}`);
}

// This is to allow us to listen to the Add event so that when new files are added they
// will be added to AEM.
setTimeout( function() {
    ready = true;
}, 2000 );


if( program.ignore ){
    userIgnore = program.ignore.split(',');

    userIgnore.forEach( function( val, index ) {
        ignore.push( new RegExp( val ) );
    } )

    console.log(ignore);
}

let pathToWatch = '.'
if( program.watchPath !== '' ) pathToWatch = __dirname + '/' + program.watchPath


author.setOptions({
    port     : program.portAuthor,
    host     : program.authDomain,
    username : program.user,
    password : program.password
});

publish.setOptions({
    port     : program.port,
    host     : program.pubDomain,
    username : program.user,
    password : program.password
});

 if( !fs.existsSync(pathToWatch) ){
     throw "Path passed to cli does not exist : " + pathToWatch
 }

chokidar.watch( pathToWatch,
    {
        ignored: ignore
    }
).on('all', (event, path) => {

    switch (event) {
        case "change":
            if( ready ) pushFileToAEM( path )
            break;
        case "add":
            if( ready ) pushFileToAEM( path )
            break;
        default:
            // do nothing
    }

});


function pushFileToAEM( path ) {

    if( program.both ){
        author.up(path).then(function(status) {
            // any action for after successful upload
            // console.log( status );
        }).catch(function(err) {
            // handle error
            console.error( err );
        });
        publish.up(path).then(function(status) {
            // any action for after successful upload
            // console.log( status );
        }).catch(function(err) {
            // handle error
            console.error( err );
        });
    } else {
        publish.up(path).then(function(status) {
            // any action for after successful upload
            // console.log( status );
        }).catch(function(err) {
            // handle error
            console.error( err );
        });
    }

}
