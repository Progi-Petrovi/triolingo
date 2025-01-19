package com.triolingo.registration;

import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.entity.TeachingStyle;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@ActiveProfiles("test")
public class TeacherRegistrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void ShouldRegisterNewTeacher() {
        TeacherCreateDTO teacherCreateDTO  = new TeacherCreateDTO(
                "john.doe@gmail.com",
                "12345678",
                "John Doe",
                List.of("English", "Spanish"),
                5,
                "PhD English",
                TeachingStyle.FLEXIBLE,
                null,
                15.5,
                "0911111111"
        );

        ResponseEntity<String> response = restTemplate.postForEntity("/teacher/register", teacherCreateDTO, String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void ShouldNotRegisterWithExistingEmail() {
        TeacherCreateDTO teacherCreateDTO  = new TeacherCreateDTO(
                "john.doe@gmail.com",
                "12345678",
                "John Doe",
                List.of("English", "Spanish"),
                5,
                "PhD English",
                TeachingStyle.FLEXIBLE,
                null,
                15.5,
                "0911111111"
        );

        ResponseEntity<String> response1 = restTemplate.postForEntity("/teacher/register", teacherCreateDTO, String.class);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        ResponseEntity<String> response2 = restTemplate.postForEntity("/teacher/register", teacherCreateDTO, String.class);
        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void ShouldNotRegisterWithShortPassword() {
        TeacherCreateDTO teacherCreateDTO  = new TeacherCreateDTO(
                "john.doe@gmail.com",
                "1234",
                "John Doe",
                List.of("English", "Spanish"),
                5,
                "PhD English",
                TeachingStyle.FLEXIBLE,
                null,
                15.5,
                "0911111111"
        );

        ResponseEntity<String> response = restTemplate.postForEntity("/teacher/register", teacherCreateDTO, String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void ShouldNotRegisterWithNegativeValues() {
        // Negative years of experience
        TeacherCreateDTO teacherCreateDTO1  = new TeacherCreateDTO(
                "john.doe@gmail.com",
                "12345678",
                "John Doe",
                List.of("English", "Spanish"),
                -5,
                "PhD English",
                TeachingStyle.FLEXIBLE,
                null,
                15.5,
                "0911111111"
        );

        ResponseEntity<String> response1 = restTemplate.postForEntity("/teacher/register", teacherCreateDTO1, String.class);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);

        // Negative hourly rate
        TeacherCreateDTO teacherCreateDTO2  = new TeacherCreateDTO(
                "john.doe@gmail.com",
                "12345678",
                "John Doe",
                List.of("English", "Spanish"),
                5,
                "PhD English",
                TeachingStyle.FLEXIBLE,
                null,
                -15.5,
                "0911111111"
        );

        ResponseEntity<String> response2 = restTemplate.postForEntity("/teacher/register", teacherCreateDTO2, String.class);
        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

}
