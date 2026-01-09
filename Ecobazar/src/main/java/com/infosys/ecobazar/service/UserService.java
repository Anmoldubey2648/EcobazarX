package com.infosys.ecobazar.service;

import com.infosys.ecobazar.entity.User;
import com.infosys.ecobazar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Logic to Save a new User
    public User registerUser(User user) {
        // Check if email already exists to prevent duplicates
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }
        return userRepository.save(user);
    }

    // Logic to Check Login credentials
    public User loginUser(String email, String password) {
        Optional<User> foundUser = userRepository.findByEmail(email);

        if (foundUser.isPresent()) {
            User user = foundUser.get();
            // Check if the password matches
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        return null; // Return null if login fails
    }
}