const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const fs = require('fs');
const outputFile = "raw.json"

function getCommandLineInput(){
    const optionDefinitions = [
        { name: 'project', alias: 'p', type: String },
        { name: 'config', alias: 'c', type: String},
        { name: 'help', alias:'h', type: Boolean}
    ];
    return commandLineArgs(optionDefinitions);
}

function generateUsageStatement(){
    const sections = [
        {
          header: 'Dependency_checker_wrapper',
          content: 'Scans you ish.'
        },
        {
          header: 'Options',
          optionList: [
            {
                name: 'required: project -p',
                typeLabel: '{underline directory}',
                description: 'The project directory to scan'
            },
            {
                name: 'required: config -c',
                typeLabel: '{underline configFile}',
                description: 'The config file for the scan'
            },
            {
              name: 'help -h',
              description: 'Print this usage guide.'
            }
          ]
        }
      ]
    
    console.log(commandLineUsage(sections))
}

function scanDir(directory){
    const exec = require("child_process").exec;

    //run dependency-check
    return new Promise((resolve,reject) =>{ 
        exec(`dependency-check -s ${directory} -f JSON -o ${outputFile}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            resolve(outputFile)
        })
    });
}

function parseRaw(){
    return new Promise((resolve,reject)=>{
        fs.readFile(outputFile, 'utf8', (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return
            }
            resolve(JSON.parse(jsonString))
        });
    })
}

async function getScanData(dir){
    await(scanDir(dir))
    scanObj = await(parseRaw())
    console.log(scanObj)
    //remove temp file
    fs.unlink(outputFile, function (err) {
        if (err) throw err;
    }); 
    return scanObj;
}

function parseArgs(args){
    if(Object.keys(args).length==0){
        generateUsageStatement()
        process.exit()
    }
    if(args.help){
        generateUsageStatement()
        process.exit()
    }
    if(args.config && args.project){
        getScanData(args.project)
    }
}

function main(){
    parseArgs(getCommandLineInput())
}

main();