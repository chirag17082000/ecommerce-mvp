package com.chirag.ecommerce_backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // For now, disable CSRF so POST/PUT/DELETE work easily from Postman / frontend
            .csrf(csrf -> csrf.disable())

            // Authorize requests
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**", "/uploads/**", "/h2-console/**").permitAll()  // allow all our APIs + H2 console
                .anyRequest().permitAll()                                  // allow everything else too
            )

            // H2 console uses frames, so we need to disable frame options
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
