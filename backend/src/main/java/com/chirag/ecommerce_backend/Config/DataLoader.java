package com.chirag.ecommerce_backend.Config;
import com.chirag.ecommerce_backend.Controller.ProductController;
import com.chirag.ecommerce_backend.Entity.Product;
import com.chirag.ecommerce_backend.Repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class DataLoader implements CommandLineRunner  {

    
    public final ProductRepository productRepository;

    public DataLoader(ProductRepository productRepository){
        this.productRepository = productRepository;
    
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        //If product already exist, do not insert again.ecommerceBackendApplication.
        if(productRepository.count() >0){
            return;
        }

        List<Product> sample = List.of(
            Product.builder()
                   .description("Wireless Bluetooth Headphones — comfortable, 20h battery")
                   .price(2499)
                   .imageUrl("https://example.com/images/headphones.jpg")
                   .stock(50)
                   .build(),

            Product.builder()
                   .description("Smart LED TV 43\" — 4K, HDR")
                   .price(32999)
                   .imageUrl("https://example.com/images/tv43.jpg")
                   .stock(12)
                   .build(),

            Product.builder()
                   .description("Stainless Steel Water Bottle 1L")
                   .price(799)
                   .imageUrl("https://example.com/images/bottle.jpg")
                   .stock(200)
                   .build(),

            Product.builder()
                   .description("Running Shoes — breathable mesh, size range 6-12")
                   .price(2999)
                   .imageUrl("https://example.com/images/shoes.jpg")
                   .stock(80)
                   .build(),

            Product.builder()
                   .description("USB-C Fast Charger 30W")
                   .price(699)
                   .imageUrl("https://example.com/images/charger.jpg")
                   .stock(150)
                   .build()
        );


        productRepository.saveAll(sample);
        System.out.println("Seeded" +sample.size() + "sample products into H2.");
    }
}
