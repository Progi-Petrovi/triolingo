package com.triolingo.service;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.teacher.*;
import com.triolingo.entity.language.Language;
import com.triolingo.entity.user.Teacher;
import com.triolingo.entity.user.User;
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
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper dtoMapper;
    private final EntityManager entityManager;
    private final Environment env;

    public TeacherService(TeacherRepository teacherRepository, PasswordEncoder passwordEncoder, DtoMapper dtoMapper,
            EntityManager entityManager,
            Environment env) {
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.dtoMapper = dtoMapper;
        this.entityManager = entityManager;
        this.env = env;
    }

    public List<Teacher> listAll() {
        return teacherRepository.findAll();
    }

    public List<Teacher> listAll(@NotNull TeacherFilterDTO filterDTO) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Teacher> query = builder.createQuery(Teacher.class);

        Root<Teacher> teacherRoot = query.from(Teacher.class);
        Join<Teacher, Language> languageJoin = teacherRoot.join(Teacher.Fields.languages);

        Predicate predicate = builder.and();
        if (filterDTO.minHourlyRate() != null)
            predicate = builder.and(predicate,
                    builder.greaterThanOrEqualTo(
                            teacherRoot.get(Teacher.Fields.hourlyRate),
                            filterDTO.minHourlyRate()));
        if (filterDTO.maxHourlyRate() != null)
            predicate = builder.and(predicate,
                    builder.lessThanOrEqualTo(
                            teacherRoot.get(Teacher.Fields.hourlyRate),
                            filterDTO.maxHourlyRate()));

        if (filterDTO.minYearsOfExperience() != null)
            predicate = builder.and(predicate,
                    builder.greaterThanOrEqualTo(
                            teacherRoot.get(Teacher.Fields.yearsOfExperience),
                            filterDTO.minYearsOfExperience()));
        if (filterDTO.maxYearsOfExperience() != null)
            predicate = builder.and(predicate,
                    builder.lessThanOrEqualTo(
                            teacherRoot.get(Teacher.Fields.yearsOfExperience),
                            filterDTO.maxYearsOfExperience()));

        if (filterDTO.teachingStyles() != null)
            predicate = builder.and(predicate,
                    teacherRoot.get(Teacher.Fields.teachingStyle)
                            .in(filterDTO.teachingStyles()));

        if (filterDTO.languages() != null)
            predicate = builder.and(predicate,
                    languageJoin.get(Language.Fields.name)
                            .in(filterDTO.languages()));

        query = query.where(predicate).groupBy(teacherRoot.get(User.Fields.id));

        if (filterDTO.languages() != null)
            query = query.having(builder.equal(builder.count(teacherRoot), filterDTO.languages().size()));

        Order order = builder.desc(teacherRoot.get(User.Fields.fullName));
        if (filterDTO.order() != null)
            switch (filterDTO.order()) {
                case TeacherFilterDTO.Order.ALPHABETICAL_DESC:
                    order = builder.desc(teacherRoot.get(User.Fields.fullName));
                    break;
                case TeacherFilterDTO.Order.ALPHABETICAL_ASC:
                    order = builder.asc(teacherRoot.get(User.Fields.fullName));
                    break;
                case TeacherFilterDTO.Order.YEARS_OF_EXPERIANCE_DESC:
                    order = builder.desc(teacherRoot.get(Teacher.Fields.yearsOfExperience));
                    break;
                case TeacherFilterDTO.Order.YEARS_OF_EXPERIANCE_ASC:
                    order = builder.asc(teacherRoot.get(Teacher.Fields.yearsOfExperience));
                    break;
                case TeacherFilterDTO.Order.HOURLY_RATE_DESC:
                    order = builder.desc(teacherRoot.get(Teacher.Fields.hourlyRate));
                    break;
                case TeacherFilterDTO.Order.HOURLY_RATE_ASC:
                    order = builder.asc(teacherRoot.get(Teacher.Fields.hourlyRate));
                    break;
                default:
                    break;
            }

        return entityManager.createQuery(query.orderBy(order)).getResultList();
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

    public Teacher update(@NotNull Teacher teacher, @NotNull TeacherUpdateDTO teacherDto) {
        dtoMapper.updateEntity(teacher, teacherDto);
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
