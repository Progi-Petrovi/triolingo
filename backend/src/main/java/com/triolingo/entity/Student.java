package com.triolingo.entity;

import com.triolingo.entity.language.LearningLanguage;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
public class Student extends User {
    @NotEmpty
    @ManyToMany
    @JoinTable(name = "student_learning_language", joinColumns = @JoinColumn(name = "student_id"), inverseJoinColumns = @JoinColumn(name = "learning_language_id"))
    private List<LearningLanguage> learningLanguages;
    @NotNull
    private TeachingStyle preferredTeachingStyle;
    @Column(columnDefinition = "TEXT")
    private String learningGoals;

    @Override
    public List<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>(Arrays.asList(Role.STUDENT.getAuthority()));
        authorities.addAll(super.getAuthorities());
        return authorities;
    }
}
