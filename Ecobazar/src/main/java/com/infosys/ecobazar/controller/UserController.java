package com.infosys.ecobazar.controller;

import com.infosys.ecobazar.entity.User;
import com.infosys.ecobazar.security.JwtUtil;
import com.infosys.ecobazar.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil; // We inject our new Token Generator

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return "User registered successfully!";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        User loggedInUser = userService.loginUser(user.getEmail(), user.getPassword());

        Map<String, String> response = new HashMap<>();

        if (loggedInUser != null) {
            String token = jwtUtil.generateToken(loggedInUser.getEmail());

            response.put("message", "Login Successful");
            response.put("token", token);

            // CRITICAL: This tells React which dashboard to open!
            response.put("role", loggedInUser.getRole().toString());
        } else {
            response.put("message", "Invalid Email or Password");
        }
        return response;
    }
}