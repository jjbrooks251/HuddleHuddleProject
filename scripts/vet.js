const req = new XMLHttpRequest();
const api = "http://localhost:9966/petclinic/api/";
const createVetForm = document.getElementById("new-Vet-form");
letvets = [];
let selectedVet;
const vetIdInput = document.getElementById("inlineFormInputVetNo");
const firstNameInput = document.getElementById("inlineFormInputFname");
const lastNameInput = document.getElementById("inlineFormInputLname");

const selectRecord = (id) => idOfRecordSelected = id;
let idOfRecordSelected;


function displayData(data) {
   vets = []; //Reset thisvariable

    let parsedData = JSON.parse(data); //Convert the json data to an object

    if (Array.isArray(parsedData)) { //if its an array merge it intovets
       vets =vets.concat(parsedData);
        console.log(vets);
    } else {
       vets.push(parsedData); //if not just push it
    }

    let myTable = document.getElementById("tbl");
    let keys = Object.keys(vets[0]); //Get all of the keys for the object. We dont care about which object.

    if (!!myTable) {
        document.getElementById("data-table").removeChild(myTable);
    }

    //Set up the initial table
    myTable = document.createElement("table");
    myTable.className = "table table-hover"; //Bootstrap
    myTable.id = "tbl";
    let head = myTable.createTHead();
    head.className = "thead-dark"; //Bootstrap        

    //Create table headers    
    for (let key of keys) {
        let cell = document.createElement("th");
        cell.innerHTML = "<b>" + key + "</b>";
        head.appendChild(cell);
    }

    //Create table header cell for the selection boxes
    let headCell = document.createElement("th");
    headCell.innerHTML = "<b>Selection</b>";
    head.appendChild(headCell);

    //Attach the table to the document
    document.getElementById("data-table").appendChild(myTable);

    //Start appending the data
    let body = myTable.createTBody();

    //Create table rows
   vets.forEach(element => {
        row = body.insertRow();

        for (let i = 0; i < keys.length + 1; i++) {
            let cell = row.insertCell();
            console.log(element);

            if (i < keys.length) {
                let text = document.createTextNode(element[keys[i]]);
                cell.append(text);
            } else {
                let selector = document.createElement("INPUT");
                selector.setAttribute("type", "checkbox");
                selector.setAttribute("id", element[keys[0]])
                selector.setAttribute("class", "selector")
                selector.setAttribute("onclick", "selectRecord(id)");
                cell.append(selector);
            }
        }
    });
}

function getAllVets(callback) {

    req.onload = () => {
        callback(req.responseText);
    }

    req.open("GET", api + "vets");
    req.send();
}

function getVetById() {
   var id = prompt("Enter ID of vet to Retrieve: ");

    makeRequest("GET", `vets/${id}`, "")
        .then(data => displayData(data))
        .catch(error => {
            console.log(error);
        }
        );
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

function createVet() {
    const body = `{\"VetNumber\":\"${vetNumberInput.value}\",\"firstName\":\"${firstNameInput.value}\",\"lastName\":\"${lastNameInput.value}\"}`;

    makeRequest("POST", "vets", body)
        .then(resp => {
            const response = JSON.parse(resp);
            console.log(resp);
            if (response.message == "Vet has been created sucessfully") {
                window.alert(response.message);
                resetForm();
            }
            resetForm();
        })
        .catch(error => {
            console.log(error);
        }
        );
}

function deleteVet() {
   var id = prompt("Confirm ID ofvet to Delete: ", idOfRecordSelected);

    makeRequest("DELETE", `vets/${id}`, "")
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            resetForm();
        })
        .catch(error => {
            console.log(error);
        }
        );
}

function setupUpdateForm() {

    for (let vet of vets) {
        if (vet.id == idOfRecordSelected) {
            selectedVet = vet;
        }
    }

    vetIdInput.value = selectedVet.id;
    firstNameInput.value = selectedVet.firstName;
    lastNameInput.value = selectedVet.lastName;
}

function updateVet() {
    const body = `{\"firstName\":\"${firstNameInput.value}\",\"VetNumber\":\"${vetIdInput.value}\",\"lastName\":\"${lastNameInput.value}\"}`;

    makeRequest("PUT", `vets/${selectedVet.id}`, body)
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            resetForm();
        })
        .catch(error => {
            console.log(error);
        }
        );

        console.log(body);
}



function setTrigger(trigger) {
    document.getElementById("Vet-form").setAttribute("onsubmit", `${trigger}(); return false`);
}

function resetForm() {
    vetIdInput.value = "";
    firstNameInput.value = "";
    lastNameInput.value = "";
}