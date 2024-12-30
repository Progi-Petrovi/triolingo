package com.triolingo.entity.user;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
public class Admin extends User {
    @Override
    public List<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>(Arrays.asList(Role.ADMIN.getAuthority()));
        authorities.addAll(super.getAuthorities());
        return authorities;
    }
}
