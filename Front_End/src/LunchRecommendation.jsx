import React, { useState } from 'react';
import axios from 'axios';

const LunchRecommendation = () => {
    const [lunchList, setLunchList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getLunchRecommendations = () => {
        if ("geolocation" in navigator) { // geolocation 사용 가능
            setLoading(true);
            setError('');
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                try {
                    // Spring Boot API 호출
                    const response = await axios.get(`http://localhost:8080/lunch?latitude=${latitude}&longitude=${longitude}`);
                    setLunchList(response.data); // 응답 데이터로 lunchList 업데이트
                } catch (err) {
                    console.error(err);
                    setError("맛집 정보를 가져오는 데 실패했습니다."); // 오류 메시지 설정
                } finally {
                    setLoading(false);
                }
            }, (error) => {
                console.error(error);
                setError("위치 정보를 가져오는 데 실패했습니다."); // 오류 메시지 설정
                setLoading(false);
            }, {
                enableHighAccuracy: true,
                timeout: Infinity,
                maximumAge: 0
            });
        } else { // geolocation 사용 불가능
            setError('geolocation 사용 불가능');
        }
    };

    return (
        <div>
            <input type="hidden" id="select_count" value="3" />
            <button onClick={getLunchRecommendations} disabled={loading}>
                {loading ? '로딩 중...' : '맛집 추천'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div id="lunch_list">
                {lunchList.length > 0 ? (
                    lunchList.map((item, index) => (
                        <div key={index} className="lunch_list_content" 
                             data-address={item.address_name}
                             data-url={item.place_url}
                             data-x={item.x}
                             data-y={item.y}
                             data-phone={item.phone}>
                            <h3>{item.place_name}</h3>
                            <p>{item.address_name}</p>
                            <p>{item.phone}</p>
                            <a href={item.place_url} target="_blank" rel="noopener noreferrer">자세히 보기</a>
                        </div>
                    ))
                ) : (
                    <p>맛집 정보를 찾을 수 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default LunchRecommendation;
