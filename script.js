var arrAll = [];
var arrWeightedGrades = [];
var arrGradeTypes = [];

// These values are set to what they are because there are initially 3 rows of inputs
var inputCount = 3;
var tab = 10;

function updateArrs() {

    arrAll = [];
    arrWeightedGrades = [];

    // Storing arrays of grades in arrAll with weight at end
    for (let i = 0; i < inputCount; i++) {
        let arrGrades = toArray("grade"+i).map(Number);
        arrGrades.push(parseInt(document.getElementById("weight"+i).value) / 100);
        arrAll.push(arrGrades);
    }

    // Storing weighted grades in arrWeightedGrades
    for (let i = 0; i < inputCount; i++) {
        arrWeightedGrades.push(calcWeightGrade(arrAll[i]));
    }

}

function calcGrade() {

    // Adding all weighted grades to get final grade
    let grade = 0;
    for (let i = 0; i < inputCount; i++) {
        grade += arrWeightedGrades[i];
    }

    // Injecting final grade to HTML
    if (isNaN(grade)) {
        document.getElementById("display_grade").innerHTML = "Check your input!";
    } else {
        document.getElementById("display_grade").innerHTML = grade.toFixed(2).toString() + "%";
    }

}

function calcWeightGrade(array) {

    // Using (array.length - 1) because weight is at end of array
    let weight = array[array.length - 1];
    let sum = 0;

    for (let i = 0; i < array.length - 1; i++) {
        sum += array[i];
    }

    return (sum / (array.length - 1)) * weight;

}

function calcNeededGrade() {

    let gradeType = document.getElementById("select").value;
    let desiredGrade = parseFloat(document.getElementById("desired_grade").value);

    let neededGrade = desiredGrade;
    let toRemove = -1;
    let arrWeightedGradesCopy = arrWeightedGrades;

    // Putting grade types in an array and matching inputted grade type with index
    for (let i = 0; i < inputCount; i++) {
        let currentGradeType = document.getElementById("type"+i).value;
        arrGradeTypes.push(currentGradeType);

        if (currentGradeType == gradeType) {
            toRemove = i;
        }
    }

    // Removing index that matched inputted grade type from array
    arrWeightedGradesCopy.splice(toRemove, 1);

    // Getting sum of all weighted grades besides that inputted grade type one
    let sumWeightedGrades = 0;
    for (let i = 0; i < arrWeightedGradesCopy.length; i++) {
        sumWeightedGrades += arrWeightedGradesCopy[i];
    }

    // Peforming calculations to isolate the variable in this equation
    let inputtedGradeTypeArr = arrAll[toRemove];
    neededGrade -= sumWeightedGrades;
    neededGrade /= ( (inputtedGradeTypeArr[inputtedGradeTypeArr.length - 1]) / (arrAll[toRemove].length) );
    for (let i = 0; i < inputtedGradeTypeArr.length - 1; i++) {
        neededGrade -= inputtedGradeTypeArr[i];
    }

    // Injecting needed grade to HTML
    if (isNaN(neededGrade)) {
        document.getElementById("display_needed_grade").innerHTML = "Make sure all inputs above are filled in!";
    } else {
        document.getElementById("display_needed_grade").innerHTML = neededGrade.toFixed(2).toString() + "%";
    }

}

function toArray(string) {

    // Removing white space
    let string_nospace = string.replace(/\s/g, "");

    return document.getElementById(string_nospace).value.split(",");

}

function addRow() {

    // Dynamically creating input fields

    let newType = document.createElement("input");
    newType.setAttribute("id", "type" + inputCount);
    newType.setAttribute("autocomplete", "off");
    newType.setAttribute("tabindex", (tab).toString());
    newType.setAttribute("oninput", "updateArrs();addOption();");
    type.appendChild(newType);

    let newGrade = document.createElement("input");
    newGrade.setAttribute("id", "grade" + inputCount);
    newGrade.setAttribute("autocomplete", "off");
    newGrade.setAttribute("tabindex", (tab+1).toString());
    newGrade.setAttribute("oninput", "updateArrs();calcGrade();calcNeededGrade();");
    grade.appendChild(newGrade);

    let newWeight = document.createElement("input");
    newWeight.setAttribute("id", "weight" + inputCount);
    newWeight.setAttribute("size", "3");
    newWeight.setAttribute("autocomplete", "off");
    newWeight.setAttribute("tabindex", (tab+2).toString());
    newWeight.setAttribute("oninput", "updateArrs();calcGrade();calcNeededGrade();");
    weight.appendChild(newWeight);

    inputCount++;
    tab += 3;

}

function removeRow() {

    if (inputCount > 1) {

        let inputsArr = ["type", "grade", "weight"]
        let parent = ""
        let child = ""

        for (let i = 0; i < inputsArr.length; i++) {
            parent = document.getElementById(inputsArr[i]);
            child = document.getElementById(inputsArr[i] + (inputCount - 1));
            parent.removeChild(child);
        }
        
        inputCount--;
        tab -= 3;

    }

}

function addOption() {

    let arrGradeTypesCopy = []

    // Clearing all options before looping through adding them
    document.getElementById("select").innerHTML = "";

    // Making array of grade types
    for (let i = 0; i < inputCount; i++) {
        let currentGradeType = document.getElementById("type"+i).value;
        if (currentGradeType != "") {
            arrGradeTypesCopy.push(currentGradeType);
        }
    }

    // Adding options to select
    for (let i = 0; i < arrGradeTypesCopy.length; i++) {
        newOption = document.createElement("option")
        newOption.text = arrGradeTypesCopy[i]
        document.getElementById("select").appendChild(newOption)
    }
}