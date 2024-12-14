package com.triolingo.controller;

import com.triolingo.dto.student.StudentCreateDTO;
import com.triolingo.dto.student.StudentGetDTO;
import com.triolingo.dto.student.StudentTranslator;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.StudentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import jakarta.persistence.EntityExistsException;
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
    private final StudentTranslator studentTranslator;

    public StudentController(StudentService studentService, StudentTranslator studentTranslator) {
        this.studentService = studentService;
        this.studentTranslator = studentTranslator;
    }

    @GetMapping("/all")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Returns information regarding all students registered within the application.")
    public List<StudentGetDTO> listStudents() {
        return studentService.listAll().stream().map(student -> studentTranslator.toDTO(student)).toList();
    }

    @GetMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Returns information regarding student with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public StudentGetDTO getStudent(@PathVariable("id") Long id) {
        return studentTranslator.toDTO(studentService.fetch(id));
    }

    @GetMapping("/")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Returns information regarding student the current principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public StudentGetDTO getStudent(@AuthenticationPrincipal DatabaseUser principal) {
        return studentTranslator.toDTO(studentService.fetch(principal.getStoredUser().getId()));
    }

    @PostMapping("/create")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Creates a new student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Student with that email already exists.", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<?> createStudent(@RequestBody StudentCreateDTO studentDto) {
        try {
            studentService.createStudent(studentDto);
        } catch (EntityExistsException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/register")
    @Operation(description = "Creates a new student and logs the current principal in as that student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Student with that email already exists.", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<?> registerStudent(@RequestBody StudentCreateDTO studentDto, HttpServletRequest request)
            throws ServletException {
        studentService.createStudent(studentDto);
        request.login(studentDto.email(), studentDto.password());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Updates the student with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<?> updateStudent(@PathVariable("id") Long id, @RequestBody StudentCreateDTO studentDto) {
        try {
            studentService.updateStudent(id, studentDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    @Secured("ROLE_STUDENT")
    @Operation(description = "Updates the student the current principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<?> updateStudent(@RequestBody StudentCreateDTO studentDto,
            @AuthenticationPrincipal DatabaseUser principal) {
        try {
            studentService.updateStudent(principal.getStoredUser().getId(), studentDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Deletes the student with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<?> deleteStudent(@PathVariable("id") Long id) {
        try {
            studentService.deleteStudent(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

}
