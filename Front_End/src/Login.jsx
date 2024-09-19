import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Axios 인터셉터 설정 (중복 제거)
  useEffect(() => {
    axios.interceptors.request.use((config) => {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        config.headers['Session-Id'] = sessionId; // 요청 헤더에 세션 ID 추가
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
  }, []);

  // 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/user/sign-in?email=${formData.email}&password=${formData.password}`);
      
      // 로그인 성공 시 토큰 및 세션 ID 저장
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('sessionId', response.data.sessionId);

      //alert(formData.email);
      navigate('/write', { state: { email: formData.email } });
      //navigate('/main');  // 메인 페이지로 이동
    } catch (error) {
      console.error('Login failed:', error);  // 에러 처리
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">로그인</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  로그인
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
