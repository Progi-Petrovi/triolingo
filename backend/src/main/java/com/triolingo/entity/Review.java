package com.triolingo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.time.Instant;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Review {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @ManyToOne
    private Teacher reviewedTeacher;
    @NotNull
    @ManyToOne
    private Student studentReview;
    @NotNull
    private String content;
    @NotNull
    private Integer rating;
    private Instant date = Instant.now();
}
