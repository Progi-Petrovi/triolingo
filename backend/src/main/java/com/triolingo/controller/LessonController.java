package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.lesson.LessonAvailabilityIntervalCreateDTO;
import com.triolingo.dto.lesson.LessonAvailabilityIntervalGetDTO;
import com.triolingo.entity.user.Teacher;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.LessonService;
import com.triolingo.service.TeacherService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.mail.MessagingException;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lesson")
public class LessonController {
    private final LessonService lessonService;
    private final TeacherService teacherService;
    private final DtoMapper dtoMapper;

    public LessonController(LessonService lessonService, TeacherService teacherService, DtoMapper dtoMapper) {
        this.lessonService = lessonService;
        this.teacherService = teacherService;
        this.dtoMapper = dtoMapper;
    }

    @PostMapping("/availability/create")
    @Secured("ROLE_TEACHER")
    @Operation(description = "Creates a new lesson availability interval. Intervals overlapping or fully contained within the new interval are deleted and merged into the new interval.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Start instant must be set before the end instant", content = @Content(schema = @Schema()))
    })
    @Transactional
    public ResponseEntity<?> createAvailability(@AuthenticationPrincipal DatabaseUser principal,
            @RequestBody LessonAvailabilityIntervalCreateDTO dto) throws MessagingException {
        lessonService.createAvailabiltyInterval((Teacher) principal.getStoredUser(), dto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/availability")
    @Secured("ROLE_TEACHER")
    @Operation(description = "Retrieves all the availability intervals associated with the currently logged in teacher.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200")
    })
    public List<LessonAvailabilityIntervalGetDTO> getAllAvailabilities(
            @AuthenticationPrincipal DatabaseUser principal) {
        return lessonService.findAllByTeacher((Teacher) principal.getStoredUser()).stream()
                .map((teacher) -> dtoMapper.createDto(teacher, LessonAvailabilityIntervalGetDTO.class))
                .toList();
    }

    @GetMapping("/availability/{id}")
    @Secured("ROLE_USER")
    @Operation(description = "Retrieves all the availability intervals associated with the specified teacher.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Failed to find teacher with specified id", content = @Content(schema = @Schema()))
    })
    public List<LessonAvailabilityIntervalGetDTO> getAllAvailabilities(@PathVariable("id") Long id) {
        return lessonService.findAllByTeacher(teacherService.fetch(id)).stream()
                .map((teacher) -> dtoMapper.createDto(teacher, LessonAvailabilityIntervalGetDTO.class))
                .toList();
    }
}
