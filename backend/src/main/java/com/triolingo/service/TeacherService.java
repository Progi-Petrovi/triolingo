package com.triolingo.service;

import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.dto.teacher.TeacherTranslator;
import com.triolingo.entity.Teacher;
import com.triolingo.repository.TeacherRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.env.Environment;

import javax.validation.constraints.NotNull;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final TeacherTranslator teacherTranslator;
    private final Environment env;

    public TeacherService(TeacherRepository teacherRepository, TeacherTranslator teacherTranslator, Environment env) {
        this.teacherRepository = teacherRepository;
        this.teacherTranslator = teacherTranslator;
        this.env = env;
    }

    public List<Teacher> listAll() {
        return teacherRepository.findAll();
    }

    public Teacher fetch(Long id) {
        return teacherRepository.findById(id).orElse(null);
    }

    public Teacher createTeacher(TeacherCreateDTO teacherDto) {
        if (teacherRepository.existsByEmail(teacherDto.email()))
            throw new EntityExistsException("Teacher with that email already exists");
        return teacherRepository.save(teacherTranslator.fromDTO(teacherDto));
    }

    public Teacher updateTeacher(@NotNull Long id, @NotNull TeacherCreateDTO teacherDTO) {
        Optional<Teacher> optionalTeacher = teacherRepository.findById(id);
        if (optionalTeacher.isEmpty())
            throw new EntityNotFoundException("Teacher with that Id does not exist.");

        Teacher teacher = optionalTeacher.get();
        if (teacher.getProfileImageHash() != null && teacherDTO.profileImageHash() == null) {

            try {
                Files.deleteIfExists(
                        Path.of(env.getProperty("fileSystem.publicPath"),
                                env.getProperty("fileSystem.profileImagePath"),
                                teacher.getProfileImageHash()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        teacherTranslator.updateTeacher(teacher, teacherDTO);
        return teacherRepository.save(teacher);
    }

    public void deleteTeacher(Long id) {
        Teacher teacher = fetch(id);
        if (teacher == null)
            throw new EntityNotFoundException("Teacher with that Id does not exist.");
        teacherRepository.deleteById(id);
    }

    public String uploadProfileImage(@NotNull MultipartFile file, Teacher teacher)
            throws NoSuchAlgorithmException, IOException {
        if (file.getContentType() != "image/jpeg")
            throw new IllegalArgumentException("File must be of type 'image/jpeg'");

        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(file.getBytes());
        String fileName = new String(hash, StandardCharsets.ISO_8859_1);

        Files.copy(file.getInputStream(), Path.of(
                env.getProperty("fileSystem.publicPath"),
                env.getProperty("fileSystem.profileImagePath"),
                fileName));
        if (teacher.getProfileImageHash() != null)
            Files.deleteIfExists(
                    Path.of(env.getProperty("fileSystem.publicPath"),
                            env.getProperty("fileSystem.profileImagePath"),
                            teacher.getProfileImageHash()));

        teacher.setProfileImageHash(fileName);
        teacherRepository.save(teacher);
        return fileName;
    }

}
