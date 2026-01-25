var incipitIndex;

requestIncipitIndex()
   .then(response => response.json())
   .then(data => {
      if (data.message === "Not Found") {
         console.log("Incipit index could not be retrieved.");
         return;
      }
      incipitIndex = data;
      for (item of data) {
         let tuneDataOption = createElem(tuneDatalistDiv, null, "option", null, null, null, null);
         tuneDataOption.setAttribute("value", item.file_name);
      }
      console.log("Incipit index retrieved!");
   })

function requestIncipitIndex() {
   console.log("Sending http request to get incipit index...");
   return Promise.resolve(fetch("https://raw.githubusercontent.com/LudovicAL/Shortify/refs/heads/main/incipitIndex.json"));
}

function getTuneData(tuneName) {
   for (item of incipitIndex) {
      if (item.file_name === tuneName) {
         return item;
      }
   }
   return null;
}
