package com.triolingo.entity.language;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LearningLanguage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Language language;
    private KnowledgeLevel knowledgeLevel;

    public LearningLanguage(Language language, KnowledgeLevel knowledgeLevel) {
        this.language = language;
        this.knowledgeLevel = knowledgeLevel;
    }
}
