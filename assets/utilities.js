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
   let tuneDatalistDiv = document.getElementById("tuneDatalistDiv");
   for (const childNode of tuneDatalistDiv.childNodes) {
      if (childNode.value === tuneName) {
         return true;
      }
   }
   return false;
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

function extractTunePrefix(abcData) {
   
}
