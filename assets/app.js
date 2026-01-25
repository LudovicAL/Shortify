var setList = [];
var setCounter = 1;
var tuneCounter = 1;
ABC_TEXT_AREA.addEventListener('input', updateAbcRender);

addSet();

function addSet() {
   console.log("Started: Adding set");
   let setName = "Set " + setCounter;
   setList.push(new TunesSet(setName));
   setCounter++;
   console.log("Finished: Adding set");
   updateLeftPanel();
}

function removeSet(tunesSet) {
   console.log("Started: Removing set");
   let index = setList.indexOf(tunesSet);
   if (index > -1) {
      setList.splice(index, 1);
      console.log("Finished: Removing set");
      updateLeftPanel();
   } else {
      console.log("Finished: Removing set");
   }
}

function moveSetUp(tunesSet) {
   console.log("Started: Moving set up");
   let index = setList.indexOf(tunesSet);
   if (index > 0) {
      setList.splice(index, 1);
      setList.splice(index - 1, 0, tunesSet);
      console.log("Finished: Moving set up");
      updateLeftPanel();
   } else {
      console.log("Finished: Moving set up");
   }
}

function moveSetDown(tunesSet) {
   console.log("Started: Moving set down");
   let index = setList.indexOf(tunesSet);
   if (index > -1 && index < setList.length - 1) {
      setList.splice(index, 1);
      setList.splice(index + 1, 0, tunesSet);
      console.log("Finished: Moving set down");
      updateLeftPanel();
   } else {
      console.log("Finished: Moving set down");
   }
}

function updateLeftPanel() {
   console.log("Started: Left panel update");
   while (SETS_DIV.firstChild) {
      SETS_DIV.firstChild.remove();
   }
   for (tunesSet of setList) {
      let currentTunesSet = tunesSet;
      let setDiv = createElem(SETS_DIV, null, "div", "setDiv" + setCounter, null, ["container", "p-3", "my-2", "text-bg-secondary", "rounded-3"], null);
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
      modalTuneSearchBar.setAttribute("list", TUNE_DATA_LIST_DIV.id);
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
         let currentTune = tune;
         let newTuneDivNode = createElem(tunesDiv, null, "div", null, null, ["container", "p-4", "my-2", "text-bg-warning", "rounded-3"], null);
         let newTuneTitleNode = createElem(newTuneDivNode, null, "h4", null, null, null, currentTune.tuneName);
         let newTuneCloseButton = createElem(newTuneTitleNode, null, "button", null, "button", ["btn", "btn-close", "btn-sm", "float-end"], null);
         newTuneCloseButton.onclick = function(){
            currentTunesSet.removeTune(currentTune);
            updateLeftPanel();
         };
      }
   }
   console.log("Finished: Left panel update");
   updateAbcTextArea();
}

function updateAbcTextArea() {
   console.log("Started: ABC text area update");
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
   ABC_TEXT_AREA.value = abcInputText;
   console.log("Finished: ABC text area update");
   ABC_TEXT_AREA.dispatchEvent(new Event('input'));
}

function updateAbcRender() {
   console.log("Started: ABC render update");
   //Delete obsolete content
   while (WARNINGS_DIV.firstChild) {
      WARNINGS_DIV.firstChild.remove();
   }
   while (RENDERING_DIV.firstChild) {
      RENDERING_DIV.firstChild.remove();
   }
   //Check if the ABC contains errors
   let parsedTunebook = ABCJS.parseOnly(ABC_TEXT_AREA.value);
   let hasWarnings = false;
   for (let i = 0, max = parsedTunebook.length; i < max; i++) {
      if (parsedTunebook[i].hasOwnProperty("warnings")) {
         hasWarnings = true;
         let tuneWarningDiv = createElem(WARNINGS_DIV, null, "div", null, null, ["border", "my-2", "fw-bold"], null);
         tuneWarningDiv.innerText = "Tune #" + (i + 1) + " warning(s):";
         for (warning of parsedTunebook[i].warnings) {
            let warningDivElem = createElem(tuneWarningDiv, null, "div", null, null, ["ps-3", "fw-light", "text-danger"], null);
            warningDivElem.innerHTML = warning;
         }
      }
   }
   if (!hasWarnings) {
      let noWarningDiv = createElem(WARNINGS_DIV, null, "div", null, null, ["my-2", "fw-bold"], null);
      noWarningDiv.innerText = "No error";
   }
   //Render the ABC
   let tuneBook = new ABCJS.TuneBook(ABC_TEXT_AREA.value);
   let renderElemIdArray = [];
   for (let i = 0, max = tuneBook.tunes.length; i < max; i++) {
      let renderElemId = "renderElem" + i;
      createElem(RENDERING_DIV, null, "div", renderElemId, null, null);
      renderElemIdArray.push(renderElemId);
   }
   let renderOptions = { paddingleft: 0, paddingbottom: 5, paddingright: 0, paddingtop: 5, responsive: "resize", warnings_id: WARNINGS_DIV.id };
   let renderResult = ABCJS.renderAbc(renderElemIdArray, ABC_TEXT_AREA.value, renderOptions);
   console.log("Finished: ABC render update");
}

function printRendering() {
   console.log("Started: Printing");
   PRINT_DIV.innerHTML = RENDERING_DIV.innerHTML;
   window.print();
   PRINT_DIV.innerHTML = "";
   console.log("Finished: Printing");
}
