package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.lesson.*;
import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.lesson.LessonRequest;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.repository.LessonRequestRepository;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.LessonService;
import com.triolingo.service.StudentService;
import com.triolingo.service.TeacherService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lesson")
public class LessonController {
    private final LessonService lessonService;
    private final TeacherService teacherService;
    private final StudentService studentService;
    private final DtoMapper dtoMapper;
    private final LessonRequestRepository lessonRequestRepository;

    public LessonController(LessonService lessonService, TeacherService teacherService, StudentService studentService,
                            DtoMapper dtoMapper, LessonRequestRepository lessonRequestRepository) {
        this.lessonService = lessonService;
        this.teacherService = teacherService;
        this.studentService = studentService;
        this.dtoMapper = dtoMapper;
        this.lessonRequestRepository = lessonRequestRepository;
    }

    @GetMapping("/{id}")
    @Secured({ "ROLE_USER", "ROLE_VERIFIED" })
    @Operation(description = "Returns lesson with the specified id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public LessonViewDTO getById(@PathVariable("id") Long id) {
        return dtoMapper.createDto(lessonService.fetch(id), LessonViewDTO.class);
    }

    @GetMapping("/teacher")
    @Secured({ "ROLE_TEACHER", "ROLE_VERIFIED" })
    @Operation(description = "Returns all lessons created by the currently logged in teacher")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200")
    })
    public List<LessonViewDTO> getByTeacher(@AuthenticationPrincipal DatabaseUser principal) {
        Teacher teacher = teacherService.fetch(principal.getStoredUser().getId());
        return lessonService.findAllByTeacher(teacher).stream()
                .map((lesson) -> dtoMapper.createDto(lesson, LessonViewDTO.class)).toList();
    }

    @GetMapping("/teacher/{id}")
    @Secured({ "ROLE_USER", "ROLE_VERIFIED" })
    @Operation(description = "Returns all lessons created by the specified teacher.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public List<LessonViewDTO> getByTeacher(@PathVariable("id") Long id) {
        Teacher teacher = teacherService.fetch(id);
        return lessonService.findAllByTeacher(teacher).stream()
                .map((lesson) -> dtoMapper.createDto(lesson, LessonViewDTO.class)).toList();
    }

    @PostMapping
    @Secured({ "ROLE_TEACHER", "ROLE_VERIFIED" })
    @Operation(description = "Creates a new lesson")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201"),
            @ApiResponse(responseCode = "400", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> create(@AuthenticationPrincipal DatabaseUser principal, @RequestBody LessonCreateDTO dto) {
        Teacher teacher = teacherService.fetch(principal.getStoredUser().getId());
        lessonService.create(teacher, dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Secured({ "ROLE_TEACHER", "ROLE_VERIFIED" })
    @Operation(description = "Updates the lesson status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", content = @Content(schema = @Schema())),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> create(@AuthenticationPrincipal DatabaseUser principal, @PathVariable("id") Long id,
            @RequestBody LessonUpdateDTO dto) {
        Lesson lesson = lessonService.fetch(id);
        if (lesson.getTeacher().getId() != principal.getStoredUser().getId())
            throw new IllegalArgumentException("You are not the owner of this lesson");
        lessonService.setStatus(lesson, dto.status());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/requests/{id}")
    @Secured({ "ROLE_TEACHER", "ROLE_VERIFIED" })
    @Operation(description = "Returns all requests for specified lesson id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public List<LessonRequestViewDTO> getRequestsByLesson(@PathVariable("id") Long id,
            @AuthenticationPrincipal DatabaseUser principal) {
        Lesson lesson = lessonService.fetch(id);
        if (lesson.getTeacher().getId() != principal.getStoredUser().getId())
            throw new IllegalArgumentException("You are not the owner of the lesson");
        return lessonService.findAllRequestsByLesson(lesson).stream()
                .map((request) -> dtoMapper.createDto(request, LessonRequestViewDTO.class)).toList();
    }

    @GetMapping("/requests/teacher")
    @Secured({ "ROLE_TEACHER", "ROLE_VERIFIED" })
    @Operation(description = "Returns all requests for logged in teacher")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public List<LessonRequestViewDTO> getRequestsByTeacher(@AuthenticationPrincipal DatabaseUser principal) {
        Teacher teacher = teacherService.fetch(principal.getStoredUser().getId());
        List<LessonRequest> teachRequests = lessonService.findAllRequestsByTeacher(teacher);
        return teachRequests.stream().map((request) -> {
            Lesson lesson = request.getLesson();
            return (new LessonRequestViewDTO(request.getStudent().getFullName(), request.getId(), request.getLesson().getId(), teacher.getFullName(),
                    lesson.getStartInstant(), lesson.getEndInstant(), request.getLesson().getLanguage().getName(), request.getStatus()));
        }).toList();
    }

    @GetMapping("/requests/student")
    @Secured({ "ROLE_STUDENT", "ROLE_VERIFIED" })
    @Operation(description = "Returns all requests for logged in student")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public List<LessonRequestViewDTO> getRequestsByStudent(@AuthenticationPrincipal DatabaseUser principal) {
        Student student = studentService.fetch(principal.getStoredUser().getId());
        List<LessonRequest> studentRequests = lessonService.findAllRequestsByStudent(student);
        return studentRequests.stream().map((request) -> {
            Lesson lesson = request.getLesson();
            return (new LessonRequestViewDTO(student.getFullName(), request.getId(), request.getLesson().getId(), lesson.getTeacher().getFullName(),
                    lesson.getStartInstant(), lesson.getEndInstant(), lesson.getLanguage().getName(), request.getStatus()));
        }).toList();
    }

    @PostMapping("/request/{id}")
    @Secured({ "ROLE_STUDENT", "ROLE_VERIFIED" })
    @Operation(description = "Creates a request for the specified lesson")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201"),
            @ApiResponse(responseCode = "400", content = @Content(schema = @Schema())),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> createRequest(@AuthenticationPrincipal DatabaseUser principal,
            @PathVariable("id") Long id) {
        Lesson lesson = lessonService.fetch(id);
        Student student = studentService.fetch(principal.getStoredUser().getId());
        lessonService.createRequest(student, lesson);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/request/{id}")
    @Secured({ "ROLE_TEACHER", "ROLE_VERIFIED" })
    @Operation(description = "Updates the request status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", content = @Content(schema = @Schema())),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> updateRequest(@AuthenticationPrincipal DatabaseUser principal, @PathVariable("id") Long id,
            @RequestBody LessonRequestUpdateDTO dto) {
        LessonRequest lessonRequest = lessonRequestRepository.findById(id).get();
        if (dto.status() == LessonRequest.Status.REJECTED) {
            lessonRequestRepository.delete(lessonRequest);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        /*if (dto.status() == LessonRequest.Status.ACCEPTED) {
            ;
        }*/
        lessonRequest.setStatus(dto.status());
        lessonRequestRepository.save(lessonRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
