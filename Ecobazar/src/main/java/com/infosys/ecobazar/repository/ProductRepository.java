package com.infosys.ecobazar.repository;

import com.infosys.ecobazar.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // We can add a custom method to find products by category later if needed
}