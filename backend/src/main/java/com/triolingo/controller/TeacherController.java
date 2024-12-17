package com.triolingo.controller;

import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.dto.teacher.TeacherGetDTO;
import com.triolingo.dto.teacher.TeacherTranslator;
import com.triolingo.entity.Teacher;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.TeacherService;

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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@RestController
@RequestMapping("/teacher")
public class TeacherController {

    private final TeacherService teacherService;
    private final TeacherTranslator teacherTranslator;

    public TeacherController(TeacherService teacherService, TeacherTranslator teacherTranslator) {
        this.teacherService = teacherService;
        this.teacherTranslator = teacherTranslator;
    }

    @GetMapping("/all")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Returns information regarding all teachers registered within the application.")
    public List<TeacherGetDTO> listTeachers() {
        return teacherService.listAll().stream().map((teacher) -> teacherTranslator.toDTO(teacher)).toList();
    }

    @GetMapping("/{id}")
    @Secured("ROLE_USER") // TODO: add ROLE_GUEST when guest is setup
    @Operation(description = "Returns information regarding teacher with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public TeacherGetDTO getTeacher(@PathVariable("id") Long id) {
        return teacherTranslator.toDTO(teacherService.fetch(id));
    }

    @GetMapping("/")
    @Secured("ROLE_TEACHER") // TODO: add ROLE_GUEST when guest is setup
    @Operation(description = "Returns information regarding teacher the current principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public TeacherGetDTO getTeacher(@AuthenticationPrincipal DatabaseUser principal) {
        return teacherTranslator.toDTO(teacherService.fetch(principal.getStoredUser().getId()));
    }

    @PostMapping("/create")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Creates a new teacher.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Teacher with that email already exists.", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<?> createTeacher(@RequestBody TeacherCreateDTO teacherDto) {
        try {
            teacherService.createTeacher(teacherDto);
        } catch (EntityExistsException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/register")
    @Operation(description = "Creates a new teacher and logs the current principal in as that student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Teacher with that email already exists.", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<?> registerTeacher(@RequestBody TeacherCreateDTO teacherDto, HttpServletRequest request)
            throws ServletException {
        teacherService.createTeacher(teacherDto);
        request.login(teacherDto.email(), teacherDto.password());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Updates the teacher with {id}. If profile image hash is set to null, the image is also deleted from the provider.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<?> updateTeacher(@PathVariable("id") Long id, @RequestBody TeacherCreateDTO teacherDto) {
        try {
            teacherService.updateTeacher(id, teacherDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    @Secured("ROLE_TEACHER")
    @Operation(description = "Updates the teacher the current principal is logged in as. If profile image hash is set to null, the image is also deleted from the provider.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<?> updateTeacher(@RequestBody TeacherCreateDTO teacherDto,
            @AuthenticationPrincipal DatabaseUser principal) {
        try {
            teacherService.updateTeacher(principal.getStoredUser().getId(), teacherDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Deletes the teacher with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<?> deleteTeacher(@PathVariable("id") Long id) {
        try {
            teacherService.deleteTeacher(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @Secured("ROLE_TEACHER")
    @RequestMapping(path = "/update/profileImage", method = RequestMethod.POST, consumes = MediaType.IMAGE_JPEG_VALUE)
    @Operation(description = "Expects an 'image/jpeg' file, saves it, assigns a hash and saves it under that hash. The images are statically provided on images/profile/{image-hash}.jpg")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "The filename (hash) of the saved file.", content = @Content(mediaType = "text/plain")),
            @ApiResponse(responseCode = "400", description = "Image is of the incorrect type.", content = @Content(schema = @Schema(implementation = Void.class)))
    })
    public ResponseEntity<?> updateProfileImage(@RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal DatabaseUser principal)
            throws ServletException, NoSuchAlgorithmException, IOException {
        String fileName;
        try {
            fileName = teacherService.uploadProfileImage(file, (Teacher) principal.getStoredUser());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<String>(fileName, HttpStatus.BAD_REQUEST);
    }

}
