package com.triolingo.entity.lesson;

import javax.validation.constraints.*;

import com.triolingo.entity.user.Student;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
@Table(uniqueConstraints = @UniqueConstraint(columnNames = { "student_id", "lesson_id" }))

@Data
public class LessonRequest {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private Status status;
    @ManyToOne
    @NotNull
    @JoinColumn(name = "student_id")
    private Student student;
    @ManyToOne
    @NotNull
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    public enum Status {
        PENDING,
        ACCEPTED,
        REJECTED
    }

}