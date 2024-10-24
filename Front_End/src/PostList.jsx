import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// 상단 import 추가
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function PostList() {
  // state 추가
  const [editedStartDate, setEditedStartDate] = useState(null);
  const [editedEndDate, setEditedEndDate] = useState(null);

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

  // calendar events 변환 함수 추가
  const calendarEvents = posts.map((post) => ({
    id: post.id,
    title: post.subject,
    start: post.startDate,
    end: post.endDate,
    extendedProps: {
      content: post.content,
    },
  }));

  // 삭제 함수 api확인!!
  const handleDelete = async (postId, e) => {
    e.stopPropagation();
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/post/api/delete/${postId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setPosts(posts.filter((post) => post.id !== postId));
          setShowModal(false);
        } else {
          throw new Error("게시물 삭제에 실패했습니다");
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  //수정함수
  const handleEdit = () => {
    setEditMode(true);
    setEditedTitle(selectedPost.title);
    setEditedContent(selectedPost.content);
  };

  //수정 후 저장함수 api확인!!
  const handleSave = async () => {
    try {
      const response = await fetch(`/post/api/update/${selectedPost.id}`, {
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
        const updatedPosts = posts.map((post) =>
          post.id === selectedPost.id
            ? { ...post, title: editedTitle, content: editedContent }
            : post
        );
        setPosts(updatedPosts);
        setSelectedPost({
          ...selectedPost,
          title: editedTitle,
          content: editedContent,
        });
        setEditMode(false);
      } else {
        throw new Error("게시물 수정에 실패했습니다");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // 이벤트 클릭 핸들러 추가
  const handleEventClick = (info) => {
    const post = posts.find((p) => p.id === parseInt(info.event.id));
    setSelectedPost(post);
    setShowModal(true);
    setEditMode(false);
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
      <div className="container-fluid px-4 py-3">
        {/* 네비게이션 바 */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 rounded shadow-sm">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1 d-none d-sm-block">여행 플래너</span>
            <span className="navbar-brand mb-0 h1 d-block d-sm-none">플래너</span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate("/main", { state: { email } })}
              >
                홈
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => navigate("/mypage", { state: { email } })}
              >
                마이페이지
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={() => navigate("/planner", { state: { email } })}
              >
                글쓰기
              </button>
            </div>
          </div>
        </nav>
    
        {/* 메인 콘텐츠 */}
        <div className="row">
          {/* 여행 계획 목록 */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="card-title h4 mb-4">여행 계획 목록</h2>
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">로딩중...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">에러: {error}</div>
                ) : posts.length === 0 ? (
                  <div className="alert alert-info">게시물이 없습니다</div>
                ) : (
                  <div className="list-group">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-start cursor-pointer"
                        onClick={() => handleRowClick(post)}
                      >
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{post.subject}</div>
                          <small className="text-muted">
                            {new Date(post.startDate).toLocaleDateString()} - 
                            {new Date(post.endDate).toLocaleDateString()}
                          </small>
                          <div className="text-muted small mt-1">
                            {post.content.length > 50
                              ? `${post.content.substring(0, 50)}...`
                              : post.content}
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={(e) => handleDelete(post.id, e)}
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
    
          {/* 캘린더 */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="card-title h4 mb-4">여행 일정</h2>
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={calendarEvents}
                  eventClick={handleEventClick}
                  height="auto"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                  }}
                  locale="ko"
                  buttonText={{
                    today: '오늘',
                    month: '월',
                    week: '주'
                  }}
                  dayMaxEvents={true}
                  eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false
                  }}
                />
              </div>
            </div>
          </div>
        </div>
    
        {/* 상세 정보 모달 */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editMode ? "여행 계획 수정" : selectedPost?.subject}
            </Modal.Title>
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
                <Form.Group className="mb-3">
                  <Form.Label>시작일</Form.Label>
                  <Form.Control
                    type="date"
                    value={editedStartDate}
                    onChange={(e) => setEditedStartDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>종료일</Form.Label>
                  <Form.Control
                    type="date"
                    value={editedEndDate}
                    onChange={(e) => setEditedEndDate(e.target.value)}
                    min={editedStartDate}
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
                  <h6 className="mb-2">여행 기간</h6>
                  <p className="text-muted">
                    {new Date(selectedPost?.startDate).toLocaleDateString()} - 
                    {new Date(selectedPost?.endDate).toLocaleDateString()}
                  </p>
                  <h6 className="mb-2">제목</h6>
                  <p>{selectedPost?.subject}</p>
                  <h6 className="mb-2">내용</h6>
                  <p className="white-space-pre-wrap">{selectedPost?.content}</p>
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
            <Button 
              variant="danger" 
              onClick={(e) => handleDelete(selectedPost?.id, e)}
            >
              삭제
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
}

export default PostList;
