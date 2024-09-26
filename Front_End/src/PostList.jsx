import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Calendar from 'react-calendar'; // 캘린더 컴포넌트 import
import 'react-calendar/dist/Calendar.css'; // 캘린더 스타일 import
import './App.css';

function PostList() {
  //여행 계획 리스트
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/post/api/post-list?email=${email}`);
      if (!response.ok) {
        throw new Error("게시물을 불러오는데 실패했습니다");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 계획 삭제 함수
  const handleDelete = async (postId, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/post/delete?postId=${postId}`, {
          method: "DELETE",
        });
        
        // 서버에서 응답 확인
        const data = await response.json();
        if (response.ok && data.code === 200) {
          // 게시물 목록에서 삭제된 게시물 필터링
          setPosts(posts.filter((post) => post.id !== postId));
          setShowModal(false);  // 모달 닫기
        } else {
          throw new Error(data.result || "게시물 삭제에 실패했습니다");
        }
      } catch (error) {
        setError(error.message);  // 오류 처리
      }
    }
  };

  //수정함수
  const handleEdit = () => {
    setEditMode(true);
    setEditedTitle(selectedPost.subject);
    setEditedContent(selectedPost.content);
  };

  //수정 후 저장함수 api확인!!
  const handleSave = async () => {
    try {
      const response = await fetch(`/post/update?postId=${selectedPost.id}&subject=${encodeURIComponent(editedTitle)}&content=${encodeURIComponent(editedContent)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
        }),
      });
      if (response.ok) {
        // const updatedPosts = posts.map(post =>
        //   post.id === selectedPost.id
        //     ? { ...post, title: editedTitle, content: editedContent }
        //     : post
        // );
        // setPosts(updatedPosts);
        // setSelectedPost({ ...selectedPost, title: editedTitle, content: editedContent });
        // setEditMode(false);
        setPosts(posts.map(post => 
          post.id === selectedPost.id
            ? { ...post, subject: editedTitle, content: editedContent } // 수정된 부분
            : post
        ));
        setSelectedPost({ ...selectedPost, subject: editedTitle, content: editedContent });
        setEditMode(false);
      } else {
        const data = await response.json();
        throw new Error("게시물 수정에 실패했습니다");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRowClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    setEditMode(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    setEditMode(false);
  };

  if (loading)
    return (
      <div className="container mt-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">로딩중...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="container mt-4 alert alert-danger">에러: {error}</div>
    );
  if (posts.length === 0)
    return (
      <div className="container mt-4 alert alert-info">게시물이 없습니다</div>
    );

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
              className="btn btn-success"
              onClick={() => navigate("/planner", { state: { email: email } })}
            >
              글쓰기
            </button>
          </div>
        </div>
      </nav>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">게시물 목록</h2>
          <ul className="list-group">
            {posts.map((post) => (
              <li
                key={post.id}
                className="list-group-item d-flex justify-content-between align-items-start"
                onClick={() => handleRowClick(post)}
                style={{ cursor: 'pointer' }}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold mb-2 mt-2">{post.subject}</div>
                  {post.content.substring(0, 50)}...
                </div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={(e) => handleDelete(post.id, e)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "게시물 수정" : selectedPost?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editMode ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>제목</Form.Label>
                <Form.Control
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>내용</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </Form.Group>
            </Form>
          ) : (
            <>
              <div className="mb-3">
                <h5 className="mb-3">제목</h5>
                <p>{selectedPost?.subject}</p>
              </div>
              <div>
                <h5 className="mb-3">내용</h5>
                <p>{selectedPost?.content}</p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {editMode ? (
            <Button variant="primary" onClick={handleSave}>
              저장
            </Button>
          ) : (
            <Button variant="primary" onClick={handleEdit}>
              수정
            </Button>
          )}
          <Button variant="danger" onClick={(e) => handleDelete(selectedPost?.id, e)}>
            삭제
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 캘린더 추가 시작 */}
      <div className="calendar-container mt-4">
        <h3 className="mb-4">캘린더</h3>
        <Calendar />
      </div>
      {/* 캘린더 추가 끝 */}

    </div>
  );
}

export default PostList;