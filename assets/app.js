window.onload = function initEditor() {
   addSet();
}

var setCounter = 1;
var tuneCounter = 1;
var abcTextArea = document.getElementById("abcTextArea");
var renderingDiv = document.getElementById("renderingDiv");
var warningsDiv = document.getElementById("warningsDiv");
abcTextArea.addEventListener('input', onAbcTextAreaChanged);

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
   updateAbc();
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
   updateAbc();
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
   updateAbc();
}

function addTune(setId, tuneName) {
   console.log("Add tune button clicked: " + setId + ", " + tuneName);
   if (tuneExists(tuneName)) {
      let tuneDivNode = document.getElementById("tuneDiv" + setId);
      let newTuneDivNode = createElem(tuneDivNode, null, "div", "tune " + tuneCounter + ", " + tuneName, null, ["container", "p-4", "my-2", "text-bg-warning", "rounded-3", "tune"], null);
      tuneCounter++;
      let newTuneTitleNode = createElem(newTuneDivNode, null, "h4", null, null, null, tuneName);
      let newTuneCloseButton = createElem(newTuneTitleNode, null, "button", null, "button", ["btn", "btn-close", "btn-sm", "float-end"], null);
      newTuneCloseButton.onclick = function(){removeTune(setId, newTuneDivNode);};
      updateAbc();
   } else {
      if (tuneName.length > 0) {
         displayToast("The database contains no tune named: " + tuneName);
      } else {
         displayToast("No tune selected.");
      }
   }
}

function removeTune(setId, tuneNode) {
   console.log("Remove tune button clicked: " + setId + ", " + tuneNode);
   tuneNode.parentNode.removeChild(tuneNode);
   updateAbc();
}

function onAbcTextAreaChanged() {
   console.log("Abc change detected");
   while (warningsDiv.firstChild) {
      warningsDiv.firstChild.remove();
   }
   while (renderingDiv.firstChild) {
      renderingDiv.firstChild.remove();
   }
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

function printRendering() {
   document.getElementById("print").innerHTML = document.getElementById("renderingDiv").innerHTML;
   window.print();
   document.getElementById("print").innerHTML = "";
}

function updateAbc() {
   console.log("Updating the ABC text field...");
   let abcInputText = "";
   let tuneDivs = document.getElementsByClassName("tune");
   let index = 1;
   for (tuneDiv of tuneDivs) {
      for (const childNode of tuneDiv.childNodes) {
         let tuneTitle = childNode.innerText;
         let tuneData = getTuneData(tuneTitle);
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
