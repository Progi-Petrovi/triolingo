package com.triolingo.security;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.triolingo.entity.user.User;

public class DatabaseUser implements OAuth2User, UserDetails {

    private final String email, password;
    private final Collection<GrantedAuthority> authorities;

    private final User storedUser;
    private final Map<String, Object> attributes;

    public DatabaseUser(String email, String password, Collection<GrantedAuthority> authorities,
            User storedUser) {
        this.email = email;
        this.password = password;
        this.storedUser = storedUser;
        this.authorities = authorities;
        this.attributes = new HashMap<>();
    }

    public User getStoredUser() {
        return storedUser;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return this.attributes;
    }

    @Override
    public String getName() {
        return this.getUsername();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

}
