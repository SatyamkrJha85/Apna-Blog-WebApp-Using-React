package com.apnablog.blog.dto;

public class AuthRequest {
    private String userName;
    private String password;
    private String email;

    // Getters and setters for userName, password, and email

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
