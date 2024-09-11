package com.travel.map.controller;

import com.travel.map.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/map")
@CrossOrigin(origins = "http://localhost:3000")  // React 앱의 주소
public class MapController {

    private final MapService mapService;

    @Autowired
    public MapController(MapService mapService) {
        this.mapService = mapService;
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> searchPlaces(@RequestParam String query) {
        Map<String, Object> result = mapService.searchPlaces(query);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(result);
    }

    @GetMapping(value = "/nearby", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getNearbyPlaces(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "restaurant") String type) {
        Map<String, Object> result = mapService.getNearbyPlaces(lat, lng, type);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(result);
    }
}