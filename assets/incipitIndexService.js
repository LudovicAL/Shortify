var incipitIndex;

window.onload = async () => {
   await loadIncipitIndex();
};

async function loadIncipitIndex() {
   console.log("Started: Incipit index retrieval");
   incipitIndex = await fetchJsonFile(INCIPIT_INDEX_URL, "incipitIndex", 1);
   for (item of incipitIndex) {
      let tuneDataOption = createElem(TUNE_DATA_LIST_DIV, null, "option", null, null, null, null);
      tuneDataOption.setAttribute("value", item.file_name);
   }
   console.log("Finished: Incipit index retrieval");
}

function getTuneData(tuneName) {
   for (item of incipitIndex) {
      if (item.file_name === tuneName) {
         return item;
      }
   }
   return null;
}
