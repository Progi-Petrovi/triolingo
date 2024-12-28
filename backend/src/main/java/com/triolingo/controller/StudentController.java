package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.student.*;
import com.triolingo.entity.user.Student;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.StudentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentController {

    private final StudentService studentService;
    private final DtoMapper dtoMapper;
    private final EntityManager entityManager;

    public StudentController(StudentService studentService, DtoMapper dtoMapper, EntityManager entityManager) {
        this.studentService = studentService;
        this.dtoMapper = dtoMapper;
        this.entityManager = entityManager;
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

    @GetMapping("/")
    @Secured("ROLE_STUDENT")
    @Operation(description = "Returns information regarding student the current principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public StudentFullDTO getStudent(@AuthenticationPrincipal DatabaseUser principal) {
        entityManager.refresh(principal.getStoredUser());
        return dtoMapper.createDto(principal.getStoredUser(), StudentFullDTO.class);
    }

    @PostMapping("/create")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Creates a new student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Student with that email already exists.", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> createStudent(@RequestBody StudentCreateDTO studentDto) {
        try {
            studentService.create(studentDto);
        } catch (EntityExistsException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/register")
    @Operation(description = "Creates a new student and logs the current principal in as that student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Student with that email already exists.", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> registerStudent(@RequestBody StudentCreateDTO studentDto, HttpServletRequest request)
            throws ServletException {
        try {
            studentService.create(studentDto);
        } catch (EntityExistsException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
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
    public ResponseEntity<?> updateStudent(@PathVariable("id") Long id, @RequestBody StudentCreateDTO studentDto) {
        try {
            Student student = studentService.fetch(id);
            studentService.update(student, studentDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    @Secured("ROLE_STUDENT")
    @Operation(description = "Updates the student the current principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> updateStudent(@RequestBody StudentCreateDTO studentDto,
            @AuthenticationPrincipal DatabaseUser principal) {
        try {
            entityManager.refresh(principal.getStoredUser());
            studentService.update((Student) principal.getStoredUser(), studentDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Deletes the student with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> deleteStudent(@PathVariable("id") Long id) {
        try {
            Student student = studentService.fetch(id);
            studentService.delete(student);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

}
