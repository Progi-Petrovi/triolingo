package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.teacher.*;
import com.triolingo.entity.lesson.LessonRequest;
import com.triolingo.entity.lesson.Lesson;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/teacher")
public class TeacherController {

    private final TeacherService teacherService;
    private final StudentService studentService;
    private final LessonService lessonService;
    private final DtoMapper dtoMapper;

    public TeacherController(TeacherService teacherService, StudentService studentService, LessonService lessonService,
            DtoMapper dtoMapper) {
        this.teacherService = teacherService;
        this.studentService = studentService;
        this.lessonService = lessonService;
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

    @PutMapping("/{id}")
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

    @PutMapping
    @PreAuthorize("hasRole('TEACHER') and hasRole('VERIFIED')")
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

    @DeleteMapping
    @Secured("ROLE_TEACHER")
    @Operation(description = "Deletes the teacher that is currently logged in.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> deleteTeacher(
            @AuthenticationPrincipal DatabaseUser principal) {
        teacherService.delete((Teacher) principal.getStoredUser());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(path = "/update/profileImage", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('TEACHER') and hasRole('VERIFIED')")
    @Operation(description = "Expects a 'multipart/form-data' with an image file. Assigns a hash to the file and saves it under that hash. The images are statically provided on images/profile/{image-hash}.jpg")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "The filename (hash) of the saved file.", content = @Content(mediaType = "text/plain")),
            @ApiResponse(responseCode = "400", description = "Image is of the incorrect type.", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> updateProfileImage(@RequestParam(value = "file") MultipartFile file,
            @AuthenticationPrincipal DatabaseUser principal)
            throws IOException {
        String fileName;
        try {
            fileName = teacherService.uploadProfileImage(file, (Teacher) principal.getStoredUser());
        } catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(fileName, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/email")
    @PreAuthorize("hasRole('STUDENT') and hasRole('VERIFIED') or hasRole('ADMIN')")
    @Operation(description = "Returns teacher email if the logged in student has an approved lesson request with the teacher")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", content = @Content(schema = @Schema())),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public String getTeacherEmail(@AuthenticationPrincipal DatabaseUser principal,
            @PathVariable("id") Long id) {
        Student student = studentService.fetch(principal.getStoredUser().getId());
        Teacher teacher = teacherService.fetch(id);
        if (!lessonService.requestExistsByTeacherAndStudentAndStatus(teacher, student, LessonRequest.Status.ACCEPTED))
            throw new IllegalArgumentException("You don't have an accepted request with that teacher");
        return teacher.getEmail();
    }

    @GetMapping("/{id}/studentNumber")
    @Operation(description = "Returns number of students the teacher has completed lessons with")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", content = @Content(schema = @Schema())),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public Integer getTeacherStudentNumber(@PathVariable("id") Long id) {
        Teacher teacher = teacherService.fetch(id);
        return studentService.findAllByTeacher(teacher).size();
    }

    @GetMapping("/{id}/lessonNumber")
    @Operation(description = "Returns number of completed lessons the teacher has")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", content = @Content(schema = @Schema())),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public Integer getTeacherLessonNumber(@PathVariable("id") Long id) {
        Teacher teacher = teacherService.fetch(id);
        return lessonService.findAllByTeacherAndStatus(teacher, Lesson.Status.COMPLETE).size();
    }

}
