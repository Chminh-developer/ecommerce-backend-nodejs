'use strict'

const mongoose = require("mongoose");
const os = require('os');
const process = require('process');

const _SECONDS = 1800000;

// count Connect
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections::${numConnection}`);
}

// check over load
const checkOverload = () => {
    setInterval( () => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximun number off connections based on number osf cores
        const maxConnections = numCores * 5;

        console.log(`Active connections:: ${numConnection}`);
        console.log(`Memory usage:: ${memoryUsage / 1024 /1024} MB`);
        if(numConnection > maxConnections){
            console.log(`Connection overload detected!`);
        }

    }, _SECONDS); // monitor every 5 seconds
}

module.exports = { 
    countConnect,
    checkOverload,
};