package com.chirag.ecommerce_backend.Controller;

import com.chirag.ecommerce_backend.AuthDTO.AuthRequest;
import com.chirag.ecommerce_backend.AuthDTO.AuthResponse;
import com.chirag.ecommerce_backend.AuthDTO.RegisterRequest;
import com.chirag.ecommerce_backend.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
