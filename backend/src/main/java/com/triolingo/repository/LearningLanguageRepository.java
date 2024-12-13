package com.triolingo.repository;

import com.triolingo.entity.language.*;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LearningLanguageRepository extends JpaRepository<LearningLanguage, Long> {
    Optional<LearningLanguage> findByLanguageAndKnowledgeLevel(Language language, KnowledgeLevel knowledgeLevel);
}
