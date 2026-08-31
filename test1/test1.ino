// ===== 핀 설정 =====

// 초록 LED
const int greenLED = 4;

// 빨간 LED
const int redLED = 5;

// HC-SR04
const int trigPin = 9;
const int echoPin = 10;

// 차량 감지 기준 거리
const float detectionDistance = 30.0;


void setup() {

  // LED 출력 설정
  pinMode(greenLED, OUTPUT);
  pinMode(redLED, OUTPUT);

  // 초음파 센서 설정
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // 시리얼 모니터
  Serial.begin(9600);
}


void loop() {

  // ===== 초음파 발사 =====

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);

  digitalWrite(trigPin, LOW);


  // ===== 돌아오는 초음파 시간 측정 =====

  long duration = pulseIn(echoPin, HIGH, 30000);


  // ===== 거리 계산 =====

  float distance = duration * 0.0343 / 2;


  // ===== 시리얼 모니터 출력 =====

  Serial.print("Distance : ");
  Serial.print(distance);
  Serial.println(" cm");


  // ===== 주차 여부 판단 =====

  if (distance > 0 && distance <= detectionDistance) {

    // 차량 있음
    digitalWrite(greenLED, LOW);
    digitalWrite(redLED, HIGH);

    Serial.println("P1 : OCCUPIED");

  } else {

    // 빈자리
    digitalWrite(greenLED, HIGH);
    digitalWrite(redLED, LOW);

    Serial.println("P1 : AVAILABLE");
  }


  delay(300);
}