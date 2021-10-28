/**
 * Captures local prefomance data and sends it up to the socket.io server
 *
 */

//need to know:
//CPU Load, Memory Usage, Os type, uptime, cpu info, clock speed
const os = require('os')

const performanceData = ()=>{
    return new Promise(async (resolve, reject)=>{
        const cpus = os.cpus()
        const osType = os.type()
        const upTime = os.uptime()
        const freeMem = os.freemem()
        const totalMem =  os.totalmem()
        const usedMem = totalMem - freeMem;
        const memUsage =Math.floor(usedMem/totalMem * 100)/100
        const cpuModel = cpus[0].model
        const cpuSpeed = cpus[0].speed
        const numCores = cpus.length
        const cpuLoad = await getCPULoad()
        resolve({
            freeMem,
            totalMem,
            usedMem,
            memUsage,
            osType,
            upTime,
            cpuModel,
            numCores,
            cpuSpeed,
            cpuLoad,
        })
    })
}


const cpuAverage = ()=>{
    const cpus = os.cpus()
    let idleMs = 0;
    let totalMs = 0;
    cpus.forEach((core)=>{
        for(type in core.times){
            totalMs += core.times[type];
        }
        idleMs += core.times.idle
    })
    return {
        idle: idleMs / cpus.length,
        total: totalMs / cpus.length
    }
}

const getCPULoad = () => {
    return new Promise((resolve,reject)=>{
        const start = cpuAverage();
        setTimeout(()=>{
            const end = cpuAverage();
            const idleDifference = end.idle - start.idle
            const totalDifference = end.total - start.total
            const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference)
            resolve(percentageCpu)
        },100)
    })
}

performanceData().then((allPerformanceData)=>{
    console.log(allPerformanceData)
})








