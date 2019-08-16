// This function gets the datas from the localforage dB:
function getTrainData(cb) {
    localforage.getItem("train-data").then(function (result) {
        cb(result || []);
    });
}

// This function gets every new data pushed from the user:
function setDataTrain(newDataTrain, cb) {
    localforage.setItem("train-data", newDataTrain).then(cb);
}

// This function turns all the inputs into variables:
function addData() {
    document.getElementById("submitButton").addEventListener("click", function (event) {
        const trainName = document.getElementById("trainName").value;
        const destination = document.getElementById("destination").value;
        const firstTrain = document.getElementById("first-train").value;
        const frequencyRate = document.getElementById("frequency").value;
        handleDataTrain(trainName, destination, frequencyRate, firstTrain); 
        
        // This line will clean all the fields:
        document.getElementById("form-train").reset();
    })

}
addData();

// This function turns every data/inputs in new datas on the dB:
function handleDataTrain(newTrainName, newDestination, newFrequency, newFirstTrain, newNextArrival, newMinutesAway) {
    getTrainData(function (trainData) {
        trainData.push({
            trainName: newTrainName,
            destination: newDestination,
            firstTrain: newFirstTrain,
            frequencyRate: newFrequency,
            nextArrival: newNextArrival,
            minutesAway: newMinutesAway
        });
        console.log(trainData);
        setDataTrain(trainData, updateTrainData);
    });
}

// This function generates the HTML div "train-table-body":
function updateTrainData() {

    // Here is the container where data is supposed to go:
    const trainTableBody = document.getElementById("train-table-body");

    // Here is created HTML element for data:
    const trainTR = document.createElement("tr");

    // Here is created every column HTML element with data:
    getTrainData(function (trainData) {
        // Creating the columns:
        const trainNameTD = document.createElement("td");
        const destinationTD = document.createElement("td");
        const frequencyRateTD = document.createElement("td");
        const firstTrainTD = document.createElement("td");
        const nextArrivalTD = document.createElement("td");
        const newMinutesAwayTD = document.createElement("td");

        // Creating every new data:
        let train = trainData[trainData.length - 1];

        // Adding the new datas to the table:
        trainNameTD.innerText = train.trainName;
        destinationTD.innerText = train.destination;
        firstTrainTD.innerText = moment(train.firstTrain, "HH:mm").format("hh:mm A");
        nextArrivalTD.innerText = updateNextArrival(train.firstTrain, train.frequencyRate);
        frequencyRateTD.innerText = train.frequencyRate;
        newMinutesAwayTD.innerText = tMinutesTillTrain;

        // Appending all the td to tr:
        trainTR.append(trainNameTD);
        trainTR.append(destinationTD);
        trainTR.append(firstTrainTD);
        trainTR.append(frequencyRateTD);
        trainTR.append(nextArrivalTD);
        trainTR.append(newMinutesAwayTD);

        // Append tr to table body:
        trainTableBody.append(trainTR);
    })
}

// This function input datas into the table: 
function rendertrainData() {
    const trainTableBody = document.getElementById("train-table-body");
    getTrainData(function (trainData) {

        trainTableBody.innerHTML = "";
        for (let i = 0; i < trainData.length; i++) {
            const trainTR = document.createElement("tr");
            const trainNameTD = document.createElement("td");
            const destinationTD = document.createElement("td");
            const firstTrainTD = document.createElement("td");
            const frequencyRateTD = document.createElement("td");
            const nextArrivalTD = document.createElement("td");
            const newMinutesAwayTD = document.createElement("td");
            let train = trainData[i];

            // Showing the datas into the HTML text:
            trainNameTD.innerText = train.trainName;
            destinationTD.innerText = train.destination;
            firstTrainTD.innerText = moment(train.firstTrain, "HH:mm").format("hh:mm A");
            nextArrivalTD.innerText = updateNextArrival(train.firstTrain, train.frequencyRate);
            frequencyRateTD.innerText = train.frequencyRate;
            newMinutesAwayTD.innerText = tMinutesTillTrain;

            // Appending all the td to tr:
            trainTR.append(trainNameTD);
            trainTR.append(destinationTD);
            trainTR.append(firstTrainTD);
            trainTR.append(frequencyRateTD);
            trainTR.append(nextArrivalTD);
            trainTR.append(newMinutesAwayTD);

            // Appending all the tr to table body:
            trainTableBody.append(trainTR);
        }
    })
}

rendertrainData();

// This variable defines the time interval for update the webpage:
let renderUpdate = setInterval(rendertrainData, 1000);

// Global variable of Minutes Away:
var tMinutesTillTrain = 0;

// This function will calculate the Next Arrival Time and the Minutes Away for the next train:
function updateNextArrival(firstTrain, frequency) {
    var tFrequency = frequency;

    var firstTime = firstTrain;

    // First Time (pushed back 1 year to make sure it comes before current time):
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time:
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times:
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder):
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train:
    tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train:
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    return nextTrain;
}
