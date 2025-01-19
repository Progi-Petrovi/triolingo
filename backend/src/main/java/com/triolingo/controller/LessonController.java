package com.triolingo.controller;

import com.triolingo.aggregate.LessonAggregate;
import com.triolingo.aggregate.LessonBulkAggregate;
import com.triolingo.aggregate.LessonRequestAggregate;
import com.triolingo.aggregate.LessonRequestBulkAggregate;
import com.triolingo.dto.lesson.*;
import com.triolingo.entity.lesson.Lesson;
import com.triolingo.entity.lesson.LessonRequest;
import com.triolingo.entity.user.Student;
import com.triolingo.entity.user.Teacher;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.LessonService;
import com.triolingo.service.StudentService;
import com.triolingo.service.TeacherService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.messaging.simp.SimpMessagingTemplate;

@RestController
@RequestMapping("/lesson")
public class LessonController {
    private final LessonService lessonService;
    private final TeacherService teacherService;
    private final StudentService studentService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public LessonController(LessonService lessonService, TeacherService teacherService, StudentService studentService) {
        this.lessonService = lessonService;
        this.teacherService = teacherService;
        this.studentService = studentService;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') and hasRole('VERIFIED') or hasRole('ADMIN')")
    @Operation(description = "Returns lesson with the specified id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public LessonAggregate getById(@PathVariable("id") Long id) {
        return lessonService.generateAggregate(lessonService.fetch(id));
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER') and hasRole('VERIFIED')")
    @Operation(description = "Returns all lessons created by the currently logged in teacher")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200")
    })
    public LessonBulkAggregate getByTeacher(@AuthenticationPrincipal DatabaseUser principal) {
        Teacher teacher = teacherService.fetch(principal.getStoredUser().getId());
        return lessonService.generateBulkAggregate(lessonService.findAllByTeacher(teacher));
    }

    @GetMapping("/teacher/{id}")
    @PreAuthorize("hasRole('USER') and hasRole('VERIFIED') or hasRole('ADMIN')")
    @Operation(description = "Returns all lessons created by the specified teacher.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public LessonBulkAggregate getByTeacher(@PathVariable("id") Long id) {
        Teacher teacher = teacherService.fetch(id);
        return lessonService.generateBulkAggregate(lessonService.findAllByTeacher(teacher));
    }

    @GetMapping("/student/{id}")
    @Secured({ "ROLE_ADMIN" })
    @Operation(description = "Returns all lessons with existing request originating from the specified student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public LessonBulkAggregate getByStudent(@PathVariable("id") Long id) {
        Student student = studentService.fetch(id);
        return lessonService.generateBulkAggregate(lessonService.findAllByStudent(student));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT') and hasRole('VERIFIED')")
    @Operation(description = "Returns all lessons with existing request originating from the logged in student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public LessonBulkAggregate getByStudent(@AuthenticationPrincipal DatabaseUser principal) {
        Student student = studentService.fetch(principal.getStoredUser().getId());
        return lessonService.generateBulkAggregate(lessonService.findAllByStudent(student));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER') and hasRole('VERIFIED') or hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('TEACHER') and hasRole('VERIFIED') or hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('TEACHER') and hasRole('VERIFIED') or hasRole('ADMIN')")
    @Operation(description = "Returns all requests for specified lesson id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public LessonRequestBulkAggregate getRequestsByLesson(@PathVariable("id") Long id,
            @AuthenticationPrincipal DatabaseUser principal) {
        Lesson lesson = lessonService.fetch(id);
        if (lesson.getTeacher().getId() != principal.getStoredUser().getId())
            throw new IllegalArgumentException("You are not the owner of the lesson");
        return lessonService.generateRequestBulkAggregate(lessonService.findAllRequestsByLesson(lesson));
    }

    @GetMapping("/requests/teacher")
    @PreAuthorize("hasRole('TEACHER') and hasRole('VERIFIED')")
    @Operation(description = "Returns all requests for logged in teacher")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public LessonRequestBulkAggregate getRequestsByTeacher(@AuthenticationPrincipal DatabaseUser principal) {
        Teacher teacher = teacherService.fetch(principal.getStoredUser().getId());
        return lessonService.generateRequestBulkAggregate(lessonService.findAllRequestsByTeacher(teacher));
    }

    @GetMapping("/requests/student")
    @PreAuthorize("hasRole('STUDENT') and hasRole('VERIFIED')")
    @Operation(description = "Returns all requests for logged in student")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public LessonRequestBulkAggregate getRequestsByStudent(@AuthenticationPrincipal DatabaseUser principal) {
        Student student = studentService.fetch(principal.getStoredUser().getId());
        return lessonService.generateRequestBulkAggregate(lessonService.findAllRequestsByStudent(student));
    }

    @PostMapping("/request/{id}")
    @PreAuthorize("hasRole('STUDENT') and hasRole('VERIFIED') or hasRole('ADMIN')")
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
        LessonRequest request = lessonService.createRequest(student, lesson);

        LessonRequestAggregate requestAggregate = lessonService.generateRequestAggregate(request);
        messagingTemplate.convertAndSendToUser(lesson.getTeacher().getEmail(), "/topic/lesson-requests",
                requestAggregate);

        return new ResponseEntity<>(request.getId(), HttpStatus.OK);
    }

    @PutMapping("/request/{id}")
    @PreAuthorize("hasRole('TEACHER') and hasRole('VERIFIED') or hasRole('ADMIN')")
    @Operation(description = "Updates the request status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", content = @Content(schema = @Schema())),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> updateRequest(@PathVariable("id") Long id, @RequestBody LessonRequestUpdateDTO dto) {
        LessonRequest request = lessonService.fetchRequest(id);
        lessonService.setRequestStatus(request, dto.status());

        LessonRequestAggregate requestAggregate = lessonService.generateRequestAggregate(request);

        if (dto.status() == LessonRequest.Status.ACCEPTED) {
            messagingTemplate.convertAndSendToUser(request.getStudent().getEmail(),
                    "/topic/lesson-request-accepted", requestAggregate);
        } else if (dto.status() == LessonRequest.Status.REJECTED) {
            messagingTemplate.convertAndSendToUser(request.getStudent().getEmail(),
                    "/topic/lesson-request-rejected", requestAggregate);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
