package com.triolingo.entity.lesson;

import java.time.Instant;
import javax.validation.constraints.*;

import com.triolingo.entity.user.Teacher;
import com.triolingo.entity.language.Language;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
@Data
public class Lesson {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private Instant startInstant, endInstant;
    @NotNull
    private Status status;
    @ManyToOne
    @NotNull
    private Teacher teacher;
    @ManyToOne
    @NotNull
    private Language language;
    @NotNull
    private Double teacherPayment;

    public enum Status {
        OPEN,
        CLOSED,
        CANCELED,
        COMPLETE
    }
}
