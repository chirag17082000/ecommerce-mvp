package com.chirag.ecommerce_backend.Service;

import com.chirag.ecommerce_backend.AuthDTO.AuthRequest;
import com.chirag.ecommerce_backend.AuthDTO.AuthResponse;
import com.chirag.ecommerce_backend.AuthDTO.RegisterRequest;
import com.chirag.ecommerce_backend.Entity.Role;
import com.chirag.ecommerce_backend.Entity.User;
import com.chirag.ecommerce_backend.Repository.UserRepository;
import com.chirag.ecommerce_backend.Security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.CUSTOMER)
                .build();

        userRepository.save(user);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }
}
