package com.triolingo.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.triolingo.dto.teacher.TeacherFilterDTO;
import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.user.Teacher;

@Repository
public interface TeacherRepositoryCustom {
    public List<Teacher> listAll(List<String> languages, Integer minYearsOfExperience, Integer maxYearsOfExperience,
            List<TeachingStyle> teachingStyles, Double minHourlyRate, Double maxHourlyRate,
            TeacherFilterDTO.Order order);
}
