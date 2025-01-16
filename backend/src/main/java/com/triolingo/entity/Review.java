package com.triolingo.entity;

import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;

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
    private Teacher teacher;
    @NotNull
    @ManyToOne
    private Student student;
    @NotNull
    private String content = "";
    @NotNull
    private Integer rating;
    private Instant date = Instant.now();
}
