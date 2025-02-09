document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.querySelector('.login-button.google');

    loginButton.addEventListener('click', function() {
        const clientId = '233020625461-eu3jcm65pln92ph2p6ud3mfeqb86e7gj.apps.googleusercontent.com';
        const redirectUri = "https://signcollector.netlify.app/callback.html"; // ✅ Netlify URL로 변경
        const scope = encodeURIComponent('openid email profile'); // ✅ 추가: OpenID 연결
        const responseType = 'code';  // 🔥 변경: OAuth 2.0 최신 정책 적용

        // ✅ Google OAuth 로그인 URL
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=offline`;

        console.log('🔗 Google OAuth URL:', authUrl); // ✅ URL이 정상적으로 생성되는지 확인

        console.log('Generated Google OAuth URL:', authUrl);  // 이 줄을 추가했습니다.

        window.location.href = authUrl;
    });
});
