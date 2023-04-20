const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symboleCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '`~!@#$%^&*()][{}\|?/>.<,;:';

let password = "";
let passwordLength = 13;
let checkCount = 0;
handleSider();
//set strength circle color grey
setIndicator("#ccc")

//set passwordLength
function handleSider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength -min) * 100/(max-min)) + "100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max -min)) +min;
}

function genereRandomNumber(){
    return getRndInteger(0,9);
}

function getRandomLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function getRandomUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function getRandomSymbol(){
    const ranNum = getRndInteger(0,symbol.length);
     return symbol.charAt(ranNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symboleCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }

    catch(e){
        copyMsg.innerText = "Failed";
    }

    // to make copy wala san visibal
    copyMsg.classList.add("active");

    setTimeout( () =>{
        copyMsg.classList.remove("active");
    },2000);
}


function shufflePassword(array){
    for(let i = array.length-1;i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
    let str = "";
    array.forEach((el) => (str +=el));
    return str;
}


function handleBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
        checkCount++;
    });

    //special condition
    if(passwordLength <checkCount){
        passwordLength = checkCount;
        handleSider();
    }
}


allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleBoxChange);
})


inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleSider();
});


copyBtn.addEventListener('click',()=> {
    if(passwordDisplay.value)
    copyContent();
})


generateBtn.addEventListener('click',() =>{
    if(checkCount ==0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSider();
    }

    password = "";

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked()){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked()){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked()){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
    funcArr.push(getRandomUppercase);

    if(lowercaseCheck.checked)
    funcArr.push(getRandomLowercase);

    if(numbersCheck.checked)
    funcArr.push(genereRandomNumber);

    if(symboleCheck.checked)
    funcArr.push(getRandomSymbol);

    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    for(let i = 0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();

});