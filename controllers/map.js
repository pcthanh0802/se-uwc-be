const { firebase } = require('../firebase');

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
    const updateMapInfo = async (collectorId, points, distance) => {
        const data = { collectorId, points, distance };
        await firebase.collection('waypoints').doc(collectorId).update(data);
    }

    if(distance.length){
        let tmp = distance.pop();
        if(tmp >= velocity) {
            tmp -= velocity;
            distance.push(tmp);
            const index = distance.length - 2;
            await updateMapInfo(collectorId, points, distance);
            return generateCurrentPosition(points[index], points[index + 1], tmp);
        }
        else {
            let traverse = velocity;
            while(distance.length > 1 && tmp < traverse) {
                traverse -= tmp;
                tmp = distance.pop();
            }
            if(distance.length == 1) {
                await firebase.collection('waypoints').doc(collectorId).delete();
                return points[points.length - 1];
            }
            else {
                tmp -= traverse;
                distance.push(tmp);
                const index = distance.length - 2;
                await updateMapInfo(collectorId, points, distance);
                return generateCurrentPosition(points[index], points[index + 1], tmp);
            }
        }
    }
}

// generate current point of a collector
async function generateCurrentPositionOfCollector(collectorId) {      
    const data = await firebase.collection('waypoints').doc(collectorId).get();
    if(!data.exists) return null;

    return await process(collectorId, data.data().points, data.data().distance, 90);     // velocity = 90m/10s => 9m/s
}


// ========= Route function =========
async function inputWaypoints(req, res) {
    try{
        const distance = calculateDistance(req.body.collectorId, req.body.points);
        const data = {
            collectorId: req.body.collectorId,
            points: req.body.points,
            distance: distance
        }
        await firebase.collection('waypoints').doc(req.body.collectorId).set(data);
        res.status(200).send("Input successfully");
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getCurrentPosition(req, res) {
    try{
        const result = await generateCurrentPositionOfCollector(req.params.collectorId);
        if (!result) res.status(404).send("Collector is not on any route");
        else res.send(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getAllCurrentPosition(req, res) {
    try{
        const result = [];
        const query = await firebase.collection('waypoints').get();
        const data = query.docs.map(doc => doc.data())

        // no data is found in firebase
        if(data.length === 0) return res.status(404).send("No collector is on any route");

        for(let i in data){
            const point = await process(data[i].collectorId, data[i].points, data[i].distance, 90);
            result.push({ collectorId: data[i].collectorId, point });
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