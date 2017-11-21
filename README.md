# slang-cli
CLI for aem-slang

## Install
```
npm install -g slang-cli
```

```bash
Usage: slang-cli [options]

Options:
    -V, --version                  output the version number
    -p, --port [port]              Port to push files to default is publish 4503
    -pA, --portAuthor [port]       Port to push files to author
    -u, --user [username]          User name for auth
    -pass, --password [password]   Add the user password [admin]
    -b, --both                     Push files to both author and publish
    -i, --ignore [ignoreFiles]     A comma seperated list of files or file types to ignore
    -pd, --pubDomain [localhost]   Specify a path to use for publish. Defaults to localhost
    -ad, --authDomain [localhost]  Specify a path to use for publish. Defaults to localhost
    -h, --help                     output usage information
```
