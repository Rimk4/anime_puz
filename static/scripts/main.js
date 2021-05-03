//All the objects.
let choose = document.getElementById("choose"),
    counter = document.getElementById("counter_clicks"),
    pyatnashki = document.getElementById("holst"),
    aux_holst = document.getElementById("aux_holst"),
    orig = document.getElementById("orig"),
    show_orig = document.getElementById("show orig"),
    show_num = document.getElementById("num"),
    difficulty = document.getElementById("difficulty"),
    shuffle_pic = document.getElementById("shuffle pic"),
    start = document.getElementById("start"),
    save = document.getElementById("save color"),
    change_color = document.getElementById("change color"),
    slider = document.getElementById("rgb-slider");

// Buttons' backgrounds flags.
let show_orig_flag = false,
    show_num_flag = false;

//Auxiliary functions.
function time(){
  return parseInt(new Date().getTime() / 1000);
};

function rndm(min, max){
  return Math.floor(Math.random() * (max - min)) + min
};

function getRandomBool(){
  return Math.floor(Math.random() * 2)
};

//Click start to init.
start.onclick = () => {
  start.style.display = "none";
  document.querySelector(".container").style.display = "none";
  document.getElementById("menu").style.display = "initial";
  init();
}

//The main function - init().
function init(){
  // Some variables.
  let arr, source, k, size;

  function define_arr(){
    if (difficulty[difficulty.selectedIndex].value == 'easy'){
      k = 3;
      arr = [[0,1,2], [3,4,5], [6,7,8]];
      source = [[0,1,2], [3,4,5], [6,7,8]];
    };
    if (difficulty[difficulty.selectedIndex].value == 'hard'){
      k = 4;
      arr = [[0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15]];
      source = [[0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15]];
    };
    if (difficulty[difficulty.selectedIndex].value == 'impossible'){
      k = 5;
      arr = [[0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24]];
      source = [[0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24]];
    };
  };

  function prepare(){
    define_arr();
    size = [pyatnashki.width / k, pyatnashki.height / k];
    ctx.font = JSON.stringify(Math.floor(Math.min(size[0], size[1])/10))+'px Verdana';
    ctx2.drawImage(img, 0, 0);
    ctx2.fillRect(0, 0, size[0], size[1]);
    shuffle(350);
    draw();
  }

  function getNull() { // функция возвращает координату пустой клетки
    for (var i = 0; i < k; i++) {
      for (var j = 0; j < k; j++) {
        if (arr[i][j] === 0) {
          return{x: j, y: i};
        }
      }
    }
  };

  function move(x, y) {
    let nullX = getNull().x,
      nullY = getNull().y;
    if (((x - 1 == nullX || x + 1 == nullX) && y == nullY) || ((y - 1 == nullY || y + 1 == nullY) && x == nullX)) {
      arr[nullY][nullX] = arr[y][x];
      arr[y][x] = 0;
    }
  };

  function shuffle(stepCount) {
    let x,y;
    for (var i = 0; i < stepCount; i++) {
      let nullX = getNull().x,
        nullY = getNull().y,
        horisontal = getRandomBool(),
        dec_inc = getRandomBool();
      if (horisontal && dec_inc) { y = nullY; x = nullX - 1;}
      if (!horisontal && dec_inc) { x = nullX; y = nullY + 1;}
      if (horisontal && !dec_inc) { y = nullY; x = nullX + 1;}
      if (!horisontal && !dec_inc) { x = nullX; y = nullY - 1;}
      if (0 <= x && x < k && 0 <= y && y < k) {
        move(x, y);
      }
    };
    arr[getNull().y][getNull().x] = arr[0][0];
    arr[0][0] = 0;
  };

  let start = time();
  let clicks = 0;
  let URL = document.getElementById("url").innerHTML;
  let ctx2 = aux_holst.getContext('2d'),
      ctx = pyatnashki.getContext("2d");

  function draw(){
    for (let i = 0; i < k; i++){
      for (let j = 0; j < k; j++){
        ctx.drawImage(aux_holst, (arr[i][j] - Math.floor(arr[i][j] / k) * k) * size[0], Math.floor(arr[i][j] / k) * size[1], size[0], size[1], j * size[0], i * size[1], size[0], size[1]);
        if (show_num_flag && !(arr[i][j] == 0)){
          ctx.fillText(arr[i][j], j * size[0] + size[0]/10, i * size[1] + size[1]/10)
        }
      }
    }
  }

  function victory() {
    for (var i = 0; i < k; i++) {
      for (var j = 0; j < k; j++) {
        if (source[i][j] != arr[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  function event(x, y) {
    clicks += 1;
    counter.textContent = counter.textContent.split(" ").slice(0, -1) + " " + clicks;
    move(x, y);
    draw();
    if (victory()) {
      let table = document.getElementById("win_table");
      table.style.display = 'initial';
      table.getElementsByTagName('div')[0].innerHTML = `Reparing time: ${time() - start} sec. Clicks: ${clicks}`;
      table.getElementsByTagName('button')[0].onclick = () => {
        location.reload();
      }
      
    }
  }

  function getOffset(elem) {
    if (elem.getBoundingClientRect) {
      let box = elem.getBoundingClientRect(),
          body = document.body,
          docElem = document.documentElement,
          scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
          scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
          clientTop = docElem.clientTop || body.clientTop || 0,
          clientLeft = docElem.clientLeft || body.clientLeft || 0;
      return { top: Math.round(box.top + scrollTop - clientTop), left: Math.round(box.left + scrollLeft - clientLeft) }
    } else {
      var top=0, left=0;
      while(elem) {
        top = top + parseFloat(elem.offsetTop);
        left = left + parseFloat(elem.offsetLeft);
        elem = elem.offsetParent;
      }
      return {top: top, left: left};
    }
  }

  pyatnashki.onclick = function(e) {
    let x = (e.pageX - getOffset(pyatnashki).left) / size[0] | 0;
    let y = (e.pageY - getOffset(pyatnashki).top) / size[1] | 0;

    event(x, y);
  }

  pyatnashki.ontouchend = function(e) { // обрабатываем касания пальцем
    let x = (e.touches[0].pageX - getOffset(pyatnashki).left) / size[0] | 0;
    let y = (e.touches[0].pageY - getOffset(pyatnashki).top) / size[1] | 0;
    event(y, x);
  };

  show_orig.onclick = function(){
    show_orig_flag = !(show_orig_flag);
    if (show_orig_flag){
      orig.style.display = 'initial';
      show_orig.style.backgroundColor = "#4CAF50"; // Green.
    } else {
      orig.style.display = 'none';
      show_orig.style.backgroundColor = "#f44336"; // Red.
    }
  };

  show_num.onclick = function(){
    show_num_flag = !(show_num_flag);
    if (show_num_flag){
      document.querySelector(".colors_act").style.display = "initial";
      show_num.style.backgroundColor = "#4CAF50"; // Green.
      draw();
    } else {
      document.querySelector(".colors_act").style.display = "none";
      show_num.style.backgroundColor = "#f44336"; // Red.
      draw();
    }
  };

  choose.onclick = function (){
    prepare();
  };

  save.onclick = () => {
    slider.style.display = "none";
    ctx.fillStyle = hex_out.value;
    draw()
  }

  change_color.onclick = () => {
    slider.style.display = "initial";
  }

  shuffle_pic.onclick = function(e){
    shuffle(350);
    draw();
  };

  let img = new Image();

  img.onload = function(){
    pyatnashki.width = this.width;
    pyatnashki.height = this.height;

    aux_holst.width = this.width;
    aux_holst.height = this.height;
    prepare();
  };

  img.src = URL;
  orig.src = URL;
}
