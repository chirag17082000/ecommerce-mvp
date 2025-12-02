package com.chirag.ecommerce_backend.AuthDTO;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
}
