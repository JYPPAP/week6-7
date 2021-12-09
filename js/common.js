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

  var score = doc.getElementById("score");
  var playCount = doc.getElementById("playCount");
  var playTimeWrap = doc.getElementsByClassName("playTimeWrap")[0];
  var playTime = doc.getElementById("playTime");

  // 카드관련 변수
  var cards = doc.getElementById("cards");
  var card = cards.getElementsByClassName("card");
  var frontFace = cards.getElementsByClassName("face_front");
  // var backFace = cards.getElementsByClassName("face_back");
  var playInfo = doc.getElementById("playInfo");
  // 점수관련 변수
  var parseValue;
  var scoreBoard = doc.getElementById("scoreBoard");

  /*##################
      LocalStorage
  ##################*/
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
        console.log(scoreItem);
        scoreBoard.innerHTML = scoreText;

      } else {
        alert("가져온 값에 오류가 있습니다.");
        alert("기록을 초기화 합니다.");
        localStorage.clear(score);
      }
    } else {
      scoreBoard.innerHTML = scoreText;
      console.log("저장된 score가 없음.");
    }
  };
  setScoreBoard();

  startBtn.onclick = function () {
    /* 버튼 숨기고 보여주기 */
    var btnArray = [false, true, true, false, false];
    showBtn(btnArray);
    for (var i = 0; i < card.length; i++) {
      card[i].style.display = "block";
    }
    playInfo.style.display = "none";

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
    console.log("####  mix  ####");
    // console.log(cards.innerHTML);
    showImage();
  }

  function showImage() {
    console.log("showImage");
    console.log(card.length);
    for (var i = 0; i < card.length; i++) {
      card[i].className = "card active";
      card[i].style.display = "block";
      console.log(card[i].className);
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
        console.log("");
        console.log("gameCount");
        console.log(gameCount);
        setTimeout(function () {
          target.className = "face face_front clear";
          prevImage.previousElementSibling.className = "face face_front clear";
          clickCount = 0;
        }, 500);

      } else {
        score.textContent = Number(score.textContent) - 5;

        setTimeout(function () {
          for (var i = 0; i < frontFace.length; i++) {
            frontFace[i].className = frontFace[i].className !== "face face_front clear" ? "face face_front" : "face face_front clear";
          }
          clickCount = 0;
        }, 1000);

      }
      if (gameCount === 8) {
        gameCount = 0;
        gameEnd();
      }

      return clickCount, checkFlag, gameCount;
    } else {
      // console.log("첫 번째 클릭일 때 실행될 코드");
      clickCount = 1;
      prevImage = targetImage;
      /* 두 번째 클릭에서 기존 prev를 가지고 있어도 첫 번째 클릭으로 새로운 값이 덮어써지기 때문에 문제는 없다. */
      return clickCount, prevImage;
    }
  });

  function gameEnd() {
    /* prompt로 이름을 입력받는 부분을 값이 없을 때 계속 호출될 수 있도록 만들기. */
    clearInterval(intervalTime);
    playCount.style.display = 'block';
    playTimeWrap.style.display = 'none';
    var endScore = (Number(score.textContent) + Number(playTime.textContent)) + "점";
    var endTime = (Number(parseValue.time) - Number(playTime.textContent)) + "초";
    playCount.textContent = "총 Score는 " + endScore + "(" + score.textContent + "+" + playTime.textContent + ") 입니다.";
    score.textContent = 0;

    var endName = prompt("게임이 종료되었습니다.\n이름을 입력해주세요\n(콤마 , )제외", "익명");

    if (endName === "" || endName === null) {
      endName = prompt("이름을 입력하지 않았습니다.\n이름을 입력해주시기 바랍니다.\n(콤마 , )제외", "익명");
      if (endName === "" || endName === null) {
        endName = "익명"
      }
    }
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

    var btnArray = [true, false, false, false, false];
    showBtn(btnArray);



  }
  // gameEnd();

  /* (END) 카드를 클릭했을 때 할 동작 */
  /* 카드게임이 끝난것을 어떻게 확인할 것인지
  일치할 때 gameCount를 1씩 추가.
  16이 되면 prompt 실행.
  이름을 가져오고 score와 시간을 점수로 합산 후 score로, 시간은 따로 시간으로 저장?
   */

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

    var btnArray = [false, false, false, false, false];
    showBtn(btnArray);
    for (var i = 0; i < 4; i++) {
      var timeCount = 3;
      setTimeout(function () {
        playCount.textContent = timeCount;
        timeCount--;
        if (timeCount < 0) {
          var btnArray = [false, true, true, false, true];
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
    /* 게임을 종료하고 초기화면으로 돌아가기. */
    var btnArray = [true, false, false, false, false];
    showBtn(btnArray);

    for (var i = 0; i < card.length; i++) {
      card[i].style.display = "none";
    }
    cards.style.visibility = "visible";
    cards.innerHTML = '<p id="playInfo">게임을 시작하려면 시작하기 버튼을 눌러주세요</p>';
    playCount.style.display = "block";
    playCount.textContent = "준비";
    playTimeWrap.style.display = "none";
    score.textContent = 0;

    clearInterval(intervalTime);
  };

  pauseBtn.onclick = function () {
    /* 다시시작 버튼 노출 */
    var btnArray = [false, true, false, true, false];
    showBtn(btnArray);
    /* 타이머 중지, 모든 게임 동작이 중지 */
    cards.style.visibility = "hidden";
    clearInterval(intervalTime);
  };

  restartBtn.onclick = function () {
    var btnArray = [false, true, true, false, true];
    showBtn(btnArray);
    /* 타이머가 재동작하며, 게임을 다시 시작할 수 있다. */
    cards.style.visibility = "visible";
    intervalTime = setInterval(changeTime, 1000);
  };

  mixBtn.onclick = function () {
    /* Score에서 -5점 차감, 이미 찾은 카드를 제외한 나머지 카드들을 재배치 */
    score.textContent = Number(score.textContent) - 5;
    mixBtn.style.display = "none";
    clearInterval(intervalTime);
    shuffle(mixArray);
    /* 재배치된 카드를 3초간 보여준 후 다시 뒤집는다. */
    mixImage();
    showCount();
    /* 일시정지 중에는 실행될 수 없다. */
    /* card[basicArray[i]]에 있는 innerHTML을 빈 문자열에 집어넣은 뒤 그 값을 한 번에 모아서 출력하기. */
  };
});