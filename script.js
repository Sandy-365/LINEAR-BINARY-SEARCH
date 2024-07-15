
let array = [];
let targetValue = 0;
let linearStepCount = 0;
let binaryStepCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate-array').addEventListener('click', generateArray);
    document.getElementById('linear-search').addEventListener('click', () => {
        document.getElementById("lin2").style.visibility = "visible";
        document.getElementById("bin2").style.visibility = "hidden";
        clearContainers();
        linearStepCount = 0;
        linearSearch();
    });
    document.getElementById('binary-search').addEventListener('click', () => {
        document.getElementById("lin2").style.visibility = "hidden";
        document.getElementById("bin2").style.visibility = "visible";
        clearContainers();
        binaryStepCount = 0;
        binarySearch();
    });
    document.getElementById('both-search').addEventListener('click', () => {
        document.getElementById("lin2").style.visibility = "visible";
        document.getElementById("bin2").style.visibility = "visible";
        clearContainers();
        linearStepCount = 0;
        binaryStepCount = 0;
        generateArray();
        setTimeout(() => {
            linearSearch();
        }, 500);
        setTimeout(() => {
            binarySearch();
        }, 1000);
    });
    document.getElementById('sort-array').addEventListener('click', sortArrayAndSearch);
});

function generateArray() {
    document.getElementById("lin2").style.visibility = "visible";
    document.getElementById("bin2").style.visibility = "visible";
    clearContainers(); // Clear previous data
    const size = parseInt(document.getElementById('array-size').value);
    const elements = document.getElementById('array-elements').value.split(',').map(Number);
    if (elements.length !== size) {
        alert('Array size and number of elements do not match');
        return;
    }
    array = elements;
    targetValue = parseInt(document.getElementById('target').value);
    drawCanvas(array, -1, 0, array.length - 1, 'linear-container');
    drawCanvas(array, -1, 0, array.length - 1, 'binary-container');
}

function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }
    return true;
}

function sortArrayAndSearch() {
    array.sort((a, b) => a - b);
    clearContainers();
    drawCanvas(array, -1, 0, array.length - 1, 'linear-container');
    drawCanvas(array, -1, 0, array.length - 1, 'binary-container');
    document.getElementById('binary-warning').textContent = '';
    document.getElementById('sort-array').style.display = 'none';
    binarySearch();
}

function linearSearch() {
    let currentStep = 0;
    linearSearchStep(array, targetValue, currentStep, 'linear-container');
}

function binarySearch() {
    if (!isSorted(array)) {
        addToSteps(`The data provided is not sorted`, 'binary-steps-container', 'binary-warning');
        document.getElementById('binary-warning').textContent = 'The data provided is not sorted';
        document.getElementById('sort-array').style.display = 'inline-block';
        return;
    }
    let low = 0;
    let high = array.length - 1;
    let currentStep = 0;
    binarySearchStep(array, targetValue, low, high, currentStep, 'binary-container');
}

function linearSearchStep(array, target, currentStep, containerId) {
    if (currentStep < array.length) {
        drawCanvas(array, currentStep, 0, array.length - 1, containerId);
        if (array[currentStep] === target) {
            addToSteps(`FOUND AT INDEX ${currentStep} IN ${currentStep + 1} STEPS`, 'linear-steps-container');
            drawResultBox(currentStep, 'green', containerId);
            return;
        } else {
            addToSteps(`STEP ${currentStep + 1}: ${array[currentStep]} !== ${target}`, 'linear-steps-container');
            drawResultBox(currentStep, 'red', containerId);
        }
        setTimeout(() => {
            linearSearchStep(array, target, currentStep + 1, containerId);
        }, 1000);
    } else {
        addToSteps(`NOT FOUND IN ${currentStep} STEPS`, 'linear-steps-container');
    }
}

function binarySearchStep(array, target, low, high, currentStep, containerId) {
    if (low <= high) {
        const mid = Math.floor((low + high) / 2);
        drawCanvas(array, mid, low, high, containerId);
        if (array[mid] === target) {
            addToSteps(`FOUND AT INDEX ${mid} IN ${currentStep + 1} STEPS`, 'binary-steps-container');
            drawResultBox(mid, 'green', containerId);
            return;
        } else if (array[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
        setTimeout(() => {
            binarySearchStep(array, target, low, high, currentStep + 1, containerId);
        }, 1000);
    } else {
        addToSteps(`NOT FOUND IN ${currentStep} STEPS`, 'binary-steps-container');
    }
}

function drawCanvas(array, highlightIndex = -1, low = 0, high = array.length - 1, containerId) {
    const squareSize = 60; // Increased the box size
    const canvasHeight = 60; // Increased the box size
    const canvasWidth = array.length * squareSize + 20;
    const canvasBox = document.createElement('canvas');
    canvasBox.width = canvasWidth;
    canvasBox.height = canvasHeight;
    canvasBox.classList.add('canvas-box');
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id '${containerId}' not found.`);
        return;
    }
    container.appendChild(canvasBox);
    const ctx = canvasBox.getContext('2d');
    for (let i = 0; i < array.length; i++) {
        if (highlightIndex !== -1 && i === highlightIndex) {
            ctx.fillStyle = 'green';
        } else if (i >= low && i <= high) {
            ctx.fillStyle = '#03dac6';
        } else {
            if (containerId === 'linear-container' && i <= highlightIndex) {
                ctx.fillStyle = 'red';
            } else {
                ctx.fillStyle = '#2b2b2b';
            }
        }
        ctx.fillRect(i * squareSize, 0, squareSize, canvasHeight);
        ctx.strokeRect(i * squareSize, 0, squareSize, canvasHeight);
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText(array[i], i * squareSize + squareSize / 2 - 5, canvasHeight / 2 + 5);
    }
}

function addToSteps(text, containerId, className) {
    const stepsContainer = document.getElementById(containerId);
    const stepElement = document.createElement('p');
    stepElement.textContent = text;
    if (className) {
        stepElement.className = className;
    }
    stepsContainer.appendChild(stepElement);
}

function clearContainers() {
    document.getElementById('linear-container').innerHTML = '';
    document.getElementById('binary-container').innerHTML = '';
    document.getElementById('linear-steps-container').innerHTML = '';
    document.getElementById('binary-steps-container').innerHTML = '';
    document.getElementById('binary-warning').textContent = '';
}

function drawResultBox(index, color, containerId) {
    const canvasBox = document.getElementById(containerId).getElementsByTagName('canvas')[0];
    const ctx = canvasBox.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(index * 60, 0, 60, 60);  // Adjusted for the increased box size
}
