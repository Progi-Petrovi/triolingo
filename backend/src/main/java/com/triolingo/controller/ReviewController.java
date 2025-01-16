package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.review.ReviewCreateDTO;
import com.triolingo.dto.review.ReviewSendDTO;
import com.triolingo.dto.review.ReviewViewDTO;
import com.triolingo.entity.Review;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.ReviewService;
import com.triolingo.service.StudentService;
import com.triolingo.service.TeacherService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/review")
public class ReviewController {

    private final ReviewService reviewService;
    private final TeacherService teacherService;
    private final StudentService studentService;
    private final DtoMapper dtoMapper;

    public ReviewController(ReviewService reviewService, TeacherService teacherService, StudentService studentService,
            DtoMapper dtoMapper) {
        this.reviewService = reviewService;
        this.teacherService = teacherService;
        this.studentService = studentService;
        this.dtoMapper = dtoMapper;
    }

    @GetMapping("/teacher/{id}")
    @Operation(description = "Returns reviews of teacher with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", description = "Teacher not found", content = @Content(schema = @Schema()))
    })
    public List<ReviewSendDTO> listTeacherReviews(@PathVariable Long id) {
        Teacher teacher = teacherService.fetch(id);
        return reviewService.findAllByTeacher(teacher).stream()
                .map(review -> dtoMapper.createDto(review, ReviewSendDTO.class)).toList();
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('STUDENT') and hasRole('VERIFIED')")
    @Operation(description = "Creates new review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Wrong input data", content = @Content(schema = @Schema()))
    })
    public ReviewViewDTO createReview(@RequestBody ReviewCreateDTO reviewDto,
            @AuthenticationPrincipal DatabaseUser principle) {
        Student student = studentService.fetch(principle.getStoredUser().getId());
        Logger.getLogger("ReviewController").info("Creating review: " + reviewDto);
        Review review = reviewService.createReview(reviewDto, student);
        Teacher teacher = review.getTeacher();
        List<Review> teacherReviews = reviewService.findAllByTeacher(teacher);
        if (teacherReviews.stream()
                .anyMatch(r -> r.getStudent().getId().equals(student.getId()))) {
            throw new IllegalArgumentException("You have already reviewed this teacher");
        }
        Logger.getLogger("ReviewController").info("Review created: " + review);
        return dtoMapper.createDto(review, ReviewViewDTO.class);
    }
}
