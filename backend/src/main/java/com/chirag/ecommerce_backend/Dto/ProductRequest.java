package com.chirag.ecommerce_backend.Dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description too long")
    private String description;

    @Min(value = 0, message = "Price must be >= 0")
    private long price;

    @Size(max = 1000, message = "Image URL too long")
    private String imageUrl;

    @Min(value = 0, message = "Stock must be >= 0")
    private Integer stock;
}
