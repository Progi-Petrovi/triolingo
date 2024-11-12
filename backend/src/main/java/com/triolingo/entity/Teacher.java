package com.triolingo.entity;

import com.triolingo.entity.language.Language;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.security.core.GrantedAuthority;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@PrimaryKeyJoinColumn
public class Teacher extends User {
    @NotNull
    @ManyToMany
    @Builder.Default
    @JoinTable(name = "teacher_language", joinColumns = @JoinColumn(name = "teacher_id"), inverseJoinColumns = @JoinColumn(name = "language_id"))
    private List<Language> languages = new LinkedList();

    @NotNull
    private Integer yearsOfExperience;

    @NotNull
    @ElementCollection
    @Builder.Default
    private List<String> qualifications = new LinkedList();

    @NotNull
    private TeachingStyle teachingStyle;

    @Builder.Default()
    private String profilePictureHash = null;

    @NotNull
    private Double hourlyRate;

    @Override
    public List<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>(Arrays.asList(Role.TEACHER.getAuthority()));
        authorities.addAll(super.getAuthorities());
        return authorities;
    }
}
