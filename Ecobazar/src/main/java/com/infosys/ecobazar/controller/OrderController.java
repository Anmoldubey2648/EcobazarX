package com.infosys.ecobazar.controller;

import com.infosys.ecobazar.entity.Order;
import com.infosys.ecobazar.entity.OrderItem;
import com.infosys.ecobazar.entity.Product;
import com.infosys.ecobazar.entity.User;
import com.infosys.ecobazar.repository.UserRepository;
import com.infosys.ecobazar.service.OrderService;
import com.infosys.ecobazar.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private RecommendationService recommendationService;
    @Autowired
    private UserRepository userRepository;

    // 1. Checkout Endpoint
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody List<OrderItem> items) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByEmail(auth.getName());

        if (user.isEmpty()) return ResponseEntity.status(401).body("User not found");

        Order savedOrder = orderService.placeOrder(user.get().getId(), items);
        return ResponseEntity.ok(savedOrder);
    }

    // 2. Recommendation Endpoint
    @GetMapping("/recommendations/{productId}")
    public List<Product> getRecommendations(@PathVariable Long productId) {
        return recommendationService.findGreenerAlternatives(productId);
    }

    // 3. My Orders Endpoint (This was missing!)
    @GetMapping("/my-orders")
    public List<Order> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByEmail(auth.getName());

        // Return the user's order history
        return user.map(value -> orderService.getUserOrders(value.getId())).orElse(List.of());
    }
}