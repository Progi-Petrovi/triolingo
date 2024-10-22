package com.triolingo.entity.teacher;

import com.triolingo.entity.Language;
import com.triolingo.entity.User;
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
public class Teacher extends User {
    @NotEmpty
    @ManyToMany
    @JoinTable(
            name = "teacher_language",
            joinColumns = @JoinColumn(name = "teacher_id"),
            inverseJoinColumns = @JoinColumn(name = "language_id")
    )
    private List<Language> languages;
    @NotNull
    private Integer yearsOfExperience;
    @ElementCollection
    @NotEmpty
    private List<String> qualifications;
    @NotNull
    private TeachingStyle teachingStyle;
    private String profilePicture;
    @NotNull
    private Double hourlyRate;
}
