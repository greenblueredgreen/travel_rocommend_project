import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'; 

function LunchRecommendations() {
    const [lunchList, setLunchList] = useState([]); // 추천 목록을 저장하는 상태
    const selectCount = 1; // 추천받을 페이지 수 (필요에 따라 변경 가능)

    // Kakao 지도 API 스크립트를 로드하는 useEffect
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=8323252951a97b41155cd927ab433d7c&libraries=services";
        script.async = true;
        document.head.appendChild(script);

        // 스크립트 로드 후에 처리할 로직이 있다면 추가 가능
        return () => {
            document.head.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
        };
    }, []);


    const fetchLunchRecommendations = async (latitude, longitude) => {
        setLunchList([]); // 초기화
    
        for (let i = 1; i <= selectCount; i++) {
            try {
                const response = await fetch('/lunch/recommend', {  // API 경로 확인
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ latitude, longitude, page: i }),
                });
                
                if (!response.ok) {
                    // 상태 코드와 응답 텍스트를 추가로 확인
                    console.error(`HTTP 상태 코드: ${response.status}`);
                    const errorText = await response.text();
                    console.error("응답 내용:", errorText);
                    throw new Error("추천 목록을 가져오는데 실패했습니다.");
                }
    
                const result = await response.json();
                //console.log("Fetched result:", result);
                //alert(result);
                //alert(JSON.stringify(result, null, 2)); // 객체를 보기 좋게 출력
            
                const items = result.documents || [];
                setLunchList((prevList) => [...prevList, ...items]);
            } catch (error) {
                console.error(error);
                alert('추천 목록을 가져오는데 실패했습니다.');
            }
        }
    };
    

    // 사용자의 위치 정보를 받아와 추천 목록을 요청하는 함수
    const handleRecommendClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    //alert(latitude);
                    //alert(longitude);
                    fetchLunchRecommendations(latitude, longitude);
                },
                (error) => {
                    console.error(error);
                    alert('위치 정보를 가져오는데 실패했습니다.');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            alert('지오로케이션을 지원하지 않는 브라우저입니다.');
        }
    };

    return (
        <div>
            <button class="mt-3 btn btn-info" type="button" onClick={handleRecommendClick}>맛집 추천</button>
            <div id="lunch_list" class="mt-3">
                {lunchList.length > 0 ? (
                    lunchList.map((item, index) => (
                        <div key={index} className="lunch_list_content">
                            <h3>{item.place_name || "이름 없음"}</h3> {/* place_name이 없을 경우를 대비 */}
                            <p class="mt-3">주소 : {item.address_name}</p>
                            <a href={item.place_url} target="_blank" rel="noopener noreferrer">자세히 보기 - 사이트 연결</a>
                            <p class="mt-2">전화번호: {item.phone || "없음"}</p>
                        </div>
                    ))
                ) : (
                    <p>추천 목록이 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default LunchRecommendations;
