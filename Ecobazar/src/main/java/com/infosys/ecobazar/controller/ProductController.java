package com.infosys.ecobazar.controller;

import com.infosys.ecobazar.entity.Product;
import com.infosys.ecobazar.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Endpoint for Sellers: POST /products/add
    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    // Endpoint for Users: GET /products/all
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
}