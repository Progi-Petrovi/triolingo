package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.review.ReviewCreateDTO;
import com.triolingo.dto.review.ReviewViewDTO;
import com.triolingo.entity.Review;
import com.triolingo.service.ReviewService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
public class ReviewController {

    private final ReviewService reviewService;
    private final DtoMapper dtoMapper;

    public ReviewController(ReviewService reviewService, DtoMapper dtoMapper) {
        this.reviewService = reviewService;
        this.dtoMapper = dtoMapper;
    }

    @GetMapping("/teacher/{id}")
    //@Secured("ROLE_USER")
    public List<ReviewViewDTO> listTeacherReviews(@PathVariable Long id) {
        return reviewService.listTeacherReviews(id).stream()
                .map((review) -> dtoMapper.createDto(review, ReviewViewDTO.class))
                .toList();
    }

    @PostMapping("/create")
    @Secured("ROLE_STUDENT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Wrong input data", content = @Content(schema=@Schema()))
    })
    @Transactional
    public ReviewViewDTO createReview(@RequestBody ReviewCreateDTO reviewDto) {
        System.out.println("ReviewController.createReview");
        System.out.println("reviewDto = " + reviewDto);
        Review review = reviewService.createReview(reviewDto);
        return dtoMapper.createDto(review, ReviewViewDTO.class);
    }
}
