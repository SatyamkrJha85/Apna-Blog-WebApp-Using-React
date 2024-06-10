package com.apnablog.blog.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.apnablog.blog.dto.ContentRequest;
import com.apnablog.blog.entity.Post;
import com.apnablog.blog.repository.BlogUserRepository;
import com.apnablog.blog.repository.PostRepository;
import com.apnablog.blog.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PostController {

    private final PostRepository postRepository;
    private final AuthService authService;

    public PostController(
            PostRepository postRepository,
            BlogUserRepository blogUserRepository,
            AuthService authService
    ) {
        this.postRepository = postRepository;
        this.authService = authService;
    }

    // Retrieve all posts
    @GetMapping(value = "/posts", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<JsonNode>> posts() {
        return ResponseEntity.ok(
                postRepository.findAll().stream()
                        .map(Post::asJson)
                        .toList()
        );
    }

    // Retrieve a post by its ID
    @GetMapping(value = "/posts/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JsonNode> post(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(Post::asJsonWithComments)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new post
    @PostMapping(value = "/posts")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<JsonNode> createPost(@RequestBody ContentRequest contentRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postRepository.save(newPost(contentRequest)).asJson());
    }

    // Create a new Post object based on content request
    private Post newPost(ContentRequest contentRequest) {
        return new Post(
                contentRequest.getTitle(),
                contentRequest.getContent(),
                LocalDate.now(),
                LocalDate.now(),
                authService.getBlogUser().orElseThrow(),
                new ArrayList<>()
        );
    }

    // Update an existing post
    @PutMapping(value = "/posts")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<JsonNode> updatePost(@RequestBody ContentRequest contentRequest) {
        return postRepository.findById(contentRequest.getId())
                .map(post -> post.updateContent(contentRequest.getContent()))
                .map(post -> ResponseEntity.ok(postRepository.save(post).asJson()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a post by its ID
    @DeleteMapping(value = "/posts/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<HttpStatus> deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
