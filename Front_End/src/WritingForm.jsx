import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
// 상단 import 추가
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WritingForm = () => {
  // state 추가
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleClear = () => {
    setSubject("");
    setContent("");
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleSave = async () => {
    const params = new URLSearchParams({
      subject,
      content,
      email,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    try {
      const response = await fetch(
        `http://localhost:8080/post/create?${params.toString()}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        alert("글이 저장되었습니다!");
        navigate("/main", { state: { email: email } });
      } else {
        alert("저장 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">여행 플래너</span>
          <div className="navbar-nav ms-auto">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => navigate("/main", { state: { email: email } })}
            >
              홈으로
            </button>
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => navigate("/mypage", { state: { email: email } })}
            >
              마이페이지
            </button>
            <button
              className="btn btn-outline-info"
              onClick={() => navigate("/PostList", { state: { email: email } })}
            >
              목록으로
            </button>
          </div>
        </div>
      </nav>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">나의 여행 계획</h2>
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="여행 제목 (예: 서울 3박 4일 여행)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          {/* return 문 내부의 form에 DatePicker 추가*/}
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label">시작일</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="form-control"
                dateFormat="yyyy/MM/dd"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">종료일</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="form-control"
                dateFormat="yyyy/MM/dd"
                minDate={startDate}
              />
            </div>
          </div>
          <div className="mb-3">
            <textarea
              rows="10"
              className="form-control"
              placeholder="여행 계획을 자세히 적어보세요. (장소, 일정, 예산 등)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" onClick={handleClear}>
              초기화
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingForm;
