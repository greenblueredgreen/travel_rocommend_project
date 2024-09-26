import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleDelete = async (postId) => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/post/api/delete/${postId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setPosts(posts.filter((post) => post.id !== postId));
        } else {
          throw new Error("게시물 삭제에 실패했습니다");
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`, { state: { email: email } });
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
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{post.title}</div>
                  {post.content}
                </div>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(post.id)}
                  >
                    수정
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PostList;
