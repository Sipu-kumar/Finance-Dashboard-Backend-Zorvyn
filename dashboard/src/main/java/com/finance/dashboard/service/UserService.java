package com.finance.dashboard.service;

import com.finance.dashboard.model.User;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Default role to VIEWER if not set
        if (user.getRole() == null) {
            user.setRole(com.finance.dashboard.model.Role.VIEWER);
        }
        return repo.save(user);
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }
}