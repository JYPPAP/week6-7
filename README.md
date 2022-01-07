## 문제점.
1. 전역변수가 너무 많다.
  - 변수를 지역변수로 옮길만한 것들은 싹 다 옮기기.

4. IE에서 정상적으로 동작하는지 확인해봐야 함.
  - 예를들어 backface-visibility 속성의 경우 10부터 지원되기 때문에 IE9 호환성 관련된 부분에 대한 해결방안.
  - innerHTML이 호환 안됌 읽어오는건 되는것 같은데 쓰기가 안돼는 것 같음.
  - display:none 처리하는 부분으로 수정하기
  - 그럼 뒤집는 효과는 어떻게?
  - 
6. 버튼별 기능이 완료되지 않은 것 같다.
  > 일단 여러가지 클릭해가면서 완료한 상태이며, 추가적인 문제점을 찾아야 한다.
  - 버튼을 클릭했을 때, 3초 후에 버튼을 다시 보여주고 있는데, 그 부분을 해결할 방법을 찾아보기.

7. 버튼을 클릭했을 때 버튼별로 배열을 지정하고 함수를 통해서 버튼을 출력할 수 있도록 만들기
  > 완료.

12. 버튼 클릭시 동작에 대해서 조금 더 수정해야 함
  - 3, 2, 1 카운트다운일 때 버튼 클릭시 거의 모든 버튼에서 오류 발생
  > 카운트 하는동안 버튼을 숨기는 방향으로 작성

13. setTimeout이 아닌 다른 방법을 사용해서 동작해볼 수 있도록 만들기.
  - 또는 예외처리, try catch를 사용하는 방안에 대해서 생각해보기.

!! ajax 부분을 메소드 형태로 바꿔보기.
14. 버튼 클릭하는 부분 하나로 합치기 ( 이벤트리스너 줄이기)

15. data- 속성 사용하기

16. Score를 문자열로 변환 후 저장할 때 구분자 변경하기
. 만 사용하고, 3개만 조사하는게 아니라 |로 분리하고 마지막은 ;로 나눌 수 있도록 만들기
> 값이 추가되어도 확장성을 가질 수 있도록 만들기.     






** 빠르게 수정해야 할 사항
1. 제한시간 1 씩 줄어들게 하는 것
2. 다시섞기를 했을 때, clear한 요소에 대한 처리
3. 그만하기를 클릭했을 때의 동작
  - 일단 임시로 새로고침 할 수 있도록 작성함.
## 동작 순서
1. 로딩이 완료되면 localStorage에서 점수 값이 있는지 확인한다.
  - 값이 있다면 
    - 배열로 만든 후 %3=0일 때만 값을 출력한다.
    - %3!=0 일 때는 alert 가져온 값에 오류가 있습니다. 를 출력한다.
  - 값이 없다면
    - 저장된 score가 없음을 로그로 출력한다.

* 처음 열었을 때는 score가 없을 수 있다.(첫 실행). 하지만 값을 저장했을 때 3개짜리 배열을 저장하지만 저장된 값을 정상적으로 불러오지 못했을 경우를 생각해서 %3 =0 일 경우 경고창이 출력될 수 있도록 만들었다.

2. 랜덤 배열 생성.
  - 0-15까지 for문을 이용해 배열을 생성
  - 저장하는 값을 i%8+1로 해서 1~8까지 2번씩 저장될 수 있도록 만들었다.
  - shuffle 함수를 이용해서 배열을 섞어준다.
  - 이 배열은 나중에 이미지를 랜덤으로 섞을 때 사용할 예정이다.

3. 시작하기 버튼을 클릭
  - 숨겨두었던 버튼을 보여주고, 시작하기 버튼을 숨긴다.
  - playWrap내부의 텍스트를 숨기고 AJAX를 통해 이미지를 배치한다.
    - 배치한 이미지를 랜덤으로 섞어서 배치하고 3초동안 보여준다.
    - 3초 후 모든 이미지를 숨긴다.
  - "준비" 텍스트가 위치한 곳에서 3, 2, 1 카운트를 시작한다.
    - 카운트가 종료되면 제한시간 : ~~초 를 출력한다.
      - ~~는 AJAX로 가져온 값이 입력되어 있으며 1초마다 1 씩 줄어들고 0이되면 게임이 종료된다.
      - 게임이 끝났을 때 남은 시간은 점수에 합산된다.

4. 카드를 선택했을 때
  - 클릭한 카드가 clear 클래스가 없다면 뒷면을 보여준다.
    - 현재 선택한 카드를 prevCard에 저장한다.
  - 카드의 값과 clear를 동기화하는 방법은 뭘까?
  - front에 클래스를 부여하고 형제선택자를 통해서 값이 적용될 수 있도록 만드는 방향으로 css를 수정하고
  - 다시섞기를 할 때 카드 내부에 있는 HTML을 전부 문자열로 한 다음 이동하는 방향으로 만들면 될 것 같음.
  - 반복문을 통해서 전체 갯수만큼 반복, 랜덤으로 섞는 부분은 다시 배열을 shuffle
5. 타이머 줄이기
  - 시작하기 버튼을 눌렀을 때 기존의 "준비"는 없어지고 그 자리에 3, 2, 1 카운트를 출력한다.
  3, 2, 1 카운트의 출력이 끝나면 ajax를 통해 입력된 제한시간이 출력되며 제한시간은 1초마다 1씩 줄어드는 형태로 제작한다.
  - ajax를 통해 입력된 값을 어떻게 가져올지에 대해서 생각을 해봐야 할 것 같다.
  - 카운트가 종료된 후 입력이 되어야 한다.
  - 카운트를 목적으로 하는 부분을 생성 후 카운트가 종료되면 제거하거나 숨길 수 있도록 만들면 될까?


## 21.11.30 - 21.12.01
#### 답변사항
과제 가이드에 있는 내용입니다.
1. JSON 파일 직접 작성하기
2. JSON 내부에는 제한시간(초)와 이미지의 경로만 존재하면 된다. 또한 이미지는 8개로 한다. 
----------
#### 제작관련 고민
1. 그림 랜덤 배치
  1. 0-15의 숫자가 저장된 배열을 생성한다.
  이거를 0-15가 한 번씩만 들어간 배열을 생성한다음 인덱스 0번부터 15번까지를 위치잡는데 사용
  2. ajax를 통해서 시간과 이미지의 경로를 가져온다.
  3. 시간과 이미지를 변수에 저장한다.
  4. 반복문을 사용해 배치한다.
  - Math.random(범위는 0-15)을 이용해서 랜덤한 숫자를 생성하고 randomIndex 변수에 저장한다.
  - 저장할 때 randomIndex가 인덱스 값이 되며, 해당 인덱스 값에 innerHTML로 img태그를 저장하고, randomIndex의 값에 저장된 숫자를 제거(slice 이용?)해서 전체 갯수를 줄인다.
  전체 개수 = i번만큼 줄어든다.

  ? 랜덤 숫자의 인덱스값에는 공백 또는 0을 넣는다.
  ?? 
  - 이미지 8개를 Math.random을 이용해서 (card.length - i개)를
  push와 같은 기능을 이용해서 넣는다.
** 선택할 때 클릭한 요소의 인덱스값 가져오는 방법 찾아보기.
2. 동작 순서
  1. 초기화
  ? 일단 처음 시작했을 때 초기화하는 부분..
  - LocalStorage에서 값이 있는지 확인 후 있다면 가져와서 추가하기
    - 이름, 점수, 시간값.
    > 완성
  - 시작하기 버튼을 클릭했을 때.
    - 시작하기 버튼 숨기기, 일시정지, 다시섞기, 그만하기 버튼 보이기.
    > 완성
    - 초기값으로 초기화하기.
      - 아직 미정. 초기값을 어떤것으로 할 것인지 확정하지 못함.
    - AJAX를 사용해 그림 목록 및 제한시간 데이터 요청하고, 그림 나열하기
    > 그림목록 가져오고, 나열까지는 완성.
    + 제한시간 데이터 사용부분은 아직 안함.
      - 목록을 가져올 때 for문 밖으로 innerHTML을 뺄 수 있는 방법에 대해서 생각해보기.
    - CSS를 활용하여 카드의 앞/뒤 구별을 표현하고 JS를 활용하여 랜덤으로 이미지 나열하기
      - 랜덤으로 이미지 나열하는 부분에서 고민.
      - 현재는 랜덤으로 0-15까지 중복되지 않은 숫자가 저장된 배열을 통해서 이미지를 배열하려고 하지만 어떻게 해야 할 것인지에 대해서 고민을 좀 더 해봐야 할 것 같음.
        0부터 15까지 저장된 배열이 있고 랜덤한 숫자 2개를 만들어서 인덱스로 랜덤1번 인덱스에 있는 숫자를 랜덤2번 인덱스로 2개의 숫자를 교체하는 방법으로 제작하는것도 괜찮은 것 같음.
        아니면 랜덤 인덱스번호를 추출해서 뒤에다가 넣는 방법을 여러차례 반복하면 괜찮을 것 같음.
      > 0-15의 숫자가 중복없이 랜덤으로 정렬된 배열 생성 완료.
    - 랜덤 배열을 이용해서 아이템 배치하기.
      ? 어떻게???
      ?? 랜덤인덱스 앞에서부터 숫자를 가져다가
      i번째에 위치한 값의 card를 제거했다가 뒤에서부터 추가하는 방법을 통해서? 이렇게 하면 한번 더 섞이는 느낌으로다가 만들면 될까?
    > 배치 완료.

완료는 짝이 맞았을 때 체크하며 짝이 맞았을 때 카운트를 1씩 올려주며, 8이 되면 prompt를 띄우기.
프롬프트로 입력받은 값을 이름으로 하고
따로 저장한 점수와 시간을 배열의 형태로 묶은 뒤 로컬스토리지에 저장한다.

** 기본값 설정하기
  ||를 이용하면 앞의 값이 0, undefined, "" 등의 값이 출력되는것을 방지할 수 있게된다.
ex)
text = text || "빈 문자열";
## 21.11.29 같은 그림 찾기 제작시작
#### 구현
1. 화면 구성
  같은 그림 찾기 글자
    - span
  시작하기 버튼
    - button
    - 그만하기, 일시정지, 다시시작, 다시섞기는 숨김 처리.
  Score : 0
    - h6, 파란색, 초기값 0
  준비
    - 나중에 제한시간이 표시될 영역
      - 제한시간 : ~~초
    - 결과값 출력될 영역
      - 총 Score는 ~~점(40 + 0) 입니다.
      를 출력
  큰 회색 네모 모양의 영역 (나중에 그림이 추가)
    - 시작하기를 누르면 4*4 아이템과 내부에 격자가 생기고, 아이템 중앙에 ?
  로그 영역
  th태그 이름 Score 소요시간
  - js를 이용해서 아래에 값 추가
  - 이름은 입력받고, Score, 소요시간은 저장된 값을 넣어준다.

2. 게임 시작
  1. 시작하기 클릭 시 같은 그림 찾기 게임이 시작.
    - 시작하기 버튼이 사라지고 일시정지, 다시섞기, 그만하기 버튼이 노출
  2. AJAX를 사용해 그림 목록 및 제한시간 데이터를 요청하고, 해당 데이터를 활용하여 그림을 나열
  3. CSS를 활용하여 카드의 앞/뒤 구별을 표현하고 자바스크립트를 활용하여 랜덤으로 이미지 나열.
  4. 3초간 그림 배치를 노출.
  5. 3초동안 그림 배치를 보여준 후 이미지를 뒤집는다.
  
  회색 영역에 4*4로 중앙에 ? 모양
3. 카드 클릭 시 뒤집기 이벤트를 구현한다.

4. 게임 그만하기
  - "그만하기" 클릭 시 게임이 종료되고 초기 화면으로 돌아간다.

5. 게임 일시정지
  - "일시정지" 클릭 시 타이머가 중지되며, 모든 게임 동작이 중지된다. "다시시작" 버튼이 노출된다.
  - "다시시작" 클릭 시 타이머가 재동작하며, 게임을 다시 시작할 수 있다.

6. 카드 다시섞기
  - "다시섞기" 클릭 시 score에서 -5점을 차감하며, 이미 찾은 카드를 제외한 나머지 카드들을 재배치한다.
  - 재배치된 카드를 3초간 보여준 후 다시 뒤집는다.
  - 일시정지 중에는 실행될 수 없다.
  
7. 게임 종료
  - 타이머 종료 또는 같은 그림 찾기가 모두 완료되면 게임이 종료된다.
  - 집계된 score에 잔여 시간을 더한 최종 score값을 상태 바에 노출한다.
    - 확인한 카드(카드 1짝당 10점 + 시간 점수)
  - 같은 그림을 모두 찾은 경우 prompt 창을 노출하여 이름을 입력 받는다. 이름을 입력하면 localStorage에 이름과 소요시간을 저장하고 우측 로그 영역에 결과를 출력한다. 참여 내역을 로그로 계속 쌓는다.
