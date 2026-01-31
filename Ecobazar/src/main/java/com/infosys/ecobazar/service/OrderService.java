package com.infosys.ecobazar.service;

import com.infosys.ecobazar.entity.Order;
import com.infosys.ecobazar.entity.OrderItem;
import com.infosys.ecobazar.entity.Product;
import com.infosys.ecobazar.entity.User;
import com.infosys.ecobazar.repository.OrderRepository;
import com.infosys.ecobazar.repository.ProductRepository;
import com.infosys.ecobazar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Order placeOrder(Long userId, List<OrderItem> items) {
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("CONFIRMED");

        double totalPrice = 0;
        double totalCarbon = 0;
        int ecoPointsEarned = 0;

        for (OrderItem item : items) {
            Product p = productRepository.findById(item.getProductId()).orElse(null);

            if (p != null) {
                item.setPrice(p.getPrice());
                item.setProductName(p.getName());
                item.setOrder(order);

                totalPrice += p.getPrice() * item.getQuantity();
                totalCarbon += p.getCarbonFootprint() * item.getQuantity();

                // Points Logic: 20 pts for Low Carbon (<2kg), else 5 pts
                if (p.getCarbonFootprint() < 2.0) {
                    ecoPointsEarned += 20 * item.getQuantity();
                } else {
                    ecoPointsEarned += 5 * item.getQuantity();
                }
            }
        }

        order.setTotalPrice(totalPrice);
        order.setTotalCarbon(totalCarbon);
        order.setItems(items);

        // --- 🏆 FIXED: UPDATE USER SCORE ---
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            // ERROR WAS HERE: Removed the "== null" check because int cannot be null
            int currentScore = user.getEcoScore();

            user.setEcoScore(currentScore + ecoPointsEarned);
            userRepository.save(user);
        }

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}