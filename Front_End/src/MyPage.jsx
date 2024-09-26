import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // email 값을 받아오기
  //alert(email);
  const [userInfo, setUserInfo] = useState({
    email: '',
    // 추후 추가
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email'); // 로그인 시 이메일도 저장했다고 가정
      if (!token || !email) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/user/info?email=${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        // 오류 처리 (예: 토큰 만료 시 로그아웃)
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          navigate('/login');
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">마이페이지</h2>
              <Row className="mb-3">
                <Col sm={3}>
                  <strong>이메일:</strong>
                </Col>
                <Col sm={9}>{email}</Col>
              </Row>
              {/* 추후 추가될 수 있는 사용자 정보 필드들 */}
              <div className="d-flex justify-content-between mt-4">
                <Button variant="outline-primary" onClick={() => navigate('/main', { state: { email: email } })}>
                  홈으로
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/PostList', { state: { email: email } })}>
                  플래너
                </Button>
                <Button variant="danger" onClick={handleLogout}>
                  로그아웃
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyPage;