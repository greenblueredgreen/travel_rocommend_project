import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Main = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h1 className="text-center">메인 페이지</h1>
          <p className="text-center">로그인 또는 회원가입이 완료되었습니다.</p>
          {/* 여기에 메인 페이지의 추가 내용을 구현*/}
        </Col>
      </Row>
    </Container>
  );
};

export default Main;
