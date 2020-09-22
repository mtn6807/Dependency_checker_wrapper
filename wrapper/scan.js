const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const axios = require('axios')
const fs = require('fs');
const { config } = require('process');
const OUTPUTFILE = "dependency-check-report.csv"
const MAXDATASIZE = 10;

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

function scanDirAsync(directory){
    const exec = require("child_process").exec;

    //run dependency-check
    return new Promise((resolve,reject) =>{ 
        exec(`dependency-check -s ${directory} -f CSV`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            resolve(OUTPUTFILE)
        })
    });
}

async function scanDir(dir){
    return await(scanDirAsync(dir))
}

function parseRaw(filename){
    return new Promise((resolve,reject)=>{
        fs.readFile(filename, 'utf8', (err, outString) => {
            if (err) {
                console.log("File read failed:", err);
                return
            }
            resolve(outString)
        });
    })
}

async function parseRawScan(filename){
    return (await(parseRaw(filename))).split("\n");
}

async function parseConfig(filename){
    return JSON.parse(await(parseRaw(filename)));
}

function removeRawfile(){
    fs.unlink(OUTPUTFILE, function (err) {
        if (err) throw err;
    }); 
}

async function getScanData(dir){
    //scan dir and parse it
    await scanDir(dir);
    scanObj = await parseRawScan(OUTPUTFILE);
    removeRawfile();
    return scanObj;
}

function postScan(uri,port,data){
    axios.post(`http://${uri}:${port}/newscan`,data)
        .then((res)=>{
            //console.log(`Status: ${res.status}`);
            //console.log(`Body: `,res.data);
        }).catch((err)=>{
            console.error(err)
        });
}

async function sendScanData(config, data){
    data = await data;
    const configdata = await parseConfig(config);
    const port = configdata.port;
    const uri = configdata.uri;
    
    let counter = 0;
    let currentPacket = {
        "final": false,
        "data": []
    };
    data.forEach((result)=>{
        if(counter>data.length-(MAXDATASIZE-1)){
            currentPacket.final=true
        }
        currentPacket.data.push(result);
        counter++
        if(counter%MAXDATASIZE==0){
            postScan(uri,port,currentPacket)
            currentPacket = {
                "final": false,
                "data": []
            }
        }
    });
    postScan(uri,port,currentPacket)
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
        sendScanData(args.config,getScanData(args.project))
    }
}

function main(){
    parseArgs(getCommandLineInput())
}

main();