require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios"); // 🔥 안정적인 API 요청을 위해 axios 사용
const path = require("path");

const app = express();
app.use(express.json());

// ✅ CORS 설정 (Netlify 프론트엔드에서만 요청 허용)
const FRONTEND_URL = "https://signcollector.netlify.app"; // Netlify 도메인으로 변경
app.use(cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
}));

// ✅ 환경 변수에서 Google OAuth 설정 불러오기
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "https://signcollector.netlify.app/callback.html"; // Netlify 리디렉트 URI

// ✅ `public` 폴더를 정적 파일 제공 폴더로 설정
app.use(express.static(path.join(__dirname, "public")));

// ✅ 루트(`/`) 요청 시 `index.html` 반환
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Google 로그인 요청 (OAuth URL 생성)
app.get("/login", (req, res) => {
    const scope = encodeURIComponent("openid email profile");
    const responseType = "code";

    // 🔥 Google OAuth 로그인 URL 생성
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${responseType}&scope=${scope}&access_type=offline`;

    console.log("✅ 생성된 Google OAuth URL:", authUrl);  
    res.redirect(authUrl); // ✅ Google 로그인 페이지로 이동
});

// ✅ Google OAuth 콜백: Authorization Code를 받아 Access Token 요청
app.post("/auth/google", async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Authorization Code가 없습니다." });
    }

    try {
        // 🔥 Google 서버에 Authorization Code를 보내서 Access Token 요청
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", new URLSearchParams({
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code"
        }).toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const { access_token } = tokenResponse.data;
        console.log("🔑 Google Access Token:", access_token);

        if (access_token) {
            res.json({ access_token });
        } else {
            res.status(400).json({ error: "Google Access Token 요청 실패", details: tokenResponse.data });
        }

    } catch (error) {
        console.error("❌ Google OAuth 토큰 요청 오류:", error);
        res.status(500).json({ error: "서버 오류" });
    }
});

// ✅ 서버 실행 (Render에서 자동으로 PORT 할당)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 백엔드 서버 실행 중: http://localhost:${PORT} (Render 배포 환경 지원)`);
});
