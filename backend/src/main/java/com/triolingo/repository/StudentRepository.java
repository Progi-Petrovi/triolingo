package com.triolingo.repository;

import java.util.List;
import java.util.Optional;

import com.triolingo.entity.language.LearningLanguage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.triolingo.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    List<LearningLanguage> getLearningLanguages(Long id);
}
