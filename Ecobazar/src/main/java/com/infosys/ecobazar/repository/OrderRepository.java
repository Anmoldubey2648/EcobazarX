package com.infosys.ecobazar.repository;

import com.infosys.ecobazar.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId); // Find all orders for one specific user
}