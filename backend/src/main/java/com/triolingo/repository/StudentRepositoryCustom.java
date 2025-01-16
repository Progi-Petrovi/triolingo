package com.triolingo.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;

@Repository
public interface StudentRepositoryCustom {
    List<Student> findAllByTeacher(Teacher teacher);
}
