package com.news.summarizer.NewsSummarizer.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.news.summarizer.NewsSummarizer.model.User;
import com.news.summarizer.NewsSummarizer.repository.UserRepository;
import com.news.summarizer.NewsSummarizer.security.JwtUtil;
import com.news.summarizer.NewsSummarizer.service.EmailService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.allowed.origins}", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody User user) {
        try {
            Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email already registered!"));
            }

            String otp = String.format("%06d", new Random().nextInt(1_000_000));
            user.setOtp(otp);
            user.setOtpGeneratedAt(LocalDateTime.now());
            user.setVerified(false);
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // send OTP
            if (emailService != null) {
    emailService.sendOtpEmail(user.getEmail(), otp);
}

            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "OTP sent to email!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Something went wrong. Please try again later."));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");

            if (email == null || otp == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email and OTP are required!"));
            }

            Optional<User> optionalUser = userRepository.findByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found!"));
            }

            User user = optionalUser.get();

            if (user.getVerified()) {
                return ResponseEntity.ok(Map.of("message", "User already verified!"));
            }

            if (!otp.equals(user.getOtp())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Invalid OTP!"));
            }

            // OTP validity: 10 minutes
            if (user.getOtpGeneratedAt() == null || user.getOtpGeneratedAt().plusMinutes(10).isBefore(LocalDateTime.now())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "OTP expired!"));
            }

            user.setVerified(true);
            user.setOtp(null);
            user.setOtpGeneratedAt(null);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Email verified successfully!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Something went wrong during verification."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            if (email == null || password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email and password are required!"));
            }

            Optional<User> optionalUser = userRepository.findByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid credentials"));
            }

            User user = optionalUser.get();

            if (!user.getVerified()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Email not verified"));
            }

            if (!passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid credentials"));
            }

            String token = jwtUtil.generateToken(email);
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "userId", user.getId()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Login failed. Please try again."));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        String email = principal.toString();
        return userRepository.findByEmail(email)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found")));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        String email = principal.toString();
        return userRepository.findByEmail(email).<ResponseEntity<?>>map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "User account deleted successfully"));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found")));

    }
}
