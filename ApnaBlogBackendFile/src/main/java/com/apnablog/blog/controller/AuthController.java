package com.apnablog.blog.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.apnablog.blog.dto.AuthRequest;
import com.apnablog.blog.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Handles login requests
    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JsonNode> login(@RequestBody AuthRequest loginRequest) {
        return authService.login(loginRequest);
    }

    // Handles signup requests
    @PostMapping(value = "/signup", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JsonNode> signup(@RequestBody AuthRequest authRequest) {
        return authService.signup(authRequest)
                // Send OK response if signup is successful, else send unprocessable entity
                ? ResponseEntity.ok(responseMessage(authRequest.getUserName()))
                : ResponseEntity.unprocessableEntity().body(responseMessage(authRequest.getUserName()));
    }

    // Constructs response message
    private ObjectNode responseMessage(String userName) {
        return new ObjectMapper().createObjectNode()
                .put("userName", userName);
    }
}
