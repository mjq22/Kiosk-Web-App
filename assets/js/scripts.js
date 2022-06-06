function pageUp() {
  localStorage.clear();
  jQuery("#wrapper").css({
    opacity: "0",
    top: "6%"
  });
  setTimeout(function () {
    window.location.href = "index.html"
  }, 500);
}

jQuery(window).on("load", function () {

  jQuery("body").addClass('loaded');
  setTimeout(function () {
    jQuery("#wrapper").css({
      opacity: "1",
      top: "0"
    });
  }, 200);

  setTimeout(function () {
    jQuery("body").css({
      overflow: "auto"
    });
  }, 900);

});

// Disable Right Click
document.addEventListener('contextmenu', event => event.preventDefault());

jQuery(document).ready(function () {

  // Keyboard
  var formElem = jQuery('input[type="text"], input[type="password"], textarea');
  if (formElem.length) {
    formElem.keyboard({
      noFocus: true,
      layout: 'custom',
      customLayout: {
        'normal': [
          '{accept} {cancel}',
          '1 2 3 4 5 6 7 8 9 0 {b}',
          'q w e r t y u i o p -',
          'a s d f g h j k l _',
          'z x c v b n m . @',
          '{s} {space} {s}'
        ],
        'shift': [
          '{accept} {cancel}',
          '~ ! # $ % & ^ * + = {b}',
          'Q W E R T Y U I O P -',
          'A S D F G H J K L _',
          'Z X C V B N M . @',
          '{s} {space} {s}'
        ]
      },
      visible: function () {
        jQuery('body').addClass('keyboard-loaded');
      },
      hidden: function () {
        jQuery('body').removeClass('keyboard-loaded');
      },
    });
  }

  // Counter
  var countInterval;
  var countdownNumberEl = document.getElementById('countdown-number');

  function startCounter() {
    var countdown = 30;
    if (jQuery(countdownNumberEl).length) {
      countdownNumberEl.textContent = countdown;
      countInterval = setInterval(function () {
        countdown = --countdown < 0 ? 30 : countdown;
        countdownNumberEl.textContent = countdown;

        if (countdown == 0) {
          pageUp();
        }
      }, 1000);
    }
  }
  startCounter();

  // Inactivity
  function activityWatcher() {
    clearInterval(countInterval);

    var secondsSinceLastActivity = 0;
    var maxInactivity = (60 * 1);

    var interval = setInterval(function () {
      secondsSinceLastActivity++;
      // console.log(secondsSinceLastActivity + ' seconds since the user was last active');

      if (secondsSinceLastActivity >= maxInactivity) {
        // console.log('User has been inactive for more than ' + maxInactivity + ' seconds');

        clearInterval(interval);
        if (jQuery('#popup-timer').length) {
          jQuery('#popup-timer').fadeIn(500, function () {
            startCounter();
          });
        }
      }
    }, 1000);

    function activity() {
      secondsSinceLastActivity = 0;
    }

    var activityEvents = [
      'mousedown', 'mousemove', 'keydown',
      'scroll', 'touchstart'
    ];

    activityEvents.forEach(function (eventName) {
      document.addEventListener(eventName, activity, true);
    });

  }
  if (jQuery('#popup-timer').length) {
    activityWatcher();
  }

  if (jQuery(".prod-slider").length) {
    var prodSlider = jQuery(".prod-slider");
    prodSlider.owlCarousel({
      loop: false,
      margin: 0,
      nav: false,
      items: 3,
      dotsEach: true,
      onInitialized: callback
    });

    function callback(event) {
      var currSlider = jQuery(event.currentTarget);
      if (currSlider.parent("#frame").length) {
        currSlider.addClass("owl-hidden");
      }
    }
  }

  // Tabs
  jQuery("ul.tab-list").on("click", "a", function (e) {
    e.preventDefault();
    var _this = jQuery(this);
    var _parent = _this.parent("li");

    var tabRef = _this.attr("href");
    var isActive = _parent.hasClass("active");

    var tabList = jQuery("ul.tab-list").find("li");
    var tabContent = jQuery(".tab-content");
    var tabs = tabContent.find(".tab");

    var currActive = jQuery("ul.tab-list")
      .find(".active a")
      .attr("href");
    var dotPos = [];

    if (jQuery(".prod-slider").length) {
      jQuery(currActive)
        .find(".prod-slider")
        .each(function (i) {
          var _this = jQuery(this);
          var key = "slider" + i;
          dotPos[key] = _this.find(".owl-dots .active").index();
        });
    }

    if (!isActive) {
      tabs.hide();
      tabList.removeClass("active");
      _parent.addClass("active");

      if (jQuery(".prod-slider").length) {
        // prodSlider.trigger("refresh.owl.carousel");
        jQuery(tabRef)
          .find(".prod-slider")
          .each(function (i, k) {
            var _this = jQuery(this);
            var key = "slider" + i;
            _this.trigger("to.owl.carousel", [dotPos[key], 300]);
          });
      }

      jQuery(tabRef).show();
    }
  });

  // Popup Zoom
  jQuery("body .prod-list").on("click", ".img-holder", function (e) {
    e.preventDefault();
    var _this = jQuery(this);
    var _parent = _this.parents(".item-holder");
    var popup = jQuery("#popup-prod");
    var itemId = _parent.attr("data-id");
    var itemType = _parent.attr("data-type");
    var isFav = _parent.find(".title-box").hasClass("is-fav");
    var imgTryOn = "";
    var imgFrames = "";

    if (itemType == "tryon") {
      var imgTryOn = _parent.find(".img-holder > img").attr("src");
      var imgFrames = jQuery("body #frame")
        .find('div[data-id="' + itemId + '"]')
        .find(".img-holder > img")
        .attr("src");
    }

    if (itemType == "frame") {
      var imgFrames = _parent.find(".img-holder > img").attr("src");
      var imgTryOn = jQuery("body #try")
        .find('div[data-id="' + itemId + '"]')
        .find(".img-holder > img")
        .attr("src");
    }

    if (isFav) {
      popup.find(".title-box").addClass("is-fav");
    } else {
      popup.find(".title-box").removeClass("is-fav");
    }
    popup.find(".content-holder").attr("data-id", itemId);

    popup
      .find(".content-holder .img-holder")
      .append(
        '<img class="grid-img" style="display:none;" src="' +
        imgTryOn +
        '" alt="">'
      );
    popup
      .find(".content-holder .frame-holder")
      .append(
        '<img class="grid-img" style="display:none;" src="' +
        imgFrames +
        '" alt="">'
      );

    popup.fadeIn(500, function () {
      _parent.addClass("popup-active");

      var dittoInfo = JSON.parse(localStorage.getItem("ditto"));
      if (dittoInfo) {
        new TryOnModule("#pop-tryon", dittoInfo.dittoId, dittoInfo.dittoSign);
      }
    });
  });

  // Popup More Frames 
  jQuery("body").on("click", ".more-frames", function (e) {
    e.preventDefault();
    var _this = jQuery(this);
    var popup = jQuery("#popup-more");
    popup.fadeIn(500);
  });

  // Popup Filters
  jQuery("body").on("click", ".btn-filter", function (e) {
    e.preventDefault();
    var _this = jQuery(this);
    var popup = jQuery("#popup-filters");
    popup.fadeIn(500);
  });

  // Popup Close
  jQuery("body").on("click", ".popup-close, .popup .overlay, .btn-cancel", function (e) {
    e.preventDefault();
    var _this = jQuery(this);
    var _parent = _this.parents(".popup");

    if (_parent.attr('id') == 'popup-timer') {
      clearInterval(countInterval);
      activityWatcher();
    }

    _parent.fadeOut(500, function () {
      var dittoInfo = JSON.parse(localStorage.getItem("ditto"));
      if (dittoInfo && jQuery('#pop-tryon').length) {
        new TryOnModule(
          "#pop-tryon",
          dittoInfo.dittoId,
          dittoInfo.dittoSign
        ).tryOnDestroy();
      }
    });
  });

  // Favorites
  checkFavItem();
  jQuery("body").on("click", ".fav", function (e) {
    e.preventDefault();
    var _this = jQuery(this);
    var titleBox = _this.parent(".title-box");
    var _parent = titleBox.parent("div");
    var isFav = titleBox.hasClass("is-fav");
    var itemType = _parent.attr("data-type");
    var title = _this.find(".title").text();
    var itemId = _parent.attr("data-id");
    var imgTryOn = "";
    var imgFrames = "";
    var isPopup = _parent.hasClass("content-holder");
    var limitPopup = jQuery("#popup-fav-limit");
    var favDelPopup = jQuery("#popup-fav-del");

    if (isPopup) {
      var imgTryOn = _parent.find(".img-holder > .grid-img").attr("src");
      var imgFrames = _parent.find(".frame-holder > .grid-img").attr("src");

      if (jQuery('body').hasClass('favorites')) {

        favDelPopup.fadeIn(500);
        favDelPopup.find('.btn-remove').attr('data-id', itemId);
        return;
      }
    } else {
      if (itemType == "tryon") {
        var imgTryOn = _parent.find(".img-holder > img").attr("src");
        var imgFrames = jQuery("#frame")
          .find('div[data-id="' + itemId + '"]')
          .find(".img-holder > img")
          .attr("src");
      }

      if (itemType == "frame") {
        var imgFrames = _parent.find(".img-holder > img").attr("src");
        var imgTryOn = jQuery("#try")
          .find('div[data-id="' + itemId + '"]')
          .find(".img-holder > img")
          .attr("src");
      }
    }

    var storageKey = "fav";

    if (!isFav) {
      var oldItems = JSON.parse(localStorage.getItem("fav")) || [];

      var itemObj = {
        itemId: itemId,
        title: title,
        imgTryOn: imgTryOn,
        imgFrames: imgFrames,
        type: itemType
      };

      oldItems.push(itemObj);

      if (countFav() < 6) {
        localStorage.setItem(storageKey, JSON.stringify(oldItems));
        titleBox.addClass("is-fav");
        _parent.addClass("fav-active");
        checkFavItem();
      } else {
        limitPopup.fadeIn(500);
      }
    } else {

      delFav(itemId);
      titleBox.removeClass("is-fav");
      _parent.removeClass("fav-active");
      setTimeout(function () {
        checkFavItem();
      }, 200);
      if (jQuery(".fav-list").length) {
        showFav();
      }
    }
  });

  // Check Favorites
  function checkFavItem() {
    var items = JSON.parse(localStorage.getItem("fav")) || [];
    var favId = [];
    for (var i = 0; i < items.length; i++) {
      favId[i] = items[i].itemId;
    }
    // console.log(favId);
    jQuery(".prod-list").each(function () {
      var _this = jQuery(this);

      _this.find(".item-holder").each(function (i, k) {
        var prodId = jQuery(k).attr("data-id");

        if (favId.indexOf(prodId) > -1) {
          jQuery(k)
            .find(".title-box")
            .addClass("is-fav");
          jQuery(k).addClass("fav-active");
        } else {
          jQuery(k)
            .find(".title-box")
            .removeClass("is-fav");
          jQuery(k).removeClass("fav-active");
        }
      });
    });
  }

  // Count Favorites
  function countFav() {
    var items = JSON.parse(localStorage.getItem("fav")) || [];
    return items.length;
  }

  // Fav Page Button
  jQuery('body').on('click', '.btn-fav, .btn-cont', function (e) {
    var _this = jQuery(this);
    var _link = jQuery(this).attr('href');
    var noFavPopup = jQuery('#popup-no-fav');

    if (countFav() == 0) {
      e.preventDefault();
      noFavPopup.fadeIn(500);
    }

  });

  // Show Favorites
  function showFav() {
    var favs = JSON.parse(localStorage.getItem("fav")) || [];
    var favFrameHtml = "";
    var favTryHtml = "";

    for (var i = 0; i < favs.length; i++) {
      var itemId = favs[i].itemId;
      var itemTitle = favs[i].title;
      var itemImgTryOn = favs[i].imgTryOn;
      var itemImgFrames = favs[i].imgFrames;

      favTryHtml += '<div class="item">';
      favTryHtml += '<div class="item-holder" data-id="' + itemId + '">';
      favTryHtml += "<figure>";
      favTryHtml += '<div class="img-holder">';
      favTryHtml += '<a href="#" class="zoom">Zoom</a>';
      favTryHtml += '<img src="' + itemImgTryOn + '" alt="">';
      favTryHtml += "</div>";
      favTryHtml += "</figure>";
      favTryHtml += '<div class="title-box is-fav">';
      favTryHtml += '<div class="favorite-del">';
      favTryHtml += '<h3 class="title">' + itemTitle + "</h3>";
      favTryHtml += '<a href="" class="fav-del"></a>';
      favTryHtml += "</div>";
      favTryHtml += "</div>";
      favTryHtml += "</div>";
      favTryHtml += "</div>";

      favFrameHtml += '<div class="item">';
      favFrameHtml += '<div class="item-holder" data-id="' + itemId + '">';
      favFrameHtml += "<figure>";
      favFrameHtml += '<div class="img-holder">';
      favFrameHtml += '<a href="#" class="zoom">Zoom</a>';
      favFrameHtml += '<img src="' + itemImgFrames + '" alt="">';
      favFrameHtml += "</div>";
      favFrameHtml += "</figure>";
      favFrameHtml += '<div class="title-box is-fav">';
      favFrameHtml += '<div class="favorite-del">';
      favFrameHtml += '<h3 class="title">' + itemTitle + "</h3>";
      favFrameHtml += '<a href="" class="fav-del"></a>';
      favFrameHtml += "</div>";
      favFrameHtml += "</div>";
      favFrameHtml += "</div>";
      favFrameHtml += "</div>";
    }

    var tryElem = jQuery("#try").find(".fav-list");
    var frameElem = jQuery("#frame").find(".fav-list");
    var dummyItem = '';

    if (countFav() <= 5) {
      dummyItem = '<div class="item dummy-item">';
      dummyItem += '<div class="item-holder">';
      dummyItem += '<div class="dummy-frame">';
      dummyItem += '<a href="#" class="icon-add more-frames"></a>';
      dummyItem += "</div>";
      dummyItem += "</div>";
      dummyItem += "</div>";
    }

    if (favTryHtml) {
      tryElem.html(favTryHtml);
      tryElem.append(dummyItem);
    } else {
      tryElem.html(dummyItem);
    }

    if (favFrameHtml) {
      frameElem.html(favFrameHtml);
      frameElem.append(dummyItem);
    } else {
      frameElem.html(dummyItem);
    }
  }

  if (jQuery(".fav-list").length) {
    showFav();
  }

  // Delete Favorites
  function delFav(delId) {
    var favs = JSON.parse(localStorage.getItem("fav")) || [];
    var delIndex = "";
    var favLength = favs.length;

    for (var i = 0; i < favLength; i++) {
      var itemId = favs[i].itemId;
      if (delId == itemId) {
        delIndex = i;
      }
    }

    if (favs.length === 1) {
      localStorage.removeItem("fav");
    } else {
      favs.splice(delIndex, 1);
      localStorage.setItem("fav", JSON.stringify(favs));
    }
  }

  jQuery("body").on("click", ".fav-del", function (e) {
    e.preventDefault();
    var _this = jQuery(this);
    var _parent = _this.parents(".item-holder");
    var itemId = _parent.attr("data-id");
    var delPopup = jQuery('#popup-fav-del');

    delPopup.fadeIn(500, function () {
      delPopup.find('.btn-remove').attr('data-id', itemId);
    });

  });

  jQuery("body").on("click", ".btn-remove", function (e) {
    e.preventDefault();
    var _this = jQuery(this);
    var itemId = _this.attr("data-id");

    _this.parents('.popup').fadeOut(500, function () {
      jQuery('.popup').fadeOut(500);
      delFav(itemId);
      checkFavItem();
      showFav();
    });

  });

  // Getting Basic Information
  jQuery(".gender-area").on("click", "a", function (e) {
    e.preventDefault();
    var _this = jQuery(this);
    var _parent = _this.parent("li");
    var _link = _this.attr("href");
    var fieldPopup = jQuery('#popup-field');
    var fname = jQuery(".info-area")
      .find('input[name="fname"]')
      .val();
    var gender = _parent.attr("data-gender");
    var storageKey = "user";
    var aplhaReg = /^[a-zA-Z ]+$/;

    if (fname != "") {
      if (aplhaReg.test(fname)) {
        var itemObj = JSON.stringify({
          fname: fname,
          gender: gender
        });

        localStorage.setItem(storageKey, itemObj);
        jQuery("#step1").hide(10);
        jQuery("#footer").show(10);
        jQuery("html, body").animate({
          scrollTop: 0
        });
        // Ditto Init
        // const mySecret =
        //   "2258ddd8f2a119f609c2e63f9829725c4692764ce318d48ebaedd196962874b430eaabbd9816eb935350f10013a00ae2979940faeaad50da4f181eeb92caa1c6";
        const mySecret = "ed6456550d39b40a428625ef38aa85865200abd222b09bd07f73f5e6b75bf95d4e3f5d3951c1a97625a2cb94e8c9b0e8ad7e1ab68a5ea865ec3cc91090cb6564";
        // const dittoID = "demo";
        const dittoID = "cvs";

        const signature = getSignature(dittoID, mySecret);

        jQuery("#step2").show(10, function () {
          jQuery("#create").show(10);
          jQuery("#ditto").hide(10);
          new DittoModule(signature);
        });
      } else {
        fieldPopup.find('h3').html('Something Went Wrong');
        fieldPopup.find('.txt').html('<p>Invalid name, please enter alphabets only</p>');
        fieldPopup.fadeIn(500);
      }
    } else {
      fieldPopup.find('h3').html('Forgot Something?');
      fieldPopup.find('.txt').html('<p>Please enter your name to continue</p>');
      fieldPopup.fadeIn(500);
      // alert("Please Enter your Name to Continue");
    }
  });

  // Back
  jQuery("body").on("click", ".btn-back", function (e) {
    if (jQuery("#wrapper").hasClass("steps-page")) {
      e.preventDefault();
      console.log("clicked");
      var _this = jQuery(this);
      var _back = _this.attr("data-back");

      var dittoInfo = JSON.parse(localStorage.getItem("ditto"));
      new DittoModule().dittoDestroy();
      if (dittoInfo) {
        new TryOnModule(
          "#ditto",
          dittoInfo.dittoId,
          dittoInfo.dittoSign
        ).tryOnDestroy();
      }

      jQuery("#step2").hide(10);
      jQuery(_back).show();
      jQuery("#footer").hide(10);
    }
  });

  // Exit
  jQuery("body").on("click", ".btn-exit", function (e) {
    e.preventDefault();
    var _this = jQuery(this);

    var popup = jQuery("#popup-exit");
    popup.fadeIn(500);

  });

  jQuery("body").on("click", ".conf-exit", function (e) {
    e.preventDefault();
    var _this = jQuery(this);
    var _link = _this.attr("href");

    pageUp();
    // jQuery("body").fadeOut(600, function () {
    //   localStorage.clear();
    //   window.location.href = _link;
    // });
  });

  // Capture Form
  var capForm = jQuery('.capture-form, .login-form');
  if (capForm.length) {
    var userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo) {
      var fnameField = capForm.find('input[name="fname"]');
      fnameField.val(userInfo.fname);
    }

    jQuery('.capture-form').disableAutoFill({
        debugMode: true,
        randomizeInputName: true,
    });
  }

  // Disable Autofill
  

  // Disable submit
  jQuery('.capture-form').on('change', 'input[type="checkbox"]', function(){
    var _this = jQuery(this);
    var isChecked = _this.is(':checked');
    var isReq = _this.hasClass('required');

    if (isReq) {
      if(!isChecked){
        jQuery('.submit-cap').addClass('disabled');
      }else{
        jQuery('.submit-cap').removeClass('disabled');
      }
    }
  });

  // Capture submit
  jQuery('.submit-cap').on('click', function (e) {
    e.preventDefault();

    var _this = jQuery(this);
    var _link = _this.attr('href');
    var aplhaReg = /^[a-zA-Z ]+$/;
    var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var numReg = /^[0-9]+$/;
    var form = _this.parents('form');

    form.find('input').each((index, element) => {
      var fieldType = jQuery(element).attr("type");
      var field = jQuery(element).attr('data-field');
      var isReq = jQuery(element).hasClass('required');
      var fieldVal = '';
      var msg = '';

      if (fieldType == 'text' || fieldType == 'email' || fieldType == 'password') {
        fieldVal = jQuery(element).val();

        if (fieldVal) {

          if (field == 'first name' || field == 'last name') {
            if (!aplhaReg.test(fieldVal)) {
              msg = 'Alphabets only';
            }
          }

          if (field == 'email') {
            if (!emailReg.test(fieldVal)) {
              msg = 'Not valid email';
            }
          }

          if (field == 'phone') {
            if (!numReg.test(fieldVal)) {
              msg = 'Numbers only';
            }
          }
        } else {
          if (isReq) {
            msg = 'Enter your ' + field;
          }
        }

      }

      if (fieldType == 'checkbox') {
        if (isReq) {
          fieldVal = jQuery(element).is(':checked');
          if (!fieldVal) {
            msg = 'You must check this box to continue';
          }
        }
      }

      if (msg) {
        jQuery(element).parents('.field').addClass('error');
        jQuery(element).parents('.field').find('.err-txt').html(msg);

      } else {
        jQuery(element).parents('.field').removeClass('error');
      }

    });

    var isError = capForm.find('.error');
    if (isError.length == 0) {
      // Can put this info to local storage here.
      window.location.href = _link;
    }

  });

  capForm.on('click', 'input', function () {
    var _this = jQuery(this);
    var _parent = _this.parents('.field');
    var fieldType = _this.attr("type");

    if (fieldType == 'checkbox') {
      var checked = _this.is(':checked');
    }

    if (checked) {
      _parent.removeClass('error');
    }
    _parent.removeClass('error');
  });

  jQuery('.learn-btn').on('click', function (e) {
    e.preventDefault();
    var _this = jQuery(this);
    var popup = jQuery('#popup-iframe');
    popup.fadeIn(500);
  });
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
        var objectURL = URL.createObjectURL(this.responseText);
		 // myImage.src = objectURL;

		 console.log(objectURL);
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
});