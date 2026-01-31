package com.infosys.ecobazar.service;

import com.infosys.ecobazar.entity.Product;
import com.infosys.ecobazar.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> findGreenerAlternatives(Long productId) {
        // 1. Get the current product
        Product current = productRepository.findById(productId).orElse(null);
        if (current == null) return List.of();

        // 2. Find items in SAME category but LOWER carbon footprint
        List<Product> all = productRepository.findAll();

        return all.stream()
                .filter(p -> p.getCategory() != null && p.getCategory().equalsIgnoreCase(current.getCategory())) // Same Category
                .filter(p -> p.getCarbonFootprint() < current.getCarbonFootprint()) // Better for Earth
                .filter(p -> !p.getId().equals(current.getId())) // Not the same item
                .limit(3) // Only show top 3
                .collect(Collectors.toList());
    }
}