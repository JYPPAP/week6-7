document.addEventListener("DOMContentLoaded", function () {

  // 버튼관련 변수
  var doc = document;
  var buttons = doc.getElementById("btn_wrap");
  var button = buttons.children;
  var startBtn = button[0];
  var stopBtn = button[1];
  var pauseBtn = button[2];
  var restartBtn = button[3];
  var mixBtn = button[4];
  var btnArray;

  // 점수 출력관련 변수
  var score = doc.getElementById("score");
  var playCount = doc.getElementById("playCount");
  var playTimeWrap = doc.getElementsByClassName("playTimeWrap")[0];
  var playTime = doc.getElementById("playTime");

  // 카드관련 변수
  var cards = doc.getElementById("cards");
  var card = cards.getElementsByClassName("card");

  var parseValue;
  var scoreBoard = doc.getElementById("scoreBoard");

  /* 스코어 보드 설정
  로컬스토리지에 값이 있는지 확인
    값이 있다면 
    값을 분할 후 동작.
  */
  // localStorage.clear();
  function setScoreBoard() {
    var scoreItem = localStorage.getItem("score");
    var scoreText = "<div><span>이름</span><span>Score</span><span>소요시간</span></div>";

    if (typeof (scoreItem) === "string") {
      var splitScore = scoreItem.split(/\,/g);

      if ((splitScore.length % 3) === 0) {
        var total = splitScore.length / 3;

        for (var i = 0; i < total; i++) {
          scoreText += "<div><span>" + splitScore[(i * 3)] + "</span><span>" + splitScore[(i * 3) + 1] + "</span><span>" + splitScore[(i * 3) + 2] + "</span></div>";
        }
        //console.log(scoreItem);
        scoreBoard.innerHTML = scoreText;

      } else {
        alert("가져온 값에 오류가 있습니다.\n기록을 초기화 합니다.");
        localStorage.clear(score);
      }
    } else {
      scoreBoard.innerHTML = scoreText;
      //console.log("저장된 score가 없음.");
    }
  };
  setScoreBoard();

  startBtn.onclick = function () {
    /* 버튼 숨기고 보여주기 */
    var playInfo = doc.getElementById("playInfo");

    btnArray = [false, true, true, false, false];
    showBtn(btnArray);
    for (var i = 0; i < card.length; i++) {
      card[i].style.display = "block";
    }
    playInfo.style.display = "none";
    score.textContent = 0;
    /*##########
        AJAX
    ##########*/
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'json/setPlay.json');
    xhr.send();

    xhr.onreadystatechange = function () {
      console.log("[" + xhr.status + "] : " + xhr.statusText);
      // 서버 응답 완료 && 정상 응답
      if (xhr.readyState !== XMLHttpRequest.DONE) return;

      if (xhr.status === 200) {
        parseValue = JSON.parse(xhr.responseText);
        playTime.textContent = parseValue.time;

        setImage();
        mixImage();
        showCount();

        return parseValue;
      } else {
        console.log("[" + xhr.status + "] : " + xhr.statusText);
      }
    }
  };

  /* 0-15까지 중복없이 랜덤한 숫자가 들어있는 배열 */
  var mixArray = [];

  for (var i = 0; i < 16; i++) mixArray[i] = i;

  function shuffle(array) {
    for (var index = array.length - 1; index > 0; index--) {
      // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
      var randomPosition = Math.floor(Math.random() * (index + 1));
      // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다. 
      var temporary = array[index];
      array[index] = array[randomPosition];
      array[randomPosition] = temporary;
    }
  }

  function setImage() {
    var imageUrl = parseValue.images;
    var setFrame = "";
    for (var i = 0; i < imageUrl.length * 2; i++) {
      setFrame += '<div class="card"><div class="face face_front">?</div><div class="face face_back" style="background-image: url(' + imageUrl[(i % 8)] + ');"></div></div>';
    }
    cards.innerHTML = setFrame;
  }

  /* 랜덤 배치 */
  function mixImage() {
    shuffle(mixArray);
    var mixCard = "";
    for (var i = 0; i < mixArray.length; i++) {
      faceHtml = card[mixArray[i]].innerHTML;
      mixCard += '<div class="card active">' + faceHtml + '</div>'
    }

    cards.innerHTML = mixCard;
    //console.log("####  mix  ####");
    // console.log(cards.innerHTML);
    showImage();
  }

  function showImage() {
    //console.log("showImage");
    //console.log(card.length);
    for (var i = 0; i < card.length; i++) {
      card[i].className = "card active";
      card[i].style.display = "block";
      //console.log(card[i].className);
      setTimeout(function () {
        for (var i = 0; i < card.length; i++) {
          card[i].className = "card";
        }
      }, 3000);
    }

    for (var i = 3; i < 0; i--) {
      setTimeout(function () {
        playCount.textContent = i;
      }, i * 1000);
    }

  }
  var clickCount = 0;
  var prevImage = "";
  var checkFlag = false;
  var gameCount;

  cards.addEventListener("click", function (e) {

    var target = e.target;
    var targetImage = target.nextElementSibling;

    if (clickCount === 2) return;

    if (target.className === "face face_front") {
      target.className = "face face_front active";
    } else {
      return;
    }

    if (isNaN(gameCount)) gameCount = 0;

    var targetNumber = targetImage.style.backgroundImage;
    if (clickCount === 1) {
      var prevNumber = prevImage.style.backgroundImage;
      clickCount = 2;

      if (targetNumber === prevNumber) {
        score.textContent = Number(score.textContent) + 10;
        gameCount++;
        //console.log("");
        //console.log("gameCount");
        //console.log(gameCount);
        setTimeout(function () {
          target.className = "face face_front clear";
          prevImage.previousElementSibling.className = "face face_front clear";
          clickCount = 0;
        }, 500);

      } else {
        score.textContent = Number(score.textContent) - 5;
        var frontFace = cards.getElementsByClassName("face_front");

        setTimeout(function () {
          for (var i = 0; i < frontFace.length; i++) {
            frontFace[i].className = frontFace[i].className !== "face face_front clear" ? "face face_front" : "face face_front clear";
          }
          clickCount = 0;
        }, 1000);

      }
      if (gameCount === 8) {
        gameEnd();
      }

      return clickCount, checkFlag, gameCount;
    } else {
      clickCount = 1;
      prevImage = targetImage;

      return clickCount, prevImage;
    }
  });

  function gameEnd() {
    clearInterval(intervalTime);
    gameCount = 0;

    playCount.style.display = 'block';
    playTimeWrap.style.display = 'none';
    var endScore = (Number(score.textContent) + Number(playTime.textContent)) + "점";
    var endTime = (Number(parseValue.time) - Number(playTime.textContent)) + "초";
    playCount.textContent = "총 Score는 " + endScore + "(" + score.textContent + "+" + playTime.textContent + ") 입니다.";

    var endName = prompt("게임이 종료되었습니다.\n이름을 입력해주세요\n(콤마 , )제외", "익명");
    var tempItem = localStorage.getItem("score");
    var parseName = endName.replace(/[\,]/g, "");
    var endString = parseName + "," + endScore + "," + endTime;
    var setString = "";

    if (tempItem === null) {
      setString = endString;
    } else {
      setString = endString + "," + tempItem;
    }
    localStorage.clear();
    localStorage.setItem("score", setString);
    scoreBoard.innerHTML = "";
    setScoreBoard();

    btnArray = [true, false, false, false, false];
    showBtn(btnArray);
  }

  /*##################
      button Click
  ##################*/
  function showBtn(array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        button[i].style.display = "inline";
      } else {
        button[i].style.display = "none";
      }
    }
  }

  function showCount() {
    var timeCount = 3;
    playCount.style.display = "block";
    playTimeWrap.style.display = "none";

    btnArray = [false, false, false, false, false];
    showBtn(btnArray);

    for (var i = 0; i < 4; i++) {
      var timeCount = 4;
      setTimeout(function () {
        timeCount--;
        playCount.textContent = timeCount;
        if (timeCount === 0) {
          btnArray = [false, true, true, false, true];
          showBtn(btnArray);
          startCount();
        }
      }, (i * 1000));
    }
  }

  var intervalTime;

  function startCount() {
    playCount.style.display = "none";
    playTimeWrap.style.display = "block";
    mixBtn.style.display = "inline";
    intervalTime = setInterval(changeTime, 1000);
  }

  function changeTime() {
    var time = Number(playTime.textContent);
    time--;
    playTime.textContent = time;
    if (time < 1) {
      clearInterval(intervalTime);
      gameEnd();
      return;
    }
  }
  stopBtn.onclick = function () {
    btnArray = [true, false, false, false, false];
    showBtn(btnArray);

    playCount.style.display = "block";
    playCount.textContent = "준비";
    playTimeWrap.style.display = "none";
    cards.style.visibility = "visible";
    cards.innerHTML = '<p id="playInfo">게임을 시작하려면 시작하기 버튼을 눌러주세요</p>';
    score.textContent = 0;

    for (var i = 0; i < card.length; i++) {
      card[i].style.display = "none";
    }
    clearInterval(intervalTime);
  };

  pauseBtn.onclick = function () {
    btnArray = [false, true, false, true, false];
    showBtn(btnArray);

    cards.style.visibility = "hidden";
    clearInterval(intervalTime);
  };

  restartBtn.onclick = function () {
    btnArray = [false, true, true, false, true];
    showBtn(btnArray);

    cards.style.visibility = "visible";
    intervalTime = setInterval(changeTime, 1000);
  };

  mixBtn.onclick = function () {
    score.textContent = Number(score.textContent) - 5;
    mixBtn.style.display = "none";

    clearInterval(intervalTime);
    shuffle(mixArray);
    mixImage();
    showCount();
  };
});