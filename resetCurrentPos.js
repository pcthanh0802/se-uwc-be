const { firebase } = require('./firebase');
const Employee = require('./models/user');

async function run() {
    const collectors = await Employee.getEmployeeByRole("Collector");
    const janitors = await Employee.getEmployeeByRole("Janitor");
    const collectorId = collectors.map(col => col.id);
    const janitorId = janitors.map(jan => jan.id);

    const idList = collectorId.concat(janitorId);

    const initialPos = {
        "latitude": 10.773483, 
        "longitude": 106.660639,
    }

    for(let i in idList) {
        await firebase.collection('currentPos').doc(idList[i]).set({
            collectorId: idList[i],
            currentPos: initialPos,
            lastSeen: Date.now()
        });
    }
}

(async () => {
    await run();
    console.log("Done!");
})()