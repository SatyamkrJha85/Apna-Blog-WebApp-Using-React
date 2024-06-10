package com.apnablog.blog.service;

import com.apnablog.blog.entity.BlogUser;
import com.apnablog.blog.repository.BlogUserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final BlogUserRepository repository;

    public UserDetailsServiceImpl(BlogUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Find the blog user by username
        BlogUser blogUser = repository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("No blog user found with username: " + username));
        // Map the blog user to a UserDetails object
        return this.mapToUser(blogUser);
    }

    // Map a BlogUser object to a UserDetails object
    private UserDetails mapToUser(BlogUser blogUser) {
        return new User(
                blogUser.getUserName(),
                blogUser.getPassword(),
                true, true, true, true,
                getAuthorities("ROLE_" + blogUser.getAuthority())
        );
    }

    // Get authorities for the user
    private Collection<? extends GrantedAuthority> getAuthorities(String role_user) {
        return Collections.singletonList(new SimpleGrantedAuthority(role_user));
    }
}
