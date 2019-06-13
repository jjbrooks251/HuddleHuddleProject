let records = []; //All records currently pulled from the database
let selectedRecord; //The currently selected record (if any)

const selectRecord = (id) => {
    for(let record of records){
        if(record.id == id){
            selectedRecord = record;
        }
    }
};

function displayData(data) {
    records = []; //Reset this variable

    let parsedData = JSON.parse(data); //Convert the json data to an object

    if (Array.isArray(parsedData)) { //if its an array merge it into records
        records = records.concat(parsedData);
        console.log(records);
    } else {
        records.push(parsedData); //if not just push it
    }

    let dataTable = document.getElementById("tbl");
    let keys = Object.keys(records[0]); //Get all of the keys for the object. We dont care about which object.

    //If the data table exists then delete it by removing it from the parent
    if (!!dataTable) {
        document.getElementById("data-table").removeChild(dataTable);
    }

    //Set up the initial table
    dataTable = document.createElement("table");
    dataTable.className = "table table-hover"; //Bootstrap
    dataTable.id = "tbl";
    let head = dataTable.createTHead();
    head.className = "thead-dark"; //Bootstrap        

    //Create table headers    
    for (let key of keys) {
        let cell = document.createElement("th");
        cell.innerHTML = "<b>" + key + "</b>";
        head.appendChild(cell);
    }

    //Create table header cell for the selection boxes
    let headCell = document.createElement("th");
    headCell.innerHTML = "<b>Actions</b>";
    head.appendChild(headCell);

    //Attach the table to the document
    document.getElementById("data-table").appendChild(dataTable);

    //Start appending the data
    let body = dataTable.createTBody();

    //Create table rows
    records.forEach(element => {
        row = body.insertRow();

        for (let i = 0; i < keys.length + 1; i++) {
            let cell = row.insertCell();
            console.log(element);

            if (i < keys.length) {
                let text = document.createTextNode(element[keys[i]]);
                cell.append(text);
            } else {
                let selector = document.createElement("INPUT");
                selector.setAttribute("type", "button");
                selector.setAttribute("id", element[keys[0]])
                selector.setAttribute("class", "btn")
                selector.setAttribute("onclick", "viewOwnerPets(id)");
                selector.value = "View Pets"
                cell.append(selector);
            }
        }
    });
}


function makeRequest(method, url, body) {
    return new Promise((res, rej) => {
        const req = new XMLHttpRequest();
        req.open(method, api + url);

        req.onload = () => {
            if (req.status >= 200 && req.status < 300) {
                res(req.responseText);
            } else {
                rej(req.statusText);
            }
        };
        req.send(body);
    });
}