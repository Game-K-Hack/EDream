/*          *     .        *  .    *    *   . 
 .  *  move your mouse to over the stars   .
 *  .  .   change these values:   .  *
   .      * .        .          * .       */
const STAR_COLOR = '#fff';
const STAR_SIZE = 3;
const STAR_MIN_SCALE = 0.2;
const OVERFLOW_THRESHOLD = 50;
const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8;

const canvas = document.querySelector('canvas'),
  context = canvas.getContext('2d');

let scale = 1, // device pixel ratio
  width,
  height;

let stars = [];

let pointerX,
  pointerY;

let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

let touchInput = false;

generate();
resize();
step();

window.onresize = resize;
// canvas.onmousemove = onMouseMove;
// canvas.ontouchmove = onTouchMove;
// canvas.ontouchend = onMouseLeave;
// document.onmouseleave = onMouseLeave;

function generate() {

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: 0,
      y: 0,
      z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
    });

  }

}

function placeStar(star) {

  star.x = Math.random() * width;
  star.y = Math.random() * height;

}

function recycleStar(star) {

  let direction = 'z';

  let vx = Math.abs(velocity.x),
    vy = Math.abs(velocity.y);

  if (vx > 1 || vy > 1) {
    let axis;

    if (vx > vy) {
      axis = Math.random() < vx / (vx + vy) ? 'h' : 'v';
    } else {
      axis = Math.random() < vy / (vx + vy) ? 'v' : 'h';
    }

    if (axis === 'h') {
      direction = velocity.x > 0 ? 'l' : 'r';
    } else {
      direction = velocity.y > 0 ? 't' : 'b';
    }
  }

  star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

  if (direction === 'z') {
    star.z = 0.1;
    star.x = Math.random() * width;
    star.y = Math.random() * height;
  } else
    if (direction === 'l') {
      star.x = -OVERFLOW_THRESHOLD;
      star.y = height * Math.random();
    } else
      if (direction === 'r') {
        star.x = width + OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else
        if (direction === 't') {
          star.x = width * Math.random();
          star.y = -OVERFLOW_THRESHOLD;
        } else
          if (direction === 'b') {
            star.x = width * Math.random();
            star.y = height + OVERFLOW_THRESHOLD;
          }

}

function resize() {

  scale = window.devicePixelRatio || 1;

  width = window.innerWidth * scale;
  height = window.innerHeight * scale;

  canvas.width = width;
  canvas.height = height;

  stars.forEach(placeStar);

}

function step() {

  context.clearRect(0, 0, width, height);

  update();
  render();

  requestAnimationFrame(step);

}

function update() {

  velocity.tx *= 0.96;
  velocity.ty *= 0.96;

  velocity.x += (velocity.tx - velocity.x) * 0.8;
  velocity.y += (velocity.ty - velocity.y) * 0.8;

  stars.forEach(star => {

    star.x += velocity.x * star.z;
    star.y += velocity.y * star.z;

    star.x += (star.x - width / 2) * velocity.z * star.z;
    star.y += (star.y - height / 2) * velocity.z * star.z;
    star.z += velocity.z;

    // recycle when out of bounds
    if (star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD) {
      recycleStar(star);
    }

  });

}

function render() {

  stars.forEach(star => {

    context.beginPath();
    context.lineCap = 'round';
    context.lineWidth = STAR_SIZE * star.z * scale;
    context.globalAlpha = 0.5 + 0.5 * Math.random();
    context.strokeStyle = STAR_COLOR;

    context.beginPath();
    context.moveTo(star.x, star.y);

    var tailX = velocity.x * 2,
      tailY = velocity.y * 2;

    // stroke() wont work on an invisible line
    if (Math.abs(tailX) < 0.1) tailX = 0.5;
    if (Math.abs(tailY) < 0.1) tailY = 0.5;

    context.lineTo(star.x + tailX, star.y + tailY);

    context.stroke();

  });

}

function movePointer(x, y) {

  if (typeof pointerX === 'number' && typeof pointerY === 'number') {

    let ox = x - pointerX,
      oy = y - pointerY;

    velocity.tx = velocity.tx + ox / 8 * scale * (touchInput ? 1 : -1);
    velocity.ty = velocity.ty + oy / 8 * scale * (touchInput ? 1 : -1);

  }

  pointerX = x;
  pointerY = y;

}

function onMouseMove(event) {

  touchInput = false;

  movePointer(event.clientX, event.clientY);

}

function onTouchMove(event) {

  touchInput = true;

  movePointer(event.touches[0].clientX, event.touches[0].clientY, true);

  event.preventDefault();

}

function onMouseLeave() {

  pointerX = null;
  pointerY = null;

}



// KONAMI
// a key map of allowed keys
var allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  65: 'a',
  66: 'b'
};
// the 'official' Konami Code sequence
var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
// a variable to remember the 'position' the user has reached so far.
var konamiCodePosition = 0;
// add keydown event listener
document.addEventListener('keydown', function (e) {
  // get the value of the key code from the key map
  var key = allowedKeys[e.keyCode];
  // get the value of the required key from the konami code
  var requiredKey = konamiCode[konamiCodePosition];

  // compare the key with the required key
  if (key == requiredKey) {

    // move to the next key in the konami code sequence
    konamiCodePosition++;

    // if the last key is reached, activate cheats
    if (konamiCodePosition == konamiCode.length) {
      activateCheats();
      konamiCodePosition = 0;
    }
  } else {
    konamiCodePosition = 0;
  }
});
// KONAMI FUNCTION
function activateCheats() {
  document.onmousemove = onMouseMove;
  document.ontouchmove = onTouchMove;
  document.ontouchend = onMouseLeave;
  document.onmouseleave = onMouseLeave;
}



// SEARCH BAR
// $(document).ready(function(){
//   $("#search").focus(function() {
//     $(".search-box").addClass("border-searching");
//     $(".search-icon").addClass("si-rotate");
//   });
//   $("#search").blur(function() {
//     $(".search-box").removeClass("border-searching");
//     $(".search-icon").removeClass("si-rotate");
//   });
//   $("#search").keyup(function() {
//       if($(this).val().length > 0) {
//         $(".go-icon").addClass("go-in");
//       }
//       else {
//         $(".go-icon").removeClass("go-in");
//       }
//   });
//   $(".go-icon").click(function(){
//     $(".search-form").submit();
//   });
// });

document.addEventListener("DOMContentLoaded", function() {
  var searchInput = document.getElementById("search");
  var searchBox = document.querySelector(".search-box");
  var searchIcon = document.querySelector(".search-icon");
  var goIcon = document.querySelector(".go-icon");
  var searchForm = document.querySelector(".search-form");

  searchInput.addEventListener("focus", function() {
    searchBox.classList.add("border-searching");
    searchIcon.classList.add("si-rotate");
  });

  searchInput.addEventListener("blur", function() {
    searchBox.classList.remove("border-searching");
    searchIcon.classList.remove("si-rotate");
  });

  searchInput.addEventListener("keyup", function() {
    if (this.value.length > 0) {
      goIcon.classList.add("go-in");
    } else {
      goIcon.classList.remove("go-in");
    }
  });

  goIcon.addEventListener("click", function() {
    searchForm.submit();
  });
});
