package com.chirag.ecommerce_backend.Controller;

import com.chirag.ecommerce_backend.Entity.Product;
import com.chirag.ecommerce_backend.Repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import com.chirag.ecommerce_backend.Dto.ProductRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import java.util.*;


@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository repo;


    //constructor injection
    public ProductController(ProductRepository repo){
        this.repo = repo;
    }

    @GetMapping
    public List<Product> list(){
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Product get(@PathVariable Long id){
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @PostMapping
    public Product create(@Valid @RequestBody ProductRequest req){
        Product p = Product.builder()
            .description(req.getDescription())
            .price(req.getPrice())
            .imageUrl(req.getImageUrl())
            .stock(req.getStock())
            .build();

        return repo.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
        @PathVariable Long id,
        @Valid @RequestBody ProductRequest req) {

        return repo.findById(id)
            .map(existing -> {
                existing.setDescription(req.getDescription());
                existing.setPrice(req.getPrice());
                existing.setImageUrl(req.getImageUrl());
                existing.setStock(req.getStock());

                repo.save(existing);
                return ResponseEntity.ok(existing);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
            if(!repo.existsById(id)){
                return ResponseEntity.notFound().build();
             }

        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
