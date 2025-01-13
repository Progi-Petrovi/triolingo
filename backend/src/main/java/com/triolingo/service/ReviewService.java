package com.triolingo.service;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.review.ReviewCreateDTO;
import com.triolingo.entity.Review;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.repository.ReviewRepository;
import com.triolingo.repository.StudentRepository;
import com.triolingo.repository.TeacherRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final DtoMapper dtoMapper;

    public ReviewService(ReviewRepository reviewRepository, TeacherRepository teacherRepository, StudentRepository studentRepository, DtoMapper dtoMapper) {
        this.reviewRepository = reviewRepository;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.dtoMapper = dtoMapper;
    }

    public List<Review> listTeacherReviews(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found."));
        return reviewRepository.findByReviewedTeacher(teacher);
    }

    public Review createReview(ReviewCreateDTO reviewDto) {
        Teacher teacher = teacherRepository.findById(reviewDto.teacherId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found."));
        Student student = studentRepository.findById(reviewDto.studentId())
                .orElseThrow(() -> new EntityNotFoundException("User not found."));

        Review review = new Review();
        review.setReviewedTeacher(teacher);
        review.setStudentReview(student);
        review.setRating(reviewDto.rating());
        review.setContent(reviewDto.comment());

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
