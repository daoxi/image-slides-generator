// Initialize the swiper.
const swiper = new Swiper(".swiper-container", {
  slidesPerView: 1.2,
  spaceBetween: 25,
  centeredSlides: true,
  slideToClickedSlide: true, // Clicking on any slide will produce transition to this slide.
});

// Global variable for numbering new slides.
let newSlideCounter = 1;

/**
 * Change the background image in the Fullscreen mode.
 */
function changeFullscreenImage() {
  // The swiper-slide-active is the default class name of currently active slide of Swiper.
  // Changes the current fullscreen background image to that of the currently active slide.
  $(".fullscreen-mode").css(
    "background-image",
    $(".swiper-slide-active").css("background-image")
  );
}

/**
 * Update all the relevant room information in Slides mode.
 */
function updateRoomInfo() {
  $(".room-name")
    .text($(".swiper-slide-active").attr("slide-name"))
    .stop(true)
    .hide(0)
    .fadeIn(700);
  $(".room-details")
    .text(
      "Floor - " +
        $(".swiper-slide-active").attr("floor-name") +
        "\xA0\xA0\xA0\xA0 Wall - " +
        $(".swiper-slide-active").attr("wall-name")
    )
    .stop(true)
    .hide(0)
    .fadeIn(700);
}

/**
 * Check and conditionally display the button for adding new slide.
 */
function checkIfLastSlide() {
  // Clear the animation queue before fadeIn/Out.
  if (swiper.isEnd) {
    $(".add-slide-sign").stop(true).fadeIn(500);
  } else {
    $(".add-slide-sign").stop(true).fadeOut(300);
  }
}

/**
 * Briefly display a notification message.
 *
 * @param {string} msg The message to display to the user.
 */
function toNotify(msg) {
  $(".notify").text(msg);
  // Clear the animation queue before starting a new one. slideDown to display, slideUp to hide.
  $(".notify").stop(true).slideDown().delay(900).slideUp();
}

// Switch to show the Slides mode when the Exit button is clicked.
$(".exit-button").on("click", function () {
  $(".fullscreen-mode").fadeOut(500);
  $(".fullscreen-mode .top-menu-container").slideUp(350);
});

// Switch to show the Fullscreen mode page when the fullscreen button is clicked.
$(".btn-fullscreen").on("click", function () {
  $(".fullscreen-mode").fadeIn(500);
  changeFullscreenImage();
  $(".fullscreen-mode .top-menu-container").slideDown(350);
});

// Runs after the slide change animation is completed, this ensures that the swiper-slide-active class will be assigned to the correct slide after the slide changes.
swiper.on("slideChangeTransitionEnd", function () {
  updateRoomInfo();
  checkIfLastSlide();
});

// Used to add a new slide when the add/plus sign is clicked.
$(".add-slide-sign").on("click", function () {
  // Fetch the returned URL of the image to be inserted into the HTML template, which is used to append the slide to the swiper.
  fetch("https://source.unsplash.com/random/1600x800/?office,room,decor").then(
    (data) => {
      swiper.appendSlide(
        `<div class="swiper-slide" style="background-image: url('${data.url}');" slide-name="New Sample Office Room ${newSlideCounter}" floor-name="New Details ${newSlideCounter}" wall-name="New Details ${newSlideCounter}"></div>`
      );
      // Include it inside of the fetch method so that the global counter increases AFTER the image has been fetched.
      newSlideCounter++;
    }
  );
  toNotify("Loading image to add new slide");
  checkIfLastSlide();
});

// Duplicate the current slide and append to the end.
$(".duplicate-slide").on("click", function () {
  // append slide using the currently active slide's HTML element
  swiper.appendSlide($(".swiper-slide-active").get(0).outerHTML);
  toNotify("Current slide duplicated and appended");
  checkIfLastSlide();
});

// Display a sample message for testing buttons.
$(".btn-dummy").on("click", function () {
  toNotify("(This is a sample message)");
});
