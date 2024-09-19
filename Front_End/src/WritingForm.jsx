import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useLocation, useNavigate} from "react-router-dom";

const WritingForm = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 여기서 useNavigate() 호출하여 navigate 변수에 할당
  const email = location.state?.email;
  //alert(email);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleClear = () => {
    setSubject(''); // 제목 초기화
    setContent(''); // 내용 초기화
  };

  // 저장 버튼 클릭 시 호출되는 함수
  const handleSave = async () => {
    const params = new URLSearchParams({
      subject: subject,
      content: content,
      email: email,
    });

    try {
      const response = await fetch(`http://localhost:8080/post/create?${params.toString()}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('글이 저장되었습니다!');
        navigate('/main', { state: { email: email } });
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  //main페이지로 이동하는 버튼 만들기
  const handleNavigateToMain = () => {
    navigate('/main'); // /main 경로로 이동
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h1 className="mb-4">글쓰기</h1>
        
          <div className="row mb-3">
            <div className="col-md-8">
              <input
                  type="text"
                  id="subject"
                  className="form-control"
                  placeholder="제목을 입력하세요"
                  value={subject}  
                  onChange={(e) => setSubject(e.target.value)}
                />
            </div>
          </div>
          
          <textarea
            rows="10"
            id="content"
            className="form-control mb-3"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="d-flex justify-content-between">
            <button
              type="button"
              id="postListBtn"
              className="btn btn-dark"
            >
              목록
            </button>
            
            <div>
              <button
                type="button"
                id="clearBtn"
                className="btn btn-secondary me-2"
                onClick={handleClear} // 이 부분에서 handleClear 함수 연결
              >
                모두 지우기
              </button>
              <button
                type="button"
                id="saveBtn"
                className="btn btn-warning"
                onClick={handleSave}  // 저장 버튼에 handleSave 연결
              >
                저장
              </button>
              <button
                type="button"
                className="btn btn-primary ms-2"
                onClick={handleNavigateToMain} // 새 버튼 클릭 시 메인화면으로 이동
              >
                main화면으로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingForm;