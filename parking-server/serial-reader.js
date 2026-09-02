const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const oracledb = require("oracledb");

// ===== Oracle 연결 정보 =====
const dbConfig = {
    user: "parking",
    password: "parking1234",
    connectString: "localhost:1521/XEPDB1"
};

// ===== Arduino COM 포트 =====
// 이전에 COM4를 사용했다면 우선 COM4로 테스트
const port = new SerialPort({
    path: "COM4",
    baudRate: 9600
});

const parser = port.pipe(
    new ReadlineParser({
        delimiter: "\r\n"
    })
);

// ===== Arduino 연결 확인 =====
port.on("open", () => {
    console.log("Arduino Serial 연결 성공");
    console.log("COM4 / 9600 baud");
});

port.on("error", (error) => {
    console.error("Serial 오류:", error.message);
});


// ===== Arduino 데이터 수신 =====
parser.on("data", async (data) => {

    const message = data.trim();

    console.log("수신:", message);

    // P1,1 또는 P1,0 형식만 처리
    const parts = message.split(",");

    if (parts.length !== 2) {
        return;
    }

    const spaceNumber = parts[0];
    const occupied = Number(parts[1]);

    // P1 ~ P10 형식 검증
    if (!/^P([1-9]|10)$/.test(spaceNumber)) {
        console.log("잘못된 주차칸:", spaceNumber);
        return;
    }

    // 0 또는 1만 허용
    if (occupied !== 0 && occupied !== 1) {
        console.log("잘못된 상태값:", occupied);
        return;
    }

    let connection;

    try {

        connection = await oracledb.getConnection(dbConfig);

        await connection.execute(
            `
            UPDATE parking_spaces
            SET
                is_occupied = :occupied,
                updated_at = CURRENT_TIMESTAMP
            WHERE space_number = :spaceNumber
            `,
            {
                occupied: occupied,
                spaceNumber: spaceNumber
            },
            {
                autoCommit: true
            }
        );

        console.log(
            `${spaceNumber} DB 업데이트 완료 → ${occupied === 1 ? "OCCUPIED" : "AVAILABLE"}`
        );

    } catch (error) {

        console.error("Oracle 오류:", error);

    } finally {

        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error(error);
            }
        }
    }
});