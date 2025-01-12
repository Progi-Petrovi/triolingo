package com.triolingo.entity.language;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;

import javax.validation.constraints.NotNull;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
@Data
public class Language {
    @Id
    private Long id;
    @NotNull
    private String name;
}
