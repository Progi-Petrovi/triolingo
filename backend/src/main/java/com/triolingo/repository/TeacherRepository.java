package com.triolingo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.triolingo.entity.user.Teacher;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long>, TeacherRepositoryCustom {
    Optional<Teacher> findByEmail(String email);

    boolean existsByEmail(String email);
}
