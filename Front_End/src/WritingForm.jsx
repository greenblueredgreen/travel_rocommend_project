import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const WritingForm = () => {
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
              />
            </div>
            <div className="col-md-4">
              <input
                type="file"
                id="file"
                accept=".jpg, .png, .gif"
                className="form-control form-control-sm"
              />
            </div>
          </div>
          
          <textarea
            rows="10"
            id="content"
            className="form-control mb-3"
            placeholder="내용을 입력하세요"
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
              >
                모두 지우기
              </button>
              <button
                type="button"
                id="saveBtn"
                className="btn btn-warning"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingForm;