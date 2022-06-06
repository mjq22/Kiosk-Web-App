const mySecret = "ed6456550d39b40a428625ef38aa85865200abd222b09bd07f73f5e6b75bf95d4e3f5d3951c1a97625a2cb94e8c9b0e8ad7e1ab68a5ea865ec3cc91090cb6564";
const dittoID = "cvs";

const signature = getSignature(dittoID, mySecret);
new DittoModule(signature);

// Ditto Signature
function getSignature(message, secret) {
  const unixTime = (new Date().getTime() / 1000) | 0;
  const stampedMessage = message + "." + unixTime;
  const shaObj = new jsSHA("SHA-512", "TEXT");
  shaObj.setHMACKey(secret, "HEX");
  shaObj.update(stampedMessage);
  const hash = shaObj.getHMAC("B64");
  const hashWebsafe = hash
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const signature = stampedMessage + "." + hashWebsafe;
  return signature;
}

/* DittoCreation Constructor */
function DittoModule(signature = "") {
  var obj = this;

  this.dittoOpts = {
    // serverNetloc: "https://vto-sandbox.partners.api.ditto.com",
    serverNetloc: "https://vto.partners.api.ditto.com",
    selector: "#create",
    // accessKeyId: "710187a465781671",
    accessKeyId: "fa5d9bbf62a4c458",
    clientSignature: signature,
    sku: "788678073815",
    // partnerId: "demo",
    partnerId: "cvs",
    disableScale: true,
    forceScale: false,
    enableClose: false,
    enableFaceAnalysis: true
  };

  this.dittoCallbacks = {
    success: response => {
      console.log("success", response);
      obj.dittoDestroy();
      jQuery("#create").hide(10);
      jQuery("#ditto").show(10);

      var storageKey = "ditto";
      var itemObj = JSON.stringify({
        dittoId: response.dittoId,
        dittoSign: response.signature
      });

      localStorage.setItem(storageKey, itemObj);

      new TryOnModule("#ditto", response.dittoId, response.signature);
    },
    progress: d => console.log(d)
  };

  this.dittoDestroy = function () {
    obj.dittoCreation.destroy();
  };

  this.dittoCreation = new ditto.api.DittoCreation(
    obj.dittoOpts,
    obj.dittoCallbacks
  );
}

// Try On Module
function TryOnModule(selector = "", dittoId = "", dittoSignature = "") {
  var obj = this;

  this.tryOnOpts = {
    // serverNetloc: "https://vto-sandbox.partners.api.ditto.com",
    serverNetloc: "https://vto.partners.api.ditto.com",
    selector: selector,
    dittoId: dittoId,
    sku: "788678073815",
    signature: dittoSignature,
    // accessKeyId: "710187a465781671",
    accessKeyId: "fa5d9bbf62a4c458",
    disablePreview: false
  };

  this.tryOnCallbacks = {
    initialized: () => {
      console.log("View:", "initialized");
    },
    success: response => {
      console.log("success", response);
      frontalView(dittoId, dittoSignature);
    }
  };

  this.tryOnDestroy = function () {
    obj.tryOn.destroy();
  };

  this.tryOn = new ditto.api.TryOn(obj.tryOnOpts, obj.tryOnCallbacks);
}

// Get Frontal View
function frontalView(dittoId, dittoSignature) {
  var xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      // jQuery('.ditto-holder').append(this.responseText);
      console.log("Frontal View:", this.responseText);
      
    }
  });

  xhr.open(
    "GET",
    "https://vto.partners.api.ditto.com/api/1.3/dittos/" +
    dittoId +
    "/frontal-frame/?product_id=788678073815"
  );
  xhr.setRequestHeader("X-Ditto-Access-Key-Id", "fa5d9bbf62a4c458");
  xhr.setRequestHeader("X-Ditto-Signature", dittoSignature);
  xhr.send();
}