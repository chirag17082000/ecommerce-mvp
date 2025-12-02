package com.chirag.ecommerce_backend.Config;

import com.chirag.ecommerce_backend.Entity.Product;
import com.chirag.ecommerce_backend.Entity.Role;
import com.chirag.ecommerce_backend.Entity.User;
import com.chirag.ecommerce_backend.Repository.ProductRepository;
import com.chirag.ecommerce_backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedProducts();
        seedAdminUser();
    }

    private void seedProducts() {
        if (productRepository.count() > 0) {
            return; // already seeded
        }

        List<Product> products = List.of(
                Product.builder()
                        .description("Wireless Bluetooth Headphones — comfortable, 20h battery")
                        .price(2499)
                        .imageUrl(null)
                        .stock(50)
                        .build(),
                Product.builder()
                        .description("Smart LED TV 43\" — 4K, HDR")
                        .price(32999)
                        .imageUrl(null)
                        .stock(12)
                        .build(),
                Product.builder()
                        .description("Stainless Steel Water Bottle 1L")
                        .price(799)
                        .imageUrl(null)
                        .stock(200)
                        .build(),
                Product.builder()
                        .description("Running Shoes — breathable mesh, size range 6-12")
                        .price(2999)
                        .imageUrl(null)
                        .stock(80)
                        .build(),
                Product.builder()
                        .description("USB-C Fast Charger 30W")
                        .price(699)
                        .imageUrl(null)
                        .stock(150)
                        .build()
        );

        productRepository.saveAll(products);
        System.out.println("Seeded " + products.size() + " sample products into H2.");
    }

    private void seedAdminUser() {
        String adminEmail = "admin@example.com";

        if (userRepository.existsByEmail(adminEmail)) {
            return; // already there
        }

        User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode("admin123")) // default password
                .fullName("Admin User")
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
        System.out.println("Seeded default admin user: " + adminEmail + " / admin123");
    }
}
