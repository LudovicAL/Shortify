window.onload = function initEditor() {
   console.log("Loading ABCJS Editor");
   var abcEditor = new ABCJS.Editor("abcTextArea", {
      canvas_id: "renderingDiv",
      warnings_id:"warningsDiv",
      print: true,
      onchange: this.updatePrintableDiv,
      responsive: "resize"
   });
   console.log("ABCJS Editor Loaded");
   addSet();
}

var setCounter = 1;
var tuneCounter = 1;

function addSet() {
   var currentCount = setCounter;
   console.log("Add set button clicked: " + currentCount);
   let setDiv = createElem(document.getElementById("leftColumn"), document.getElementById("addSetButton"), "div", "set" + currentCount + "Div", null, ["container", "p-3", "my-2", "text-bg-secondary", "rounded-3"], null);
   let setHeader = createElem(setDiv, null, "div", null, null, ["my-2", "d-flex", "flex-row"], null);
   let setTitle = createElem(setHeader, null, "input", null, "text", ["form-control", "w-50"], null)
   setTitle.setAttribute("placeholder", "Set title");
   setTitle.value = "Set " + currentCount;
   let setHeaderButtonDiv = createElem(setHeader, null, "div", null, null, ["w-50"], null);
   let buttonRemoveSet = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-danger", "btn-sm", "mx-1", "float-end"], "Remove set");
   buttonRemoveSet.onclick = function(){removeSet(currentCount)};
   let buttonMoveSetUp = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-success", "btn-sm", "mx-1", "float-end"], "↑");
   buttonMoveSetUp.onclick = function(){moveSetUp(currentCount)};
   let buttonMoveSetDown = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-success", "btn-sm", "mx-1", "float-end"], "↓");
   buttonMoveSetDown.onclick = function(){moveSetDown(currentCount)};
   createElem(setDiv, null, "div", "tuneDiv" + currentCount, ["container", "my-2"], null, null);
   let addTuneToSetButton = createElem(setDiv, null, "button", null, "button", ["btn", "btn-primary", "my-2"], "Add tune to set")
   addTuneToSetButton.setAttribute("data-bs-toggle", "modal");
   addTuneToSetButton.setAttribute("data-bs-target", "#addTuneSet" + currentCount + "Modal");
   let modalDiv = createElem(setDiv, null, "div", "addTuneSet" + currentCount + "Modal", null, ["modal"], null);
   let modalDialogDiv = createElem(modalDiv, null, "div", null, null, ["modal-dialog"], null);
   let modalContentDiv = createElem(modalDialogDiv, null, "div", null, null, ["modal-content"], null);
   let modalHeaderDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-header"], null);
   createElem(modalHeaderDiv, null, "h4", null, null, ["modal-title"], "Modal Heading");
   let modalHeaderButton = createElem(modalHeaderDiv, null, "button", null, "button", ["btn-close"], null);
   modalHeaderButton.setAttribute("data-bs-dismiss", "modal");
   modalHeaderButton.onclick = function(){
         document.getElementById("modalTuneSearchBar" + currentCount).value = "";
      };
   let modalBodyDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-body"], null);
   let modalTuneSearchBar = createElem(modalBodyDiv, null, "input", "modalTuneSearchBar" + currentCount, null, ["form-control"], null);
   modalTuneSearchBar.setAttribute("list", "tuneDatalistDiv");
   modalTuneSearchBar.setAttribute("placeholder", "Type to search...");
   let modalFooterDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-footer"], null);
   let modalFooterButton = createElem(modalFooterDiv, null, "button", null, "button", ["btn", "btn-success"], "Add selected tune");
   modalFooterButton.setAttribute("data-bs-dismiss", "modal");
   modalFooterButton.onclick = function(){
         searchbar = document.getElementById("modalTuneSearchBar" + currentCount);
         addTune(currentCount, searchbar.value);
         searchbar.value = "";
      };
   setCounter++;
}

function removeSet(setId) {
   console.log("Remove set button clicked: " + setId);
   let setNode = document.getElementById("set" + setId + "Div");
   setNode.parentNode.removeChild(setNode);
}

function moveSetUp(setId) {
   console.log("Move set up button clicked: " + setId);
   let setNode = document.getElementById("set" + setId + "Div");
   let index = getNodeIndex(setNode);
   if (index > 0) {
      console.log("Moving set up");
      let setNodeOther = setNode.parentNode.children[index - 1];
      setNode.parentNode.insertBefore(setNode, setNodeOther);
   }
}

function moveSetDown(setId) {
   console.log("Move set down button clicked: " + setId);
   let setNode = document.getElementById("set" + setId + "Div");
   let index = getNodeIndex(setNode);
   if (index < (setNode.parentNode.childElementCount - 2)) {
      console.log("Moving set down");
      let setNodeOther = setNode.parentNode.children[index + 1];
      setNodeOther.parentNode.insertBefore(setNodeOther, setNode);
   }
}

function addTune(setId, tuneName) {
   console.log("Add tune button clicked: " + setId + ", " + tuneName);
   if (tuneExists(tuneName)) {
      let tuneDivNode = document.getElementById("tuneDiv" + setId);
      let newTuneDivNode = createElem(tuneDivNode, null, "div", "tune " + tuneCounter + ", " + tuneName, null, ["container", "p-4", "my-2", "text-bg-warning", "rounded-3"], null);
      tuneCounter++;
      let newTuneTitleNode = createElem(newTuneDivNode, null, "h4", null, null, null, tuneName);
      let newTuneCloseButton = createElem(newTuneTitleNode, null, "button", null, "button", ["btn", "btn-close", "btn-sm", "float-end"], null);
      newTuneCloseButton.onclick = function(){removeTune(setId, newTuneDivNode);};
      requestAbc(setId, newTuneDivNode, tuneName);
   } else {
      displayToast("This tune does not exist.");
   }
}

function removeTune(setId, tuneNode) {
   console.log("Remove tune button clicked: " + setId + ", " + tuneNode);
   tuneNode.parentNode.removeChild(tuneNode);
}

function updatePrintableDiv() {
   console.log("Abc change detected");
}

function printRendering() {
   document.getElementById("print").innerHTML = document.getElementById("renderingDiv").innerHTML;
   window.print();
   document.getElementById("print").innerHTML = "";
}

function updateAbc() {
   console.log("Updating the ABC text field...");
   let abcInputText = "";
   let index = 1;
   let tuneDiv = document.getElementById("tuneDiv" + index);
   while (tuneDiv !== null) {
      for (const childNode of tuneDiv.childNodes) {
         let tuneTitle = childNode.childNodes[0].innerText;
         let tuneAbc = mapOfSelectedTunes.get(tuneTitle);
         if (tuneAbc) {
            abcInputText = abcInputText.concat(tuneAbc);
         } else {
            displayToast("An error occured while updating the ABC text input field with data for: " + tuneTitle);
         }
      }
      index++;
      tuneDiv = document.getElementById("tuneDiv" + index);
   }
   let abcTextArea = document.getElementById("abcTextArea");
   abcTextArea.value = abcInputText;
   abcTextArea.dispatchEvent(new Event('change'));
   console.log("ABC text field updated");
}