package com.triolingo.service;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.entity.user.Teacher;
import com.triolingo.repository.TeacherRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.imageio.ImageIO;
import javax.validation.constraints.NotNull;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.NoSuchAlgorithmException;
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

    public TeacherService(TeacherRepository teacherRepository, PasswordEncoder passwordEncoder, DtoMapper dtoMapper,
            Environment env) {
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.dtoMapper = dtoMapper;
        this.env = env;
    }

    public List<Teacher> listAll() {
        return teacherRepository.findAll();
    }

    public Teacher fetch(Long id) {
        try {
            Teacher teacher = teacherRepository.findById(id).get();
            return teacher;
        } catch (NoSuchElementException e) {
            throw new EntityNotFoundException("Teacher with that id does not exist");
        }
    }

    public Teacher create(TeacherCreateDTO teacherDto) {
        if (teacherRepository.existsByEmail(teacherDto.email()))
            throw new EntityExistsException("Teacher with that email already exists");

        Teacher teacher = dtoMapper.createEntity(teacherDto, Teacher.class);
        teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
        return teacherRepository.save(teacher);
    }

    public Teacher update(@NotNull Teacher teacher, @NotNull TeacherCreateDTO teacherDto) {
        dtoMapper.updateEntity(teacher, teacherDto);
        if (teacherDto.password() != null)
            teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));

        return teacherRepository.save(teacher);
    }

    public void delete(Teacher teacher) {
        teacherRepository.delete(teacher);
    }

    public String uploadProfileImage(@NotNull MultipartFile file, Teacher teacher)
            throws NoSuchAlgorithmException, IOException {
        String contentType = file.getContentType();
        if (contentType == null)
            throw new IllegalArgumentException(
                    "You must send a jpeg file.");
        if (!contentType.equals("image/jpeg"))
            throw new IllegalArgumentException(
                    "File must be of type 'image/jpeg', and not '" + file.getContentType() + "'");

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

        String fileName = UUID.randomUUID().toString() + ".jpg";

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
