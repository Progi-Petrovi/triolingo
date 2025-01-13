package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.teacher.*;
import com.triolingo.entity.user.Teacher;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.TeacherService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpHeaders;
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
        return teacherService.listAll().stream()
                .map((teacher) -> dtoMapper.createDto(teacher, TeacherViewDTO.class))
                .toList();
    }

    @GetMapping("/filter")
    @Operation(description = "Returns information regarding all teachers registered within the application which meet the provided criteria.")
    public List<TeacherViewDTO> filterTeachers(TeacherFilterDTO teacherDto) {
        return teacherService.listAll(teacherDto).stream()
                .map((teacher) -> dtoMapper.createDto(teacher, TeacherViewDTO.class))
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

    @GetMapping
    @Secured("ROLE_TEACHER")
    @Operation(description = "Returns information regarding teacher the current principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public TeacherFullDTO getTeacher(@AuthenticationPrincipal DatabaseUser principal) {
        Teacher teacher = teacherService.fetch(principal.getStoredUser().getId());
        return dtoMapper.createDto(teacher, TeacherFullDTO.class);
    }

    @PostMapping("/create")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Creates a new teacher.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Teacher with that email already exists.", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> createTeacher(@RequestBody TeacherCreateDTO teacherDto) {
        teacherService.create(teacherDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/register")
    @Operation(description = "Creates a new teacher and logs the current principal in as that student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201"),
            @ApiResponse(responseCode = "400", description = "Teacher with that email already exists.", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> registerTeacher(@RequestBody TeacherCreateDTO teacherDto, HttpServletRequest request)
            throws ServletException {
        teacherService.create(teacherDto);
        request.login(teacherDto.email(), teacherDto.password());
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Updates the teacher with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> updateTeacher(@PathVariable("id") Long id, @RequestBody TeacherUpdateDTO teacherDto) {
        Teacher teacher = teacherService.fetch(id);
        teacherService.update(teacher, teacherDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/update")
    @Secured({ "ROLE_TEACHER", "ROLE_VERIFIED" })
    @Operation(description = "Updates the teacher the current principal is logged in as. If profile image hash is set to null, the image is also deleted from the provider.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> updateTeacher(@RequestBody TeacherUpdateDTO teacherDto,
            @AuthenticationPrincipal DatabaseUser principal) {
        teacherService.update((Teacher) principal.getStoredUser(), teacherDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(description = "Deletes the teacher with {id}.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> deleteTeacher(@PathVariable("id") Long id) {
        Teacher teacher = teacherService.fetch(id);
        teacherService.delete(teacher);
        return new ResponseEntity<>(HttpStatus.OK);
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
            throws NoSuchAlgorithmException, IOException {
        String fileName;
        try {
            fileName = teacherService.uploadProfileImage(file, (Teacher) principal.getStoredUser());
        } catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(fileName, HttpStatus.CREATED);
    }

}
