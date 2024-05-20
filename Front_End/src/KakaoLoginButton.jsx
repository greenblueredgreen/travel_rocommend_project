import React from 'react';
import KakaoLogin from 'react-kakao-login';
import axios from 'axios';
import './MBTITest.css';

const KakaoLoginButton = () => {
  const kakaoClientId = '2cb00a30f455e32e215271404e61327e';

  const handleLoginSuccess = async (response) => {
    const { access_token } = response;

    try {
      const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const userId = userResponse.data.id;
      const userEmail = userResponse.data.kakao_account.email;
      const userNickname = userResponse.data.properties.nickname;

      // 서버에 회원가입 처리 로직 구현
      const signupResponse = await axios.post('/api/signup', {
        userId,
        userEmail,
        userNickname,
      });

      console.log('회원가입 성공', signupResponse.data);
      
    } catch (error) {
      console.error('회원가입 실패', error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error('카카오 로그인 실패', error);
  };

  return (
    <div className="kakao-login-button-wrapper">
      <KakaoLogin
        token={kakaoClientId}
        onSuccess={handleLoginSuccess}
        onFail={handleLoginFailure}
        render={({ onClick }) => (
          <button className="kakao-login-button" onClick={onClick}>
            카카오톡으로 회원가입
          </button>
        )}
      />
    </div>
  );
};

export default KakaoLoginButton;