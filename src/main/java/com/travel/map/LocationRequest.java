package com.travel.map;

public class LocationRequest {
    private double latitude;  // 위도
    private double longitude; // 경도
    private int page;         // 페이지 수

    // 기본 생성자
    public LocationRequest() {}

    // 생성자
    public LocationRequest(double latitude, double longitude, int page) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.page = page;
    }

    // Getter 및 Setter
    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }
}

