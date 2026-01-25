var incipitIndex;

window.onload = async () => {
   await loadIncipitIndex();
};

async function loadIncipitIndex() {
   console.log("Started: Incipit index retrieval");
   incipitIndex = await fetchJsonFile(INCIPIT_INDEX_URL, "incipitIndex", 28);
   for (item of incipitIndex) {
      let tuneDataOption = createElem(TUNE_DATA_LIST_DIV, null, "option", null, null, null, null);
      tuneDataOption.setAttribute("value", item.file_name);
   }
   console.log("Finished: Incipit index retrieval");
}

/*
requestIncipitIndex()
   .then(response => response.json())
   .then(data => {
      if (data.message === "Not Found") {
         console.log("Incipit index could not be retrieved.");
         return;
      }
      incipitIndex = data;
      for (item of data) {
         let tuneDataOption = createElem(TUNE_DATA_LIST_DIV, null, "option", null, null, null, null);
         tuneDataOption.setAttribute("value", item.file_name);
      }
      console.log("Incipit index retrieved!");
   })

function requestIncipitIndex() {
   console.log("Sending http request to get incipit index...");
   return Promise.resolve(fetch("https://raw.githubusercontent.com/LudovicAL/Shortify/refs/heads/main/incipitIndex.json"));
}
*/

function getTuneData(tuneName) {
   for (item of incipitIndex) {
      if (item.file_name === tuneName) {
         return item;
      }
   }
   return null;
}
