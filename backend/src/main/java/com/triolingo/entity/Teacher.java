package com.triolingo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull
    private String name;
    @NotNull
    private String surname;
    @NotNull
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", flags = Pattern.Flag.CASE_INSENSITIVE)
    private String email;
    /**
     * This field should probably be a separate table with id's and name of language
     * So that on frontend we have a dropdown menu with supported languages (just take languages from Google Translate?)
     * TBD
     */
    @ElementCollection
    @NotEmpty
    private List<String> languages;
    @NotNull
    private Integer yearsOfExperience;
    @ElementCollection
    @NotEmpty
    private List<String> qualifications;
    /**
     * Should we have pre-prepared teaching styles?
     * Student can filter via teaching style, so we should probably think of something
     * example: focused on theory, focused on practice, focused on intuition...
     * TBD
     */
    private String teachingStyle;
    private String profilePicture;
    @NotNull
    private Double hourlyRate;
}
