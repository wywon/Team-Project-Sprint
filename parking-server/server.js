const express = require("express");
const oracledb = require("oracledb");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Oracle 연결 정보
const dbConfig = {
    user: "parking",
    password: "parking1234",
    connectString: "localhost:1521/XEPDB1"
};

// 테스트
app.get("/", (req, res) => {
    res.send("Parking Server OK");
});

// 주차장 정보 조회 API
app.get("/api/parking", async (req, res) => {

    let connection;

    try {

        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(`
            SELECT
                space_number,
                is_occupied,
                updated_at
            FROM parking_spaces
            ORDER BY id
        `);

        const spaces = result.rows.map(row => ({
            spaceNumber: row[0],
            occupied: row[1] === 1,
            updatedAt: row[2]
        }));

        const occupiedSpaces =
            spaces.filter(space => space.occupied).length;

        res.json({
            totalSpaces: spaces.length,
            occupiedSpaces: occupiedSpaces,
            availableSpaces: spaces.length - occupiedSpaces,
            spaces: spaces
        });

    } catch (error) {

        console.error("Oracle 오류:", error);

        res.status(500).json({
            error: "Database error"
        });

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

app.listen(3000, "0.0.0.0", () => {
    console.log("=================================");
    console.log("Parking API Server 실행");
    console.log("http://localhost:3000/api/parking");
    console.log("=================================");
});