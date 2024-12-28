package com.triolingo.service;

import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.dto.teacher.TeacherTranslator;
import com.triolingo.entity.Teacher;
import com.triolingo.repository.TeacherRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.env.Environment;

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
import java.util.Optional;
import java.util.UUID;

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
        String contentType = file.getContentType();
        if (contentType == null)
            throw new IllegalArgumentException(
                    "You must send a jpeg file.");
        if (!contentType.equals("image/jpeg"))
            throw new IllegalArgumentException(
                    "File must be of type 'image/jpeg', and not '" + file.getContentType() + "'");

        // Turn MultipartFile into awt image, so we can resize it into a required
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
