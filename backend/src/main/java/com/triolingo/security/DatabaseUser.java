package com.triolingo.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

import com.triolingo.entity.User;

public class DatabaseUser extends org.springframework.security.core.userdetails.User {

    public User storedUser;

    public DatabaseUser(String username, String password, Collection<? extends GrantedAuthority> authorities,
            User storedUser) {
        super(username, password, authorities);
        this.storedUser = storedUser;
    }

    public DatabaseUser(String username, String password, boolean enabled, boolean accountNonExpired,
            boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities,
            User storedUser) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.storedUser = storedUser;
    }

}
