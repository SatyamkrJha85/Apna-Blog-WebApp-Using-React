package com.apnablog.blog.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.apnablog.blog.dto.AuthRequest;
import com.apnablog.blog.entity.BlogUser;
import com.apnablog.blog.repository.BlogUserRepository;
import com.apnablog.blog.security.JwtProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService {
    private final BlogUserRepository blogUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public AuthService(
            BlogUserRepository blogUserRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtProvider jwtProvider
    ) {
        this.blogUserRepository = blogUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
    }

    // Sign up a new user
    public boolean signup(AuthRequest authRequest) {
        BlogUser blogUser = this.mapToBlogUser(authRequest);
        return blogUserRepository.findByUserName(blogUser.getUserName())
                .map(user -> false) // If user with the same username exists, return false
                .orElseGet(() -> {
                    blogUserRepository.save(blogUser);
                    return true; // If no user with the same username exists, save the new user and return true
                });
    }

    private BlogUser mapToBlogUser(AuthRequest authRequest) {
        return new BlogUser(
                authRequest.getUserName(),
                "USER",
                passwordEncoder.encode(authRequest.getPassword()),
                authRequest.getEmail()
        );
    }

    // Authenticate and generate JWT token for the user
    public ResponseEntity<JsonNode> login(AuthRequest loginRequest) {
        Authentication authenticate;
        try {
            // Authenticate the user with provided username and password
            authenticate = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUserName(),
                            loginRequest.getPassword()
                    )
            );
            // Set authentication details in security context
            SecurityContextHolder.getContext().setAuthentication(authenticate);
        } catch (AuthenticationException e) {
            // If authentication fails, return 401 Unauthorized status with error message
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(badCredentialsResponseNode(loginRequest));
        }
        // If authentication is successful, return 200 OK status with user details and JWT token
        return ResponseEntity.ok(loginSuccessResponseNode(authenticate));
    }

    // Create a JSON response node for bad credentials error
    private ObjectNode badCredentialsResponseNode(AuthRequest loginRequest) {
        return new ObjectMapper().createObjectNode()
                .put("error", badCredentialsMessage(loginRequest.getUserName()));
    }

    // Create a bad credentials error message
    private String badCredentialsMessage(String userName) {
        return blogUserRepository.findByUserName(userName)
                .map(user -> "Invalid password")
                .orElse("Invalid username");
    }

    // Create a JSON response node for successful login
    private ObjectNode loginSuccessResponseNode(Authentication authentication) {
        return new ObjectMapper().createObjectNode()
                .put("userName", authentication.getName())
                .put("authorities", authorities(authentication.getAuthorities()))
                .put("jwt", jwtProvider.generateToken(authentication)); // Generate JWT token for the user
    }

    // Extract authorities from the authentication object
    private String authorities(Collection<? extends GrantedAuthority> grantedAuthority) {
        return grantedAuthority.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
    }

    // Get the currently authenticated user from the security context
    public Optional<BlogUser> getBlogUser() {
        String blogUserName = SecurityContextHolder.getContext().getAuthentication().getName();
        return blogUserRepository.findByUserName(blogUserName);
    }
}
