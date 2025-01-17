package com.triolingo.registration;

import com.triolingo.dto.student.StudentCreateDTO;
import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.KnowledgeLevel;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@ActiveProfiles("test")
public class StudentRegistrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void ShouldRegisterNewStudent() {
        StudentCreateDTO studentCreateDTO = new StudentCreateDTO(
                "john.doe@gmail.com",
                "12345678",
                "John Doe",
                Map.of("Spanish", KnowledgeLevel.BEGINNER),
                TeachingStyle.FLEXIBLE,
                "Learn Espanol");

        ResponseEntity<String> response = restTemplate.postForEntity("/student/register", studentCreateDTO,
                String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void ShouldNotRegisterWithExistingEmail() {
        StudentCreateDTO studentCreateDTO = new StudentCreateDTO(
                "john.doe@gmail.com",
                "12345678",
                "John Doe",
                Map.of("Spanish", KnowledgeLevel.BEGINNER),
                TeachingStyle.FLEXIBLE,
                "Learn Espanol");

        ResponseEntity<String> response1 = restTemplate.postForEntity("/student/register", studentCreateDTO,
                String.class);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        ResponseEntity<String> response2 = restTemplate.postForEntity("/student/register", studentCreateDTO,
                String.class);
        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void ShouldNotRegisterWithShortPassword() {
        StudentCreateDTO studentCreateDTO = new StudentCreateDTO(
                "john.doe@gmail.com",
                "1234",
                "John Doe",
                Map.of("Spanish", KnowledgeLevel.BEGINNER),
                TeachingStyle.FLEXIBLE,
                "Learn Espanol");

        ResponseEntity<String> response = restTemplate.postForEntity("/student/register", studentCreateDTO,
                String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
