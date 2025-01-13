package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.review.ReviewCreateDTO;
import com.triolingo.dto.review.ReviewSendDTO;
import com.triolingo.dto.review.ReviewViewDTO;
import com.triolingo.entity.Review;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.service.ReviewService;
import com.triolingo.service.TeacherService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.persistence.Basic;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/review")
public class ReviewController {

    private final ReviewService reviewService;
    private final TeacherService teacherService;

    public ReviewController(ReviewService reviewService, TeacherService teacherService) {
        this.reviewService = reviewService;
        this.teacherService = teacherService;
    }

    @GetMapping("/teacher/{id}")
    //@Secured("ROLE_USER")
    public List<ReviewSendDTO> listTeacherReviews(@PathVariable Long id) {
        Teacher teacher = teacherService.fetch(id);
        List<Review> reviews = reviewService.listTeacherReviews(teacher.getId());
        List<ReviewSendDTO> reviewDtos = new ArrayList<ReviewSendDTO>();
        for (Review review : reviews) {
            reviewDtos.add(new ReviewSendDTO(review.getId(), review.getReviewedTeacher().getId(),
                    review.getStudentReview().getFullName(), review.getRating(), review.getContent(), review.getDate()));
        }
        return reviewDtos;
    }

    @PostMapping("/create")
    @Secured("ROLE_STUDENT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Wrong input data", content = @Content(schema=@Schema()))
    })
    public ReviewViewDTO createReview(@RequestBody ReviewCreateDTO reviewDto) {
        Logger.getLogger("ReviewController").info("Creating review: " + reviewDto);
        Review review = reviewService.createReview(reviewDto);
        Logger.getLogger("ReviewController").info("Review created: " + review);
        return new ReviewViewDTO(review.getId(), review.getReviewedTeacher().getId(),
                review.getStudentReview().getId(), review.getRating(), review.getContent(), review.getDate());
    }
}
