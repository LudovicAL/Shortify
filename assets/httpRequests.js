var listOfTunes = [];
var mapOfSelectedTunes = new Map();

requestTitles()
   .then(response => response.json())
   .then(data => {
      if (data.message === "Not Found") {
         console.log("Data not found");
         return;
      }
      console.log("All available titles retrieved!\nProcessing title list...");
      let tuneDatalistDiv = document.getElementById("tuneDatalistDiv")
      for(let i = 0, max = data.tree.length; i < max; i++) {
         let tunePath = data.tree[i].path;
         let indexOfAbc = tunePath.toLowerCase().indexOf(".abc");
         if (indexOfAbc !== -1) {
            let tuneName = tunePath.substring(0, indexOfAbc).replaceAll(";", " | ");
            listOfTunes.push(tuneName);
            let tuneDataOption = createElem(tuneDatalistDiv, null, "option", null, null, null, null);
            tuneDataOption.setAttribute("value", tuneName);
         }
      }
      console.log("Title list processed");
   })

function requestTitles() {
   console.log("Sending http request for all available titles...");
   return Promise.resolve(fetch("https://api.github.com/repos/LudovicAL/PartitionsMuseScore/git/trees/41414f96a611711b558706b72e9c7c6a196cbf49"));
}

function requestAbc(setId, tuneNode, tuneName) {
   console.log("Sending http request for abc for: " + tuneName);
   Promise
      .resolve(fetch("https://raw.githubusercontent.com/LudovicAL/PartitionsMuseScore/refs/heads/main/abc/" + convertTextToUrl(tuneName) + ".abc"))
      .then(rawData => {
         console.log("Tune data retrieved!\nProcessing tune data...");
         if (rawData.status == 200) {
            return rawData.text();
         } else {
            removeTune(setId, tuneNode);
            displayToast("A problem occured when fetching the tune's ABC data.");
         }
      })
      .then(data => {
         mapOfSelectedTunes.set(tuneName, data);
         console.log("Tune data processed");
         updateAbc();
      })
}
