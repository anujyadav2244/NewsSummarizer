package com.news.summarizer.NewsSummarizer.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/protected")
    public ResponseEntity<Map<String, String>> testProtectedRoute(Authentication auth) {
        Object principal = auth.getPrincipal();
        String email = principal == null ? "unknown" : principal.toString();
        return ResponseEntity.ok(Map.of(
            "message", "You are authenticated!",
            "email", email
        ));
    }
}
