package com.triolingo.entity.lesson;

import java.time.Instant;

import javax.validation.constraints.*;

import com.triolingo.entity.user.Teacher;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class LessonAvailabilityInterval {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private Instant startTimestamp, endTimestamp;
    @ManyToOne
    @NotNull
    private Teacher teacher;
}