package com.triolingo.entity.user;

import java.util.Arrays;
import java.util.Collections;
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
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", flags = Pattern.Flag.CASE_INSENSITIVE)
    private String email;
    @NotNull
    private String password;
    @NotNull
    private String fullName;
    @NotNull
    private Boolean verified = false;

    public List<GrantedAuthority> getAuthorities() {
        if (verified)
            return Arrays.asList(Role.USER.getAuthority(), Role.VERIFIED.getAuthority());
        else
            return Collections.singletonList(Role.USER.getAuthority());
    }
}

@Getter
enum Role {
    USER(() -> "ROLE_USER"),
    ADMIN(() -> "ROLE_ADMIN"),
    TEACHER(() -> "ROLE_TEACHER"),
    STUDENT(() -> "ROLE_STUDENT"),
    VERIFIED(() -> "ROLE_VERIFIED");

    private final GrantedAuthority authority;

    Role(GrantedAuthority authority) {
        this.authority = authority;
    }

    @Override
    public String toString() {
        return authority.getAuthority();
    }
}