document.addEventListener("DOMContentLoaded", function () {
  /* 1. 전역변수 지정 */
  var doc = document,
    buttons = doc.getElementById("btn_wrap"),
    arr_btn,
    game_score = (doc.getElementsByClassName("game_score"))[0],
    play_info = doc.getElementById("play_info"),
    cards = doc.getElementById("cards"),
    card_length,
    card_array = [],
    select_card = "",
    click_count = 0,
    game_count = 0,
    parse_value = "",
    score_board = doc.getElementById("score_board");

  /* 2. 버튼별 클릭 동작 구현하기 */
  buttons.addEventListener("click", function (e) {
    /* A. 지역변수 지정 */
    var button = buttons.children,
      target = e.target;

    // 버튼 꺼짐 상태일 때 동작 X
    if (target.className.indexOf("off") > 0) {
      return;
    }

    switch (target) {
      case button[0]: // 시작하기 버튼
        /* A. 버튼 토글하기
        표시 : 그만하기, 일시정지, 다시시작
        */
        arr_btn = [false, true, true, false, true];
        show_btn(arr_btn);
        /* B. AJAX로 값 가져오기 */
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'json/setPlay.json');
        xhr.send();

        xhr.onreadystatechange = function () {
          console.log("[" + xhr.status + "] : " + xhr.statusText);
          // 서버 응답 완료 && 정상 응답
          if (xhr.readyState !== XMLHttpRequest.DONE) return;

          if (xhr.status === 200) {
            parse_value = JSON.parse(xhr.responseText);
            /* C. 값을 정상적으로 가져왔을 때 그림 배치 */

            var image_url = parse_value.images,
              set_frame = "";

            for (var i = 0; i < image_url.length * 2; i++) {
              set_frame +=
                '<div class="card">' +
                '<div class="face face_front" data-card="' + i + '">F' + (i % 8) + '</div>' +
                '<div class="face face_back" style="background-image: url(' + image_url[(i % 8)] + ');">B' + (i % 8) + '</div>' +
                '</div>';
            }
            cards.innerHTML = set_frame;
            card_length = cards.children.length;

            /* D. 타이머 부분에 가져온 시간을 저장 */
            play_info.setAttribute("data-time", parse_value.time);

            /* E. 스코어 초기화 */
            game_score.setAttribute("data-score", 0);
            mix_image();

          } else {
            console.log("[" + xhr.status + "] : " + xhr.statusText);
          }
        }

        return;
      case button[1]: // 그만하기 버튼
        /* A. 버튼 토글하기
        표시 : 시작하기
        */
        arr_btn = [true, false, false, false, false];

        /* B. 초기 상태로 되돌리기 */
        play_info.textContent = "준비";
        cards.innerHTML = '<p>게임을 시작하려면 시작하기 버튼을 눌러주세요</p>';
        cards.className = "";
        clearInterval(intervalTime);
        game_score.setAttribute("data-score", 0);
        game_score.textContent = "Score :";
        play_info.setAttribute("data-time", parse_value.time);

        break;
      case button[2]: // 일시정지 버튼
        /* A. 버튼 토글하기
        표시 : 그만하기, 다시시작
        */
        arr_btn = [false, true, false, true, false];

        /* B. 버튼 동작 */
        clearInterval(intervalTime);
        cards.className = "off"

        break;
      case button[3]: // 다시시작 버튼
        /* A. 버튼 토글하기
        표시 : 그만하기, 일시정지, 다시섞기
        */
        arr_btn = [false, true, true, false, true];

        /* B. 버튼 동작 */
        cards.className = "on";
        intervalTime = setInterval(changeTime, 1000);

        break;
      case button[4]: // 다시섞기 (-5) 버튼
        /* A. 필요한 변수 선언하기 */
        var score = Number(game_score.getAttribute("data-score"));

        /* B. 버튼 토글하기
        표시 : 그만하기, 일시정지, 다시섞기
        */
        arr_btn = [false, true, true, false, true];

        /* C. 버튼 동작 */
        score -= 5;
        game_score.setAttribute("data-score", score);
        game_score.textContent = "Score : " + score;
        select_card = "";
        click_count = 0;
        clearInterval(intervalTime);
        show_btn(arr_btn);
        mix_image();
        return;
    }
    show_btn(arr_btn);
  });

  cards.addEventListener("click", function (e) {
    /* A. 지역변수 선언 */
    var target = e.target,
      target_card,
      target_index,
      face_front = cards.getElementsByClassName("face_front"),
      get_score = Number(game_score.getAttribute("data-score"));

    /* B. 동작 조건 체크 */
    if (click_count === 2) return;

    // 앞면을 클릭했을 때 카드 표시
    if (target.className.indexOf("face_front") > 0) {
      target_card = Number(target.getAttribute("data-card"));
      target_index = card_array.indexOf(target_card);
      target.className += " active";
    } else {
      // 뒷면을 클릭했을 때 종료
      return;
    }

    /* C-2. 두 번째 클릭일 때 동작 */
    if (click_count === 1) {
      click_count = 2;

      /* D-1. 두 카드가 같은 카드일 때 동작 */
      if (target_card % 8 === card_array[select_card] % 8) {
        get_score += 10;
        game_count++;
        target.className += " clear";
        face_front[select_card].className += " clear";
        select_card = "";
        click_count = 0;

        /* D-2. 두 카드가 다른 카드일 때 동작 */
      } else {
        get_score -= 5
        setTimeout(function () {
          target.className = "face face_front";
          (face_front[select_card]).className = "face face_front";
          select_card = "";
          click_count = 0;
        }, 1000);
      }
      /* E. 카드의 결과에 따라서 점수 설정 */
      game_score.textContent = "Score : " + get_score;
      game_score.setAttribute("data-score", get_score);

      /* F. 카드를 전부 찾았을 때 게임 종료 */
      if (game_count === 8) {
        game_count = 0;
        gameEnd();
      }
      /* C-1. 첫 번째 클릭일 때 동작 */
    } else {
      click_count = 1;
      select_card = target_index;
    }
  });

  function gameEnd() {
    clearInterval(intervalTime);
    /* A. 변수 선언 */
    var score = Number(game_score.getAttribute("data-score")),
      time = Number(play_info.getAttribute("data-time")),
      end_score = (score + time) + "점",
      end_time = (Number(parse_value.time) - time) + "초",
      end_name,
      temp_item = localStorage.getItem("score"),
      parse_name,
      end_string,
      set_string = "";

    /* B. 이름 가져오기 / 기록 세팅 */
    play_info.textContent = "총 Score는 " + end_score + "(" + score + "+" + time + ") 입니다.";
    end_name = prompt("게임이 종료되었습니다.\n이름을 입력해주세요\n(특수문자 |; )제외", "익명");
    parse_name = end_name.replace(/[\|\;]/g, "");
    end_string = parse_name + "|" + end_score + "|" + end_time;

    /* C. 최신 기록을 위로 올리기 */
    if (temp_item) {
      set_string = end_string + ";" + temp_item;
    } else {
      set_string = end_string;
    }

    /* D. 스토리지 정리 후 저장 및 재생성 */
    localStorage.clear();
    localStorage.setItem("score", set_string);
    score_board.innerHTML = "";
    set_scoreboard();

    /* E. 버튼 토글 */
    arr_btn = [true, false, false, false, false];
    show_btn(arr_btn);
  }

  /* 버튼 출력 */
  function show_btn(array) {
    var button = buttons.children;
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        button[i].className = "active";
      } else {
        button[i].className = "";
      }
    }
  }

  /* 시간 변환 */
  function changeTime() {
    var time = Number(play_info.getAttribute("data-time"));
    time--;
    play_info.setAttribute("data-time", time);
    play_info.textContent = "남은 시간 : " + time + "초";
    if (time < 1) {
      clearInterval(intervalTime);
      gameEnd();
      return;
    }
  }

  /* 이미지를 섞고 타이머를 시작 */
  function mix_image() {
    /* A. 지역변수 설정하기 */
    var random,
      temporary,
      card = cards.children,
      face_front = cards.getElementsByClassName("face_front"),
      button = buttons.children,
      mix_array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    /* B. 초기화 */
    mix_card = "";
    select_card = "";

    // 버튼 끄기
    for (var i = 0; i < arr_btn.length; i++) {
      button[i].className += " off";
    }

    /* C. 랜덤 배열을 이용해서 섞기 */
    for (var i = card_length - 1; i > -1; i--) {
      // 랜덤 배열 생성 (뒤에서부터)
      random = Math.floor(Math.random() * (i + 1));
      temporary = mix_array[i];
      mix_array[i] = mix_array[random];
      mix_array[random] = temporary;

      // 중간에 클릭된 카드 초기화
      face_front[mix_array[i]].className = face_front[mix_array[i]].className.replace(" active", "");

      // 배열을 이용해서 값 저장
      mix_card += '<div class="card">';
      mix_card += card[mix_array[i]].innerHTML;
      mix_card += '</div>';
    }

    /* D. 카드 설정하기 */
    cards.innerHTML = mix_card;

    // data-card를 이용해서 배열 생성
    for (var i = 0; i < card_length; i++) {
      card_array[i] = Number(face_front[i].getAttribute("data-card"));
    }

    /* E. 카드 보여주기 */
    cards.className = "on show";

    /* F. 3초 후 카드 숨김 */
    setTimeout(function () {
      cards.className = "on";
      intervalTime = setInterval(changeTime, 1000);
      for (var i = 0; i < arr_btn.length; i++) {

        button[i].className = button[i].className.replace(" off", "");
      }
    }, 3000);

    /* G. 카운트다운 */
    for (var i = 0; i < 4; i++) {
      (function (x) {
        setTimeout(function () {
          play_info.textContent = x < 3 ? "시작 " + (3 - x) + "초 전" : "게임 시작";
        }, 1000 * x);
      })(i);
    }
  }

  /* 스코어보드 출력 */
  function set_scoreboard() {
    /* A. 변수 선언 */
    var score_item = localStorage.getItem("score"),
      score_text = "<div><span>이름</span><span>Score</span><span>소요시간</span></div>",
      split_item = [];

    /* B-1. 값이 있는지 체크 */
    if (score_item) {
      var split_score = score_item.split(/\;/g);

      /* C-1. 값이 있으면 값 출력 */
      for (var i = 0; i < split_score.length; i++) {
        split_item[i] = split_score[i].split(/\|/g);
        score_text += "<div><span>" + (split_item[i][0] || "-") + "</span><span>" + (split_item[i][1] || "-") + "</span><span>" + (split_item[i][2] || "-") + "</span></div>";
      }
      score_board.innerHTML = score_text;

    } else {
      /* C-2. 값이 없으면 기본적인 프레임 출력 */
      score_board.innerHTML = score_text;
    }
  };

  /* 가장 처음 스코어보드 출력 */
  set_scoreboard();
});