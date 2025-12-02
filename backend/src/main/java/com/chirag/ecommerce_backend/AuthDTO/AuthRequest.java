package com.chirag.ecommerce_backend.AuthDTO;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
