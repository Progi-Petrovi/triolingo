package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.dto.teacher.TeacherFullDTO;
import com.triolingo.dto.teacher.TeacherViewDTO;
import com.triolingo.entity.user.Teacher;
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
    private final DtoMapper dtoMapper;

    public TeacherController(TeacherService teacherService, DtoMapper dtoMapper) {
        this.teacherService = teacherService;
        this.dtoMapper = dtoMapper;
    }

    @GetMapping("/all")
    @Operation(description = "Returns information regarding all teachers registered within the application.")
    public List<TeacherViewDTO> listTeachers() {
        return teacherService.listAll().stream().map((teacher) -> dtoMapper.createDto(teacher, TeacherViewDTO.class))
                .toList();
    }

    @GetMapping("/{id}")
    @Operation(description = "Returns information regarding teacher with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public TeacherViewDTO getTeacher(@PathVariable("id") Long id) {
        return dtoMapper.createDto(teacherService.fetch(id), TeacherViewDTO.class);
    }

    @GetMapping("/")
    @Secured("ROLE_TEACHER")
    @Operation(description = "Returns information regarding teacher the current principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public TeacherFullDTO getTeacher(@AuthenticationPrincipal DatabaseUser principal) {
        return dtoMapper.createDto(principal.getStoredUser(), TeacherFullDTO.class);
    }

    @PostMapping("/create")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Creates a new teacher.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Teacher with that email already exists.", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> createTeacher(@RequestBody TeacherCreateDTO teacherDto) {
        try {
            teacherService.create(teacherDto);
        } catch (EntityExistsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/register")
    @Operation(description = "Creates a new teacher and logs the current principal in as that student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Teacher with that email already exists.", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> registerTeacher(@RequestBody TeacherCreateDTO teacherDto, HttpServletRequest request)
            throws ServletException {
        try {
            teacherService.create(teacherDto);
        } catch (EntityExistsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        request.login(teacherDto.email(), teacherDto.password());
        // TODO: redirect to verification endpoint on user controller
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Updates the teacher with {id}. If profile image hash is set to null, the image is also deleted from the provider.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> updateTeacher(@PathVariable("id") Long id, @RequestBody TeacherCreateDTO teacherDto) {
        try {
            Teacher teacher = teacherService.fetch(id);
            teacherService.update(teacher, teacherDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    @Secured({ "ROLE_TEACHER", "ROLE_VERIFIED" })
    @Operation(description = "Updates the teacher the current principal is logged in as. If profile image hash is set to null, the image is also deleted from the provider.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> updateTeacher(@RequestBody TeacherCreateDTO teacherDto,
            @AuthenticationPrincipal DatabaseUser principal) {
        try {
            teacherService.update((Teacher) principal.getStoredUser(), teacherDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Deletes the teacher with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> deleteTeacher(@PathVariable("id") Long id) {
        try {
            Teacher teacher = teacherService.fetch(id);
            teacherService.delete(teacher);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @Secured({ "ROLE_TEACHER", "ROLE_VERIFIED" })
    @RequestMapping(path = "/update/profileImage", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(description = "Expects a 'multipart/form-data' with an image file. Assigns a hash to the file and saves it under that hash. The images are statically provided on images/profile/{image-hash}.jpg")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "The filename (hash) of the saved file.", content = @Content(mediaType = "text/plain")),
            @ApiResponse(responseCode = "400", description = "Image is of the incorrect type.", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> updateProfileImage(@RequestParam(value = "file") MultipartFile file,
            @AuthenticationPrincipal DatabaseUser principal)
            throws ServletException, NoSuchAlgorithmException, IOException {
        String fileName;
        try {
            fileName = teacherService.uploadProfileImage(file, (Teacher) principal.getStoredUser());
        } catch (IllegalArgumentException e) {
            System.err.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(fileName, HttpStatus.CREATED);
    }

}
