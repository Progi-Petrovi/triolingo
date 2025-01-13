package com.triolingo.service;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.review.ReviewCreateDTO;
import com.triolingo.entity.Review;
import com.triolingo.entity.user.Teacher;
import com.triolingo.repository.LessonRepository;
import com.triolingo.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final LessonRepository lessonRepository;
    private final DtoMapper dtoMapper;

    public ReviewService(ReviewRepository reviewRepository, LessonRepository lessonRepository, DtoMapper dtoMapper) {
        this.reviewRepository = reviewRepository;
        this.lessonRepository = lessonRepository;
        this.dtoMapper = dtoMapper;
    }

    public List<Review> findAllByTeacher(Teacher teacher) {
        return reviewRepository.findAllByTeacher(teacher);
    }

    public Review createReview(ReviewCreateDTO reviewDto) {
        Review review = dtoMapper.createEntity(reviewDto, Review.class);
        if (!lessonRepository.existsByTeacherAndAcceptedStudentAndComplete(review.getTeacher(), review.getStudent()))
            throw new IllegalArgumentException(
                    "Reviews are only allowed to be posted by students who have been accepted to al least one lesson by the teacher.");
        return reviewRepository.save(review);
    }

    public Review fetch(Long id) {
        try {
            return reviewRepository.findById(id).get();
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Review not found.");
        }
    }

    public void delete(Long id) {
        reviewRepository.deleteById(id);
    }
}
