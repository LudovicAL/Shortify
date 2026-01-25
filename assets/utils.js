var tuneId = 0;

class Tune {
   constructor(tuneName) {
      this.tuneId = tuneId++;
      this.tuneName = tuneName;
   }
}

class TunesSet {
   constructor(setName) {
      this.setName = setName;
      this.tuneList = [];
   }
  
   addTune(tuneName) {
      if (!tuneName) {
         displayToast("No tune selected");         
         return;
      }
      let tuneData = getTuneData(tuneName);
      if (!tuneData) {
         displayToast("The database contains no tune named: " + tuneName);
         return;
      }
      this.tuneList.push(new Tune(tuneName));
   }

   removeTune(tune) {
      let index = this.tunelist.indexOf(tune);
      if (index > -1) {
         this.tunelist.splice(index, 1);
      }
   }
}


function getNodeIndex(node) {
    var index = 0;
    while (node = node.previousSibling) {
        if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
            index++;
        }
    }
    return index;
}

function displayToast(message) {
   console.log("Displaying toast: " + message);
   let toastDiv = document.getElementById('toastDiv');
   let toast = createElem(toastDiv, null, "div", "myId", null, ["toast"], null);
   toast.setAttribute("role", "alert");
   toast.setAttribute("aria-live", "assertive");
   toast.setAttribute("aria-atomic", "true");
   let toastHeader = createElem(toast, null, "div", null, null, ["toast-header", "text-bg-warning"], null);
   createElem(toastHeader, null, "strong", null, null, ["me-auto"], "Tune picker");
   createElem(toastHeader, null, "small", null, null, ["text-muted"], "Error");
   let toastButton = createElem(toastHeader, null, "button", null, "button", ["btn-close"], null);
   toastButton.setAttribute("data-bs-dismiss", "toast");
   toastButton.setAttribute("aria-label", "Close");
   let toastBody = createElem(toast, null, "div", null, null, ["toast-body"], message);
   (new bootstrap.Toast(toast)).show();
}

function tuneExists(tuneName) {
   for (const childNode of TUNE_DATA_LIST_DIV.childNodes) {
      if (childNode.value === tuneName) {
         return true;
      }
   }
   return false;
}

function capitalize(content) {
   if (!content) {
      return "";
   }
   return content.charAt(0).toUpperCase() + content.slice(1);
}

function createElem(elemParent, elemParentNextElem, elemRoot, elemId, elemType, elemClasses, elemText) {
   const elem = document.createElement(elemRoot);
   if (elemId != null) {
      elem.setAttribute("id", elemId);
   }
   if (elemType != null) {
      elem.setAttribute("type", elemType);
   }
   if (elemClasses != null) {
      for (let i = 0; i < elemClasses.length; i++) {
         elem.classList.add(elemClasses[i]);
      }
   }
   if (elemText != null) {
      elem.appendChild(document.createTextNode(elemText));
   }
   if (elemParentNextElem == null) {
      elemParent.appendChild(elem);
   } else {
      elemParent.insertBefore(elem, elemParentNextElem);
   }
   return elem;
}

function convertTextToUrl(content) {
   return content.replace(" ", "%20").replace(" | ", "%3B").replace(";", "%3B").replace("#", "%23");
}

/**
 * Fetches a JSON file.
 * If the JSON file is already in the cache and is not too old, it is retrived from there.
 * Otherwise it is retrieved from the server.
 *
 * @param {String} url The URL from which to retrieve the data.
 * @param {String} storeName The key for the data in the cache.
 * @param {int} storeLifeSpanInDays The life expectancy of the data, in days.
 * @return The fetched JSON file.
 */
async function fetchJsonFile(url, storeName, storeLifeSpanInDays) {
   jsonFile = await window.idbKV.get(storeName);
   if (typeof jsonFile === 'undefined') {
      console.log("   No file named " + storeName + " was cached, requesting download");
      jsonFile = await fetch(url).then((response) => response.json());
      await window.idbKV.set(storeName, jsonFile);
      await window.idbKV.set(storeName + "Date", new Date());
   } else {
      console.log("   Found cached file named " + storeName);
      let fileCacheDate = await window.idbKV.get(storeName + "Date");
      if (typeof fileCacheDate === 'undefined' || ((Date.now() - fileCacheDate) >= (storeLifeSpanInDays * MILLISECONDS_PER_DAY))) {
         console.log("   Cached " + storeName + " date is undefined or too old. The file will be renewed.");
         jsonFile = await fetch(url).then((response) => response.json());
         await window.idbKV.set(storeName, jsonFile);
         await window.idbKV.set(storeName + "Date", new Date());
      } else {
         console.log("   Cached " + storeName + " date is recent enough. No action to take.");
      }
   }
   return jsonFile;
}
