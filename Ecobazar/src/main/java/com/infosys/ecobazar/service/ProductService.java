package com.infosys.ecobazar.service;

import com.infosys.ecobazar.entity.Product;
import com.infosys.ecobazar.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Logic for a SELLER to add a product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // Logic for a USER/ADMIN to see all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Logic to delete a product (for Admin/Seller)
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}