const { firebase, FieldValue } = require('../firebase');
const Employee = require('../models/user');

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
function calculateDistance(collectorId, points) {
    // calculate distance between each pair of waypoints
    let distance = [];
    for(let i = 0; i < points.length - 1; i++) {
        distance.push(getDistance(points[i], points[i + 1]));
    }

    return distance.reverse();
}

// generate current point from given distance array and velocity
async function process(collectorId, points, distance, velocity) {
    const updateMapInfo = async () => {
        const data = { collectorId, points, distance };
        await firebase.collection('waypoints').doc(collectorId).update(data);
    }

    const subprocess = async (tmp, tmpPoint, step) => {
        tmp -= step;
        distance.push(tmp);
        points.push(tmpPoint);
        const l = points.length;
        await updateMapInfo();
        const currentPos = generateCurrentPosition(points[l-1], points[l-2], tmp);
        await firebase.collection('currentPos').doc(collectorId).set({
            collectorId: collectorId,
            lastSeen: Date.now(),
            currentPos: currentPos
        });
        return {
            currentPos,
            route: points.reverse()
        };
    }

    if(distance.length){
        let tmp = distance.pop();
        let tmpPoint = points.pop()
        if(tmp >= velocity) {
            return await subprocess(tmp, tmpPoint, velocity);
        }
        else {
            let traverse = velocity;
            while(distance.length > 0 && tmp < traverse) {
                traverse -= tmp;
                tmp = distance.pop();
                tmpPoint = points.pop();
            }
            if(tmp <= traverse && points.length == 1 && distance.length == 0) {
                await firebase.collection('waypoints').doc(collectorId).delete();
                await firebase.collection('currentPos').doc(collectorId).set({
                    collectorId: collectorId,
                    lastSeen: Date.now(),
                    currentPos: points[0]
                });
                return {
                    currentPos: points[0],
                    route: []
                };
            }
            else {
                return await subprocess(tmp, tmpPoint, traverse);
            }
        }
    }
}

// generate current point of a collector
async function generateCurrentPositionOfCollector(collectorId) {      
    const route = await firebase.collection('waypoints').doc(collectorId).get();
    const current = await firebase.collection('currentPos').doc(collectorId).get();

    
    // collector is not on any route
    if(!route.exists) {
        // find current position document in Firestore
        const result = current.data().currentPos;
        
        // update lastSeen time
        await firebase.collection('currentPos').doc(collectorId).set({
            collectorId: collectorId,
            currentPos: result,
            lastSeen: Date.now()
        });
        console.log("here");

        // return current points
        return {
            currentPos: result,
            route: []
        }
    };

    const time = (Date.now() - current.data().lastSeen) / 1000;
    return await process(collectorId, route.data().points, route.data().distance, 5 * time);     // velocity = 90m/10s => 9m/s
}


// ========= Route function =========
async function inputWaypoints(req, res) {
    try{
        const points = req.body.points;
        const collectorId = req.body.collectorId;
        const distance = calculateDistance(collectorId, points);
        const data = {
            collectorId: collectorId,
            points: points.reverse(),
            distance: distance
        }

        // insert simulation data into firebase
        await firebase.collection('waypoints').doc(collectorId).set(data);
        await firebase.collection('currentPos').doc(collectorId).set({
            collectorId: collectorId,
            currentPos: points[points.length - 1],
            lastSeen: Date.now()
        });
        res.status(200).send("Input successfully");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getCurrentPosition(req, res) {
    try{
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
        const collectors = await Employee.getEmployeeByRole("Collector");
        const janitors = await Employee.getEmployeeByRole("Janitor");
        const collectorId = collectors.map(col => col.id);
        const janitorId = janitors.map(jan => jan.id);

        const idList = collectorId.concat(janitorId);

        for(let i in idList) {
            const point = await generateCurrentPositionOfCollector(idList[i]);
            result.push({
                collectorId: idList[i],
                current: point
            })
        }

        res.send(result);
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