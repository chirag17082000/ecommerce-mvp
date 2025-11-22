package com.chirag.ecommerce_backend.Repository;

import com.chirag.ecommerce_backend.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ProductRepository extends JpaRepository<Product, Long> {}
