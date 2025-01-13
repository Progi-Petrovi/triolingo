package com.triolingo.repository;

import com.triolingo.entity.Review;
import com.triolingo.entity.user.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByTeacher(Teacher teacher);
}
