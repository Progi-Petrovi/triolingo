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
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.security.access.annotation.Secured;
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
    // @Secured("ROLE_USER")
    public List<ReviewSendDTO> listTeacherReviews(@PathVariable Long id) {
        Teacher teacher = teacherService.fetch(id);
        return reviewService.findAllByTeacher(teacher).stream()
                .map(review -> dtoMapper.createDto(review, ReviewSendDTO.class)).toList();
    }

    @PostMapping("/create")
    @Secured("ROLE_STUDENT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Wrong input data", content = @Content(schema = @Schema()))
    })
    public ReviewViewDTO createReview(@RequestBody ReviewCreateDTO reviewDto,
            @AuthenticationPrincipal DatabaseUser principle) {
        Student student = studentService.fetch(principle.getStoredUser().getId());
        Logger.getLogger("ReviewController").info("Creating review: " + reviewDto);
        Review review = reviewService.createReview(reviewDto, student);
        Logger.getLogger("ReviewController").info("Review created: " + review);
        return dtoMapper.createDto(review, ReviewViewDTO.class);
    }
}
