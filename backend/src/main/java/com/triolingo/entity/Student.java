package com.triolingo.entity;

import com.triolingo.entity.language.LearningLanguage;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
public class Student extends User {
    @NotEmpty
    @ManyToMany
    @JoinTable(
            name = "student_learning_language",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "learning_language_id")
    )
    private List<LearningLanguage> learningLanguages;
    @NotNull
    private TeachingStyle preferredTeachingStyle;
    @ElementCollection
    private List<String> learningGoals;
}
