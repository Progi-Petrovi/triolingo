package com.triolingo.entity.user;

import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.Language;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.springframework.security.core.GrantedAuthority;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@FieldNameConstants
@Data
@PrimaryKeyJoinColumn
public class Teacher extends User {
    @NotEmpty
    @ManyToMany
    @Builder.Default
    @JoinTable(name = "teacher_language", joinColumns = @JoinColumn(name = "teacher_id"), inverseJoinColumns = @JoinColumn(name = "language_id"))
    private List<Language> languages = new LinkedList();

    @NotNull
    private Integer yearsOfExperience;

    @NotNull
    @Builder.Default
    @Column(columnDefinition = "TEXT")
    private String qualifications = "";

    @NotNull
    private TeachingStyle teachingStyle;

    @Builder.Default()
    private String profileImageHash = null;

    @NotNull
    private Double hourlyRate;

    @Override
    public List<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>(Arrays.asList(Role.TEACHER.getAuthority()));
        authorities.addAll(super.getAuthorities());
        return authorities;
    }
}
