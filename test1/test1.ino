// ==========================================
// Arduino UNO #1
// 주차면 1, 2, 3
// HC-SR04 3개
// 빨강/초록 LED 각 3개
// ==========================================

// ---------- 주차면 1 ----------
const int TRIG_1 = 2;
const int ECHO_1 = 3;
const int RED_1   = 8;
const int GREEN_1 = 9;

// ---------- 주차면 2 ----------
const int TRIG_2 = 4;
const int ECHO_2 = 5;
const int RED_2   = 10;
const int GREEN_2 = 11;

// ---------- 주차면 3 ----------
const int TRIG_3 = 7;
const int ECHO_3 = 6;
const int RED_3   = 12;
const int GREEN_3 = 13;


// 차량 감지 기준 거리
const int PARKING_DISTANCE = 20;  // cm


// ==========================================
// 초음파 거리 측정 함수
// ==========================================
long getDistance(int trigPin, int echoPin) {

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);

  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);

  // 측정 실패
  if (duration == 0) {
    return 999;
  }

  return duration * 0.034 / 2;
}


// ==========================================
// 주차 LED 상태 변경
// ==========================================
void setParkingLED(bool occupied, int redPin, int greenPin) {

  if (occupied) {
    // 차량 있음
    digitalWrite(redPin, HIGH);
    digitalWrite(greenPin, LOW);
  }
  else {
    // 빈자리
    digitalWrite(redPin, LOW);
    digitalWrite(greenPin, HIGH);
  }
}


void setup() {

  Serial.begin(9600);

  // 초음파센서
  pinMode(TRIG_1, OUTPUT);
  pinMode(ECHO_1, INPUT);

  pinMode(TRIG_2, OUTPUT);
  pinMode(ECHO_2, INPUT);

  pinMode(TRIG_3, OUTPUT);
  pinMode(ECHO_3, INPUT);

  // LED
  pinMode(RED_1, OUTPUT);
  pinMode(GREEN_1, OUTPUT);

  pinMode(RED_2, OUTPUT);
  pinMode(GREEN_2, OUTPUT);

  pinMode(RED_3, OUTPUT);
  pinMode(GREEN_3, OUTPUT);
}


void loop() {

  // ------------------------
  // 센서 1
  // ------------------------
  long distance1 = getDistance(TRIG_1, ECHO_1);

  delay(60);

  // ------------------------
  // 센서 2
  // ------------------------
  long distance2 = getDistance(TRIG_2, ECHO_2);

  delay(60);

  // ------------------------
  // 센서 3
  // ------------------------
  long distance3 = getDistance(TRIG_3, ECHO_3);

  delay(60);


  // 차량 감지
  bool parking1 = distance1 <= PARKING_DISTANCE;
  bool parking2 = distance2 <= PARKING_DISTANCE;
  bool parking3 = distance3 <= PARKING_DISTANCE;


  // LED 상태 변경
  setParkingLED(parking1, RED_1, GREEN_1);
  setParkingLED(parking2, RED_2, GREEN_2);
  setParkingLED(parking3, RED_3, GREEN_3);


  // ------------------------
  // 시리얼 모니터
  // ------------------------

  Serial.print("1번: ");
  Serial.print(distance1);
  Serial.print("cm / ");
  Serial.print(parking1 ? "주차중" : "빈자리");

  Serial.print(" | ");

  Serial.print("2번: ");
  Serial.print(distance2);
  Serial.print("cm / ");
  Serial.print(parking2 ? "주차중" : "빈자리");

  Serial.print(" | ");

  Serial.print("3번: ");
  Serial.print(distance3);
  Serial.print("cm / ");
  Serial.println(parking3 ? "주차중" : "빈자리");

  delay(500);
}