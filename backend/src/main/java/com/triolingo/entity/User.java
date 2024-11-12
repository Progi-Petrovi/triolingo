package com.triolingo.entity;

import java.util.Arrays;
import java.util.List;

import javax.validation.constraints.*;

import org.springframework.security.core.GrantedAuthority;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Data
public abstract class User {

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;
    @NotNull
    private String fullName;
    @NotNull
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", flags = Pattern.Flag.CASE_INSENSITIVE)
    private String email;
    @NotNull
    private String password;

    public List<GrantedAuthority> getAuthorities() {
        return Arrays.asList(Role.USER.getAuthority());
    }
}

enum Role {
    USER(() -> "ROLE_USER"),
    ADMIN(() -> "ROLE_ADMIN"),
    TEACHER(() -> "ROLE_TEACHER"),
    STUDENT(() -> "ROLE_STUDENT");

    private final GrantedAuthority authority;

    private Role(GrantedAuthority authority) {
        this.authority = authority;
    }

    public GrantedAuthority getAuthority() {
        return authority;
    }

    @Override
    public String toString() {
        return authority.getAuthority();
    }
}