package com.finance.dashboard.controller;

import com.finance.dashboard.model.User;
import com.finance.dashboard.repository.UserRepository;
import com.finance.dashboard.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;
    private final UserRepository userRepo;

    public UserController(UserService service, UserRepository userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }

    /** Public — registration */
    @PostMapping
    public User createUser(@RequestBody User user) {
        System.out.println(user);
        return service.createUser(user);
    }

    /** Admin only — list all users */
    @GetMapping
    public List<User> getUsers() {
        return service.getAllUsers();
    }

    /**
     * GET /users/me — returns the current user's profile (name, email, role).
     * Used by the frontend to determine the role after login.
     */
    @GetMapping("/me")
    public Map<String, String> getCurrentUser(Authentication auth) {
        User user = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return Map.of(
                "name",  user.getName()  != null ? user.getName() : "",
                "email", user.getEmail() != null ? user.getEmail() : "",
                "role",  user.getRole()  != null ? user.getRole().name() : "VIEWER"
        );
    }
}