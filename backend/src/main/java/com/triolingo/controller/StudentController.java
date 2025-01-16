package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.student.*;
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

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Transactional
@RequestMapping("/student")
public class StudentController {

    private final StudentService studentService;
    private final TeacherService teacherService;
    private final LessonService lessonService;
    private final DtoMapper dtoMapper;

    public StudentController(StudentService studentService, TeacherService teacherService, LessonService lessonService,
            DtoMapper dtoMapper) {
        this.studentService = studentService;
        this.teacherService = teacherService;
        this.lessonService = lessonService;
        this.dtoMapper = dtoMapper;
    }

    @GetMapping("/all")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Returns information regarding all students registered within the application.")
    public List<StudentViewDTO> listStudents() {
        return studentService.listAll().stream().map((student) -> dtoMapper.createDto(student, StudentViewDTO.class))
                .toList();
    }

    @GetMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Returns information regarding student with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public StudentViewDTO getStudent(@PathVariable("id") Long id) {
        return dtoMapper.createDto(studentService.fetch(id), StudentViewDTO.class);
    }

    @GetMapping
    @Secured("ROLE_STUDENT")
    @Operation(description = "Returns information regarding student the current principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public StudentFullDTO getStudent(@AuthenticationPrincipal DatabaseUser principal) {
        Student student = studentService.fetch(principal.getStoredUser().getId());
        return dtoMapper.createDto(student, StudentFullDTO.class);
    }

    @PostMapping("/create")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Creates a new student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Student with that email already exists.", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> createStudent(@RequestBody StudentCreateDTO studentDto) {
        studentService.create(studentDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/register")
    @Operation(description = "Creates a new student and logs the current principal in as that student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201"),
            @ApiResponse(responseCode = "400", description = "Student with that email already exists.", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> registerStudent(@RequestBody StudentCreateDTO studentDto, HttpServletRequest request)
            throws ServletException {
        studentService.create(studentDto);
        request.login(studentDto.email(), studentDto.password());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Updates the student with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> updateStudent(@PathVariable("id") Long id, @RequestBody StudentUpdateDTO studentDto) {
        Student student = studentService.fetch(id);
        studentService.update(student, studentDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('STUDENT') and hasRole('VERIFIED')")
    @Operation(description = "Updates the student the current principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> updateStudent(@RequestBody StudentUpdateDTO studentDto,
            @AuthenticationPrincipal DatabaseUser principal) {
        studentService.update((Student) principal.getStoredUser(), studentDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}/email")
    @PreAuthorize("hasRole('TEACHER') and hasRole('VERIFIED')")
    @Operation(description = "Returns student email if the logged in teacher has an approved lesson request with the student")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", content = @Content(schema = @Schema())),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public String getTeacherEmail(@AuthenticationPrincipal DatabaseUser principal,
            @PathVariable("id") Long id) {
        Student student = studentService.fetch(id);
        Teacher teacher = teacherService.fetch(principal.getStoredUser().getId());
        if (!lessonService.requestExistsByTeacherAndStudentAndStatus(teacher, student, LessonRequest.Status.ACCEPTED))
            throw new IllegalArgumentException("You don't have an accepted request with that teacher");
        return student.getEmail();
    }

}
