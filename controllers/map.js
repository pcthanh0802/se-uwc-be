const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

// calculate distance between two points with their latitudes and longitudes 
// (result returned in meter)
function getDistance(start, end) {
    const R = 6378.137;
    
    const dif_lat = (end['latitude'] - start['latitude']) * Math.PI / 180;
    const dif_long = (end['longitude'] - start['longitude']) * Math.PI / 180;

    const a = Math.pow(Math.sin(dif_lat / 2), 2) + Math.cos(start['latitude'] * Math.PI / 180) * Math.cos(end['latitude'] * Math.PI / 180) * Math.pow(Math.sin(dif_long / 2), 2);

    return 2 * 1000 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// generate current position based on given information
function generateCurrentPosition(start, end, distance) {
    const start_to_end = getDistance(start, end);
    const ratio = 1 - distance / start_to_end;

    const result = {};
    result['latitude'] = start['latitude'] + ratio * (end['latitude'] - start['latitude']);
    result['longitude'] = start['longitude'] + ratio * (end['longitude'] - start['longitude']);
    
    return result;
}

// generate array of distances between 2 consecutive waypoints in given waypoints array
async function calculateDistance(collectorId, points) {
    // calculate distance between each pair of waypoints
    let distance = [];
    for(let i = 0; i < points.length - 1; i++) {
        distance.push(getDistance(points[i], points[i + 1]));
    }

    // store into json file
    distance = distance.reverse();
    const data = JSON.stringify({ collectorId, points, distance });
    await fsp.writeFile(path.join(__dirname, `../data/map/${collectorId}.json`), data, (err) => console.log(err));
}

// generate current point from given distance array and velocity
async function process(collectorId, points, distance, velocity) {
    const updateMapJson = async (collectorId, points, distance) => {
        const data = JSON.stringify({ collectorId, points, distance });
        await fsp.writeFile(path.join(__dirname, `../data/map/${collectorId}.json`), data, (err) => console.log(err));
    }

    if(distance.length){
        let tmp = distance.pop();
        if(tmp >= velocity) {
            tmp -= velocity;
            distance.push(tmp);
            const index = distance.length - 2;
            await updateMapJson(collectorId, points, distance);
            return generateCurrentPosition(points[index], points[index + 1], tmp);
        }
        else {
            let traverse = velocity;
            while(distance.length > 1 && tmp < traverse) {
                traverse -= tmp;
                tmp = distance.pop();
            }
            if(distance.length == 1) {
                await fsp.unlink(path.join(__dirname, `../data/map/${collectorId}.json`));
                return points[points.length - 1];
            }
            else {
                tmp -= traverse;
                distance.push(tmp);
                const index = distance.length - 2;
                await updateMapJson(collectorId, points, distance);
                return generateCurrentPosition(points[index], points[index + 1], tmp);
            }
        }
    }
}

// generate current point of a collector
async function generateCurrentPositionOfCollector(collectorId) {      
    const data = JSON.parse(await fsp.readFile(path.join(__dirname, `../data/map/${collectorId}.json`)));
    return await process(collectorId, data.points, data.distance, 90);     // velocity = 90m/10s => 9m/s
}


// ========= Route function =========
async function inputWaypoints(req, res) {
    try{
        await calculateDistance(req.body.collectorId, req.body.points);
        res.status(200).send("Input successfully");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getCurrentPosition(req, res) {
    try{
        await fsp.access(path.join(__dirname, `../data/map/${req.params.collectorId}.json`), fs.constants.F_OK).catch(console.log);

        const result = await generateCurrentPositionOfCollector(req.params.collectorId);
        res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getAllCurrentPosition(req, res) {
    try{
        const result = [];
        fsp.readdir(path.join(__dirname, '../data/map'))
            .then(async files => {
                for(let i in files){
                    const data = JSON.parse(await fsp.readFile(path.join(__dirname, '../data/map', files[i])));
                    const point = await process(data.collectorId, data.points, data.distance, 90);
                    result.push({ collectorId: data.collectorId, point: point });
                }

                res.send(result);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            })
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    inputWaypoints,
    getCurrentPosition,
    getAllCurrentPosition
}