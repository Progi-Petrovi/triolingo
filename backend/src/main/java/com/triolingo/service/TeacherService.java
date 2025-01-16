package com.triolingo.service;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.teacher.*;
import com.triolingo.entity.user.Teacher;
import com.triolingo.repository.TeacherRepository;

import com.triolingo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.imageio.ImageIO;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper dtoMapper;
    private final Environment env;
    private final UserRepository userRepository;

    public TeacherService(TeacherRepository teacherRepository, PasswordEncoder passwordEncoder, DtoMapper dtoMapper,
                          Environment env, UserRepository userRepository) {
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.dtoMapper = dtoMapper;
        this.env = env;
        this.userRepository = userRepository;
    }

    public List<Teacher> listAll() {
        return teacherRepository.findAll();
    }

    public List<Teacher> listAll(@NotNull TeacherFilterDTO filterDTO) {
        return teacherRepository.listAll(filterDTO.languages(), filterDTO.minYearsOfExperience(),
                filterDTO.maxYearsOfExperience(), filterDTO.teachingStyles(), filterDTO.minHourlyRate(),
                filterDTO.maxHourlyRate(), filterDTO.order());
    }

    public Teacher fetch(Long id) {
        try {
            return teacherRepository.findById(id).get();
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Teacher with that id does not exist");
        }
    }

    public Teacher create(TeacherCreateDTO teacherDto) {
        if (userRepository.existsByEmail(teacherDto.email()))
            throw new EntityExistsException("User with that email already exists");
        if (teacherDto.hourlyRate() < 0){
            throw new IllegalArgumentException("Hourly Rate cannot be negative");
        }
        if (teacherDto.yearsOfExperience() < 0){
            throw new IllegalArgumentException("Years of Experience cannot be negative");
        }

        Teacher teacher = dtoMapper.createEntity(teacherDto, Teacher.class);
        teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
        return teacherRepository.save(teacher);
    }

    public void update(@NotNull @Valid Teacher teacher, @NotNull TeacherUpdateDTO teacherDto) {
        if (teacherDto.hourlyRate() < 0){
            throw new IllegalArgumentException("Hourly Rate cannot be negative");
        }
        if (teacherDto.yearsOfExperience() < 0){
            throw new IllegalArgumentException("Years of Experience cannot be negative");
        }
        dtoMapper.updateEntity(teacher, teacherDto);
        teacherRepository.save(teacher);
    }

    public void delete(Teacher teacher) {
        teacherRepository.delete(teacher);
    }

    public String uploadProfileImage(@NotNull MultipartFile file, Teacher teacher)
            throws IOException {
        String contentType = file.getContentType();
        if (contentType == null)
            throw new IllegalArgumentException(
                    "Unrecognized content type.");

        // Turn MultipartFile into awt image, so we can resize it into the required
        // resolution and save it.
        @SuppressWarnings("null")
        int imageSize = env.getProperty("profileImage.saveSize", Integer.class);
        Image image = ImageIO.read(file.getInputStream()).getScaledInstance(imageSize, imageSize, Image.SCALE_SMOOTH);
        if (image == null)
            throw new IllegalArgumentException(
                    "Unable to process image, it may be of the incorrect media type or corrupted.");
        BufferedImage resizedImage = new BufferedImage(imageSize, imageSize, BufferedImage.TYPE_INT_RGB);

        Graphics2D graphics = resizedImage.createGraphics();
        graphics.drawImage(image, 0, 0, null);
        graphics.dispose();

        String fileName = UUID.randomUUID() + ".jpg";

        File imageSaveFile = Path.of(env.getProperty("fileSystem.publicPath"),
                env.getProperty("fileSystem.profileImagePath"),
                fileName).toFile();
        if (!ImageIO.write(resizedImage, "jpg", imageSaveFile))
            throw new RuntimeException("Failed to save new profile image.");

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
