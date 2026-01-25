window.onload = function initEditor() {
   addSet();
}

var setList = [];
var setCounter = 1;
var tuneCounter = 1;
var abcTextArea = document.getElementById("abcTextArea");
var renderingDiv = document.getElementById("renderingDiv");
var warningsDiv = document.getElementById("warningsDiv");
var setsDiv = document.getElementById("setsDiv");
abcTextArea.addEventListener('input', updateAbcRender);

function addSet() {
   let setName = "Set " + setCounter;
   setList.push(new TunesSet(setName));
   setCounter++;
   updateLeftPanel();
}

function removeSet(tunesSet) {
   let index = setList.indexOf(tunesSet);
   if (index > -1) {
      setList.splice(index, 1);
      updateLeftPanel();
   }  
}

function moveSetUp(tunesSet) {
   let index = setList.indexOf(tunesSet);
   if (index > 0) {
      setList.splice(index, 1);
      setList.splice(index - 1, 0, tunesSet);
      updateLeftPanel();
   }
}

function moveSetDown(tunesSet) {
   let index = setList.indexOf(tunesSet);
   if (index > -1 && index < setList.length - 1) {
      setList.splice(index, 1);
      setList.splice(index + 1, 0, tunesSet);
      updateLeftPanel();
   }
}

function updateLeftPanel() {
   //Remove obsolete sets
   while (setsDiv.firstChild) {
      setsDiv.firstChild.remove();
   }
   for (tunesSet of setList) {
      let currentTunesSet = tunesSet;
      let setDiv = createElem(setsDiv, null, "div", "setDiv" + setCounter, null, ["container", "p-3", "my-2", "text-bg-secondary", "rounded-3"], null);
      let setHeader = createElem(setDiv, null, "div", null, null, ["my-2", "d-flex", "flex-row"], null);
      let setTitle = createElem(setHeader, null, "input", null, "text", ["form-control", "w-50"], null)
      setTitle.setAttribute("placeholder", "Set title");
      setTitle.value = tunesSet.setName;
      let setHeaderButtonDiv = createElem(setHeader, null, "div", null, null, ["w-50"], null);
      let buttonRemoveSet = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-danger", "btn-sm", "mx-1", "float-end"], "Remove set");
      buttonRemoveSet.onclick = function(){removeSet(currentTunesSet)};
      let buttonMoveSetUp = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-success", "btn-sm", "mx-1", "float-end"], "↑");
      buttonMoveSetUp.onclick = function(){moveSetUp(currentTunesSet)};
      let buttonMoveSetDown = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-success", "btn-sm", "mx-1", "float-end"], "↓");
      buttonMoveSetDown.onclick = function(){moveSetDown(currentTunesSet)};
      let tunesDiv = createElem(setDiv, null, "div", "tunesDivOfSetDiv" + setCounter, ["container", "my-2"], null, null);
      let modalDiv = createElem(setDiv, null, "div", "modalDivOfSetDiv" + setCounter, null, ["modal"], null);
      let modalDialogDiv = createElem(modalDiv, null, "div", null, null, ["modal-dialog"], null);
      let modalContentDiv = createElem(modalDialogDiv, null, "div", null, null, ["modal-content"], null);
      let modalHeaderDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-header"], null);
      createElem(modalHeaderDiv, null, "h4", null, null, ["modal-title", "text-black"], "Search for a tune");
      let modalBodyDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-body"], null);
      let modalTuneSearchBar = createElem(modalBodyDiv, null, "input", null, null, ["form-control"], null);
      modalTuneSearchBar.setAttribute("list", "tuneDatalistDiv");
      modalTuneSearchBar.setAttribute("placeholder", "Type here to search...");
      let modalFooterDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-footer"], null);
      let modalFooterButton = createElem(modalFooterDiv, null, "button", null, "button", ["btn", "btn-success"], "Add selected tune");
      modalFooterButton.setAttribute("data-bs-dismiss", "modal");
      modalFooterButton.onclick = function(){
            currentTunesSet.addTune(modalTuneSearchBar.value);
            modalTuneSearchBar.value = "";
            updateLeftPanel();
         };
      let modalHeaderButton = createElem(modalHeaderDiv, null, "button", null, "button", ["btn-close"], null);
      modalHeaderButton.setAttribute("data-bs-dismiss", "modal");
      modalHeaderButton.onclick = function(){
            modalTuneSearchBar.value = "";
         };
      let addTuneToSetButton = createElem(setDiv, null, "button", null, "button", ["btn", "btn-primary", "my-2"], "Add tune to set")
      addTuneToSetButton.setAttribute("data-bs-toggle", "modal");
      addTuneToSetButton.setAttribute("data-bs-target", "#" + modalDiv.id);
      for (tune of tunesSet.tuneList) {
         let newTuneDivNode = createElem(tunesDiv, null, "div", null, null, ["container", "p-4", "my-2", "text-bg-warning", "rounded-3", "tune"], null);
         let newTuneTitleNode = createElem(newTuneDivNode, null, "h4", null, null, null, tune.tuneName);
         let newTuneCloseButton = createElem(newTuneTitleNode, null, "button", null, "button", ["btn", "btn-close", "btn-sm", "float-end"], null);
         newTuneCloseButton.onclick = function(){removeTune(newTuneDivNode);};
      }
   }
   updateAbcTextArea();
}

/*
function addSet() {
   var currentCount = setCounter;
   console.log("Add set button clicked: " + currentCount);
   let setDiv = createElem(setsDiv, null, "div", "setDiv" + currentCount, null, ["container", "p-3", "my-2", "text-bg-secondary", "rounded-3"], null);
   let setHeader = createElem(setDiv, null, "div", null, null, ["my-2", "d-flex", "flex-row"], null);
   let setTitle = createElem(setHeader, null, "input", null, "text", ["form-control", "w-50"], null)
   setTitle.setAttribute("placeholder", "Set title");
   setTitle.value = "Set " + currentCount;
   let setHeaderButtonDiv = createElem(setHeader, null, "div", null, null, ["w-50"], null);
   let buttonRemoveSet = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-danger", "btn-sm", "mx-1", "float-end"], "Remove set");
   buttonRemoveSet.onclick = function(){removeSet(setDiv)};
   let buttonMoveSetUp = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-success", "btn-sm", "mx-1", "float-end"], "↑");
   buttonMoveSetUp.onclick = function(){moveSetUp(setDiv)};
   let buttonMoveSetDown = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-success", "btn-sm", "mx-1", "float-end"], "↓");
   buttonMoveSetDown.onclick = function(){moveSetDown(setDiv)};
   let tunesDiv = createElem(setDiv, null, "div", "tunesDivOfSetDiv" + currentCount, ["container", "my-2"], null, null);
   let modalDiv = createElem(setDiv, null, "div", "modalDivOfSetDiv" + currentCount, null, ["modal"], null);
   let modalDialogDiv = createElem(modalDiv, null, "div", null, null, ["modal-dialog"], null);
   let modalContentDiv = createElem(modalDialogDiv, null, "div", null, null, ["modal-content"], null);
   let modalHeaderDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-header"], null);
   createElem(modalHeaderDiv, null, "h4", null, null, ["modal-title"], "Modal Heading");
   let modalBodyDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-body"], null);
   let modalTuneSearchBar = createElem(modalBodyDiv, null, "input", null, null, ["form-control"], null);
   modalTuneSearchBar.setAttribute("list", "tuneDatalistDiv");
   modalTuneSearchBar.setAttribute("placeholder", "Type to search...");
   let modalFooterDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-footer"], null);
   let modalFooterButton = createElem(modalFooterDiv, null, "button", null, "button", ["btn", "btn-success"], "Add selected tune");
   modalFooterButton.setAttribute("data-bs-dismiss", "modal");
   modalFooterButton.onclick = function(){
         addTune(setDiv, modalTuneSearchBar.value);
         modalTuneSearchBar.value = "";
      };
   let modalHeaderButton = createElem(modalHeaderDiv, null, "button", null, "button", ["btn-close"], null);
   modalHeaderButton.setAttribute("data-bs-dismiss", "modal");
   modalHeaderButton.onclick = function(){
         modalTuneSearchBar.value = "";
      };
   let addTuneToSetButton = createElem(setDiv, null, "button", null, "button", ["btn", "btn-primary", "my-2"], "Add tune to set")
   addTuneToSetButton.setAttribute("data-bs-toggle", "modal");
   addTuneToSetButton.setAttribute("data-bs-target", "#" + modalDiv.id);
   setCounter++;
}

function removeSet(setDiv) {
   console.log("Remove set button clicked");
   setDiv.parentNode.removeChild(setDiv);
   updateAbcTextArea();
}

function moveSetUp(setDiv) {
   console.log("Move set up button clicked");
   let index = getNodeIndex(setDiv);
   if (index > 0) {
      console.log("Moving set up");
      let setNodeOther = setDiv.parentNode.children[index - 1];
      setDiv.parentNode.insertBefore(setDiv, setNodeOther);
      updateAbcTextArea();
   }
}

function moveSetDown(setDiv) {
   console.log("Move set down button clicked");
   let index = getNodeIndex(setDiv);
   if (index < (setsDiv.childElementCount - 1)) {
      console.log("Moving set down");
      let setNodeOther = setDiv.parentNode.children[index + 1];
      setNodeOther.parentNode.insertBefore(setNodeOther, setDiv);
      updateAbcTextArea();
   }
}

function addTune(setDiv, tuneName) {
   console.log("Add tune button clicked: " + tuneName);
   if (tuneExists(tuneName)) {
      let tunesDiv = document.getElementById("tunesDivOf" + capitalize(setDiv.id));
      let newTuneDivNode = createElem(tunesDiv, null, "div", null, null, ["container", "p-4", "my-2", "text-bg-warning", "rounded-3", "tune"], null);
      let newTuneTitleNode = createElem(newTuneDivNode, null, "h4", null, null, null, tuneName);
      let newTuneCloseButton = createElem(newTuneTitleNode, null, "button", null, "button", ["btn", "btn-close", "btn-sm", "float-end"], null);
      newTuneCloseButton.onclick = function(){removeTune(newTuneDivNode);};
      updateAbcTextArea();
   } else {
      if (tuneName.length > 0) {
         displayToast("The database contains no tune named: " + tuneName);
      } else {
         displayToast("No tune selected.");
      }
   }
}

function removeTune(tuneNode) {
   console.log("Remove tune button clicked: " + tuneNode);
   tuneNode.parentNode.removeChild(tuneNode);
   updateAbcTextArea();
}
*/

function updateAbcRender() {
   console.log("Abc change detected");
   //Delete obsolete content
   while (warningsDiv.firstChild) {
      warningsDiv.firstChild.remove();
   }
   while (renderingDiv.firstChild) {
      renderingDiv.firstChild.remove();
   }
   //Check if the ABC contains errors
   let parsedTunebook = ABCJS.parseOnly(abcTextArea.value);
   let hasWarnings = false;
   for (let i = 0, max = parsedTunebook.length; i < max; i++) {
      if (parsedTunebook[i].hasOwnProperty("warnings")) {
         hasWarnings = true;
         let tuneWarningDiv = createElem(warningsDiv, null, "div", null, null, ["border", "my-2", "fw-bold"], null);
         tuneWarningDiv.innerText = "Tune #" + (i + 1) + " warning(s):";
         for (warning of parsedTunebook[i].warnings) {
            let warningDivElem = createElem(tuneWarningDiv, null, "div", null, null, ["ps-3", "fw-light", "text-danger"], null);
            warningDivElem.innerHTML = warning;
         }
      }
   }
   if (!hasWarnings) {
      let noWarningDiv = createElem(warningsDiv, null, "div", null, null, ["my-2", "fw-bold"], null);
      noWarningDiv.innerText = "No error";
   }
   //Render the ABC
   let tuneBook = new ABCJS.TuneBook(abcTextArea.value);
   console.log("Number of tunes: " + tuneBook.tunes.length);
   let renderElemIdArray = [];
   for (let i = 0, max = tuneBook.tunes.length; i < max; i++) {
      let renderElemId = "renderElem" + i;
      createElem(renderingDiv, null, "div", renderElemId, null, null);
      renderElemIdArray.push(renderElemId);
   }
   let renderOptions = { paddingleft: 0, paddingbottom: 5, paddingright: 0, paddingtop: 5, responsive: "resize", warnings_id: "warningsDiv" };
   let renderResult = ABCJS.renderAbc(renderElemIdArray, abcTextArea.value, renderOptions);
}

/*
function printRendering() {
   document.getElementById("print").innerHTML = document.getElementById("renderingDiv").innerHTML;
   window.print();
   document.getElementById("print").innerHTML = "";
}
*/

function updateAbcTextArea() {
   console.log("Updating the ABC text field...");
   let abcInputText = "";
   let index = 1;
   for (tunesSet of setList) {
      for (tune of tunesSet.tuneList) {
         let tuneData = getTuneData(tune.tuneName);
         if (tuneData) {
            abcInputText += (
               "X:" + index + "\n"
               + "R:" + tuneData.file_name + "\n"
               + "M:" + tuneData.time_signature + "\n"
               + "L:" + tuneData.default_note_length + "\n"
               + "K:" + tuneData.key + "\n"
               + tuneData.incipit_start + "\n\n"
            );
         } else {
            displayToast("An error occured while updating the ABC text input field with data for: " + tuneTitle);
         }
         index++;
      }
   }
   abcTextArea.value = abcInputText;
   abcTextArea.dispatchEvent(new Event('input'));
   console.log("ABC text field updated");
}
