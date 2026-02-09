/*
 * When sets or tunes are added to the list, 3 things are updated in the following order:
 *   1. The left panel (with a call to updateLeftPanel())
 *   2. The abc textarea (with a call to updateAbcTextArea())
 *   3. The renderings (with a call to updateRenderings())
 *
 * Changins some of the options may also trigger updates. It always updates the buttons
 * themselves (enabling or disabling some of them), and then updates both the abc textarea
 * and the renderings (with calls to updateAbcTextArea() and updateRenderings() in this order).
*/

var setList = [];

addSet();

function addSet() {
   console.log("Started: Adding set");
   setList.push(new TunesSet());
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
      let setDiv = createElem(SETS_DIV, null, "div", "setDiv" + tunesSet.setId, null, ["container", "p-3", "my-2", "text-bg-secondary", "rounded-3"], null);
      let setHeader = createElem(setDiv, null, "div", null, null, ["my-2", "d-flex"], null);
      let setTitleInputText = createElem(setHeader, null, "input", "Set" + tunesSet.setId + "Title", "text", ["form-control", "w-50", "py-0"], null)
      setTitleInputText.setAttribute("placeholder", "Set title");
      setTitleInputText.value = tunesSet.setName;
      setTitleInputText.disabled = true;
      let setTitleEditButton = createElem(setHeader, null, "button", null, "button", ["btn", "border-0", "p-0", "mx-1"], null);
      let setTitleEditImage = createElem(setTitleEditButton, null, "img", null, null, ["img-fluid", "h-75"], null);
      setTitleEditImage.setAttribute("src", "icons/edit.svg");
      setTitleEditImage.setAttribute("alt", "Éditer");
      setTitleEditButton.onclick = function(){
         editTitle(currentTunesSet, setTitleInputText, setTitleEditImage);
      };
      let setHeaderButtonDiv = createElem(setHeader, null, "div", null, null, ["w-50", "d-flex", "justify-content-end"], null);
      let buttonMoveSetDown = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-success", "btn-sm", "mx-1"], "↓");
      buttonMoveSetDown.onclick = function(){
         moveSetDown(currentTunesSet);
      };
      let buttonMoveSetUp = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-success", "btn-sm", "mx-1"], "↑");
      buttonMoveSetUp.onclick = function(){
         moveSetUp(currentTunesSet);
      };
      let buttonRemoveSet = createElem(setHeaderButtonDiv, null, "button", null, "button", ["btn", "btn-danger", "btn-sm", "mx-1"], "Supprimer la collection");
      buttonRemoveSet.onclick = function(){
         removeSet(currentTunesSet);
      };
      let tunesDiv = createElem(setDiv, null, "div", "tunesDivOfSetDiv" + tunesSet.setId, ["container", "my-2"], null, null);
      let modalDiv = createElem(setDiv, null, "div", "modalDivOfSetDiv" + tunesSet.setId, null, ["modal"], null);
      let modalDialogDiv = createElem(modalDiv, null, "div", null, null, ["modal-dialog"], null);
      let modalContentDiv = createElem(modalDialogDiv, null, "div", null, null, ["modal-content"], null);
      let modalHeaderDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-header"], null);
      createElem(modalHeaderDiv, null, "h4", null, null, ["modal-title", "text-black"], "Chercher une pièce");
      let modalBodyDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-body"], null);
      let modalTuneSearchBar = createElem(modalBodyDiv, null, "input", null, null, ["form-control"], null);
      modalTuneSearchBar.setAttribute("list", TUNE_DATA_LIST_DIV.id);
      modalTuneSearchBar.setAttribute("placeholder", "Écrivez un titre ici...");
      let modalFooterDiv = createElem(modalContentDiv, null, "div", null, null, ["modal-footer"], null);
      let modalFooterButton = createElem(modalFooterDiv, null, "button", null, "button", ["btn", "btn-success"], "Ajouter la pièce");
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
      let addTuneToSetButton = createElem(setDiv, null, "button", null, "button", ["btn", "btn-primary", "my-2"], "Ajouter une pièce")
      addTuneToSetButton.setAttribute("data-bs-toggle", "modal");
      addTuneToSetButton.setAttribute("data-bs-target", "#" + modalDiv.id);
      for (tune of tunesSet.tuneList) {
         let currentTune = tune;
         let newTuneDivNode = createElem(tunesDiv, null, "div", null, null, ["p-2", "my-1", "text-bg-warning", "rounded-3"], null);
         let tuneTitleArray = currentTune.tuneName.split(";");
         let newTuneTitleNode = createElem(newTuneDivNode, null, "div", null, ["fw-bold"], null, tuneTitleArray[0]);
         for (let i = 1, max = tuneTitleArray.length; i < max; i++) {
            createElem(newTuneDivNode, null, "div", null, null, null, tuneTitleArray[i]);
         }
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

function editTitle(tunesSet, setTitleInputText, setTitleEditImage) {
   console.log("Started: Editing title");
   if (setTitleInputText.disabled) {
      setTitleInputText.disabled = false;
      setTitleInputText.focus();
      setTitleEditImage.setAttribute("src", "icons/save.svg");
      setTitleEditImage.setAttribute("alt", "Sauvegarder");
   } else {
      setTitleInputText.disabled = true;
      tunesSet.setName = setTitleInputText.value;
      setTitleEditImage.setAttribute("src", "icons/edit.svg");
      setTitleEditImage.setAttribute("alt", "Éditer");
      updateAbcTextArea();
   }
   console.log("Finished: Editing title");
}

function updateAbcTextArea() {
   console.log("Started: ABC text area update");
   //Delete obsolete content
   while (ABC_DIV.firstChild) {
      ABC_DIV.firstChild.remove();
   }
   //Insert new abc text areas
   for (tunesSet of setList) {
      let index = 1;
      let abcInputText = "";
      let abcDiv = createElem(ABC_DIV, null, "div", null, null, ["my-1"], null);
      createElem(abcDiv, null, "div", null, null, ["fw-bold"], tunesSet.setName)
      let abcTextArea = createElem(abcDiv, null, "textarea", null, null, ["form-control"], null);
      abcTextArea.addEventListener('input', updateWarnings);
      for (let i = 0, max = tunesSet.tuneList.length; i < max; i++) {
         let tuneData = getTuneData(tunesSet.tuneList[i].tuneName);
         if (tuneData) {
            abcInputText += "X:" + (index++) + "\n";
            abcInputText += SWITCH_RENDER_TUNE_NAMES.checked ? "R:" + tuneData.file_name.split(";")[0] + "\n" : "";
            abcInputText += SWITCH_RENDER_TUNE_ENDINGS.checked && SWITCH_RENDER_BEGIN_END.checked ? "R:(Begin)\n" : "";
            abcInputText += SWITCH_RENDER_TIME_SIGNATURES.checked ? "M:" + tuneData.time_signature + "\n" : "";
            abcInputText += "L:" + tuneData.default_note_length + "\n";
            abcInputText += SWITCH_RENDER_KEY_SIGNATURES.checked ? "K:" + tuneData.key + "\n" : "";
            abcInputText += SWITCH_RENDER_KEYS.checked ? "" : "[K:clef=none] ";
            abcInputText += tuneData.bar1;
            if (RADIO_BAR_BEGIN_2.checked) {
               abcInputText += tuneData.bar2;
            }
            if (SWITCH_RENDER_TUNE_ENDINGS.checked) {
               abcInputText += "\n\n";
               abcInputText += "X:" + (index++) + "\n";
               abcInputText += SWITCH_RENDER_TUNE_ENDINGS.checked && SWITCH_RENDER_BEGIN_END.checked ? "R:(End)\n" : "";
               abcInputText += SWITCH_RENDER_TIME_SIGNATURES.checked && SWITCH_RENDER_TIME_SIGNATURE_END.checked ? "M:" + tuneData.time_signature + "\n" : "";
               abcInputText += "L:" + tuneData.default_note_length + "\n";
               abcInputText += SWITCH_RENDER_KEY_SIGNATURES.checked && SWITCH_RENDER_KEY_SIGNATURE_END.checked ? "K:" + tuneData.key + "\n" : "";
               abcInputText += SWITCH_RENDER_KEYS.checked && SWITCH_RENDER_KEY_END.checked ? "" : "[K:clef=none] ";
               if(RADIO_BAR_END_2.checked) {
                  abcInputText += tuneData.barNminus1;
               }
               abcInputText += tuneData.barN;
            }
            if (i < (max - 1)) {
               abcInputText += "\n\n";
            }
         } else {
            displayToast("Une erreur est survenue qui empêche de générer la notation ABC pour la pièce: " + tunesSet.tuneList[i].tuneName);
         }
      }
      abcTextArea.value = abcInputText;
      abcTextArea.rows = Math.max(abcInputText.split(/\r\n|\r|\n/).length, 2).toString();
   }
   console.log("Finished: ABC text area update");
   updateWarnings();
}

function updateWarnings() {
   console.log("Started: Warnings update");
   //Delete obsolete content
   while (WARNINGS_DIV.firstChild) {
      WARNINGS_DIV.firstChild.remove();
   }
   //Insert new warnings
   let hasWarnings = false;
   for (abcTabChild of ABC_DIV.children) {
      let abcTextArea = abcTabChild.getElementsByTagName("textarea");
      if (abcTextArea[0].value) {
         let parsedTunebook = ABCJS.parseOnly(abcTextArea[0].value);
         for (let i = 0, max = parsedTunebook.length; i < max; i++) {
            if (parsedTunebook[i].hasOwnProperty("warnings")) {
               hasWarnings = true;
               let tuneWarningDiv = createElem(WARNINGS_DIV, null, "div", null, null, ["border", "my-2", "fw-bold"], null);
               tuneWarningDiv.innerText = abcTabChild.children[0].innerText + ", Tune " + (i + 1) + ", Warning(s):";
               for (warning of parsedTunebook[i].warnings) {
                  let warningDivElem = createElem(tuneWarningDiv, null, "div", null, null, ["ps-3", "fw-light", "text-danger"], null);
                  warningDivElem.innerHTML = warning;
               }
            }
         }
      }
   }
   if (!hasWarnings) {
      let noWarningDiv = createElem(WARNINGS_DIV, null, "div", null, null, ["my-2", "fw-bold"], null);
      noWarningDiv.innerText = "Aucune erreur";
   }
   console.log("Finished: Warnings update");
   updateRenderings();
}

function updateRenderings() {
   console.log("Started: ABC render update");
   //Delete obsolete content
   while (RENDERING_DIV.firstChild) {
      RENDERING_DIV.firstChild.remove();
   }
   //Insert new renderings
   for (let i = 0, maxI = ABC_DIV.children.length; i < maxI; i++) {
      let abcTextArea = ABC_DIV.children[i].getElementsByTagName("textarea");
      if (abcTextArea[0].value) {
         let tuneRenderDiv = createElem(RENDERING_DIV, null, "div", null, null, SWITCH_BORDER_SETS.checked ? ["border", "border-black", "my-2", "px-1"] : null, null);
         if (SWITCH_RENDER_SET_NAMES.checked) {
            createElem(tuneRenderDiv, null, "div", null, null, ["fw-bold"], ABC_DIV.children[i].children[0].innerText);
         }
         let tuneBook = new ABCJS.TuneBook(abcTextArea[0].value);
         let renderElemIdArray = [];
         for (let j = 0, maxJ = tuneBook.tunes.length; j < maxJ; j++) {
            let renderElemId = "renderForSet" + i + "Tune" + j;
            createElem(tuneRenderDiv, null, "div", renderElemId, null, SWITCH_BORDER_TUNES.checked ? ["border", "border-black", "m-1", "px-1"] : null, null);
            renderElemIdArray.push(renderElemId);
         }
         let renderOptions = { paddingleft: 0, paddingbottom: 5, paddingright: 0, paddingtop: 5, responsive: "resize", warnings_id: WARNINGS_DIV.id };
         ABCJS.renderAbc(renderElemIdArray, abcTextArea[0].value, renderOptions);
      }
   }
   console.log("Finished: ABC render update");
}

function printRendering() {
   console.log("Started: Printing");
   PRINT_DIV.innerHTML = RENDERING_DIV.innerHTML;
   window.print();
   PRINT_DIV.innerHTML = "";
   console.log("Finished: Printing");
}

function updateButtonsAndAbcTextArea() {
   SWITCH_RENDER_KEY_END.disabled = !SWITCH_RENDER_TUNE_ENDINGS.checked || !SWITCH_RENDER_KEYS.checked;
   SWITCH_RENDER_KEY_SIGNATURE_END.disabled = !SWITCH_RENDER_TUNE_ENDINGS.checked || !SWITCH_RENDER_KEY_SIGNATURES.checked;
   SWITCH_RENDER_TIME_SIGNATURE_END.disabled = !SWITCH_RENDER_TUNE_ENDINGS.checked || !SWITCH_RENDER_TIME_SIGNATURES.checked;
   SWITCH_RENDER_BEGIN_END.disabled = !SWITCH_RENDER_TUNE_ENDINGS.checked;
   RADIO_BAR_END_1.disabled = !SWITCH_RENDER_TUNE_ENDINGS.checked;
   RADIO_BAR_END_2.disabled = !SWITCH_RENDER_TUNE_ENDINGS.checked;
   if (SWITCH_RENDER_TUNE_ENDINGS.checked) {
      RADIO_BAR_END_2_LABEL.classList.remove("text-secondary");
   } else {
      RADIO_BAR_END_2_LABEL.classList.add("text-secondary");
   }
   updateAbcTextArea();
}

SWITCH_RENDER_SET_NAMES.addEventListener('change', updateRenderings);
SWITCH_RENDER_TUNE_NAMES.addEventListener('change', updateAbcTextArea);
SWITCH_BORDER_SETS.addEventListener('change', updateRenderings);
SWITCH_BORDER_TUNES.addEventListener('change', updateRenderings);
//SWITCH_ALIGN_TUNES_IN_COLLECTION.addEventListener('change', updateAbcTextArea);
SWITCH_RENDER_TUNE_ENDINGS.addEventListener('change', updateButtonsAndAbcTextArea);
SWITCH_RENDER_KEYS.addEventListener('change', updateButtonsAndAbcTextArea);
SWITCH_RENDER_KEY_END.addEventListener('change', updateAbcTextArea);
SWITCH_RENDER_KEY_SIGNATURES.addEventListener('change', updateButtonsAndAbcTextArea);
SWITCH_RENDER_KEY_SIGNATURE_END.addEventListener('change', updateAbcTextArea);
SWITCH_RENDER_TIME_SIGNATURES.addEventListener('change', updateButtonsAndAbcTextArea);
SWITCH_RENDER_TIME_SIGNATURE_END.addEventListener('change', updateAbcTextArea);
SWITCH_RENDER_BEGIN_END.addEventListener('change', updateAbcTextArea);
RADIO_BAR_BEGIN_1.addEventListener('change', updateAbcTextArea);
RADIO_BAR_BEGIN_2.addEventListener('change', updateAbcTextArea);
RADIO_BAR_END_1.addEventListener('change', updateAbcTextArea);
RADIO_BAR_END_2.addEventListener('change', updateAbcTextArea);
