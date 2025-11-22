package com.chirag.ecommerce_backend.Entity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 2000)
    private String description;

    private long price;

    private String imageUrl;

    private Integer stock;

}
