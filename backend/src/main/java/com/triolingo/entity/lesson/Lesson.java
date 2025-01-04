package com.triolingo.entity.lesson;

import java.time.Instant;

import javax.validation.constraints.*;

import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.entity.language.Language;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Lesson {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private Instant date;
    @NotNull
    private LessonStatus status;
    @ManyToOne
    @NotNull
    private Teacher teacher;
    @ManyToOne
    @NotNull
    private Student student;
    @ManyToOne
    @NotNull
    private Language language;
    @NotNull
    private Double teacherPayment;
}