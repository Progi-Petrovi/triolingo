package com.triolingo;

import com.triolingo.dto.student.StudentCreateDTO;
import com.triolingo.dto.teacher.TeacherCreateDTO;
import com.triolingo.entity.TeachingStyle;
import com.triolingo.entity.language.KnowledgeLevel;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@ActiveProfiles("test")
public class LoginRegistrationIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void ShouldRegisterAndLoginAsStudent() {
        // Registration part
        StudentCreateDTO studentCreateDTO = new StudentCreateDTO(
                "john.doe@gmail.com",
                "12345678",
                "John Doe",
                Map.of("Spanish", KnowledgeLevel.BEGINNER),
                TeachingStyle.FLEXIBLE,
                "Learn Espanol"
        );

        ResponseEntity<String> registerResponse = restTemplate.postForEntity("/student/register", studentCreateDTO, String.class);
        assertThat(registerResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // Login part
        MultiValueMap<String, String> userCredentials = new LinkedMultiValueMap<>();
        userCredentials.add("email", "john.doe@gmail.com");
        userCredentials.add("password", "12345678");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(userCredentials, headers);

        ResponseEntity<String> loginResponse = restTemplate.postForEntity("/login", request, String.class);
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void ShouldRegisterAndLoginAsTeacher() {
        // Registration part
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

        ResponseEntity<String> registerResponse = restTemplate.postForEntity("/teacher/register", teacherCreateDTO, String.class);
        assertThat(registerResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // Login part
        MultiValueMap<String, String> userCredentials = new LinkedMultiValueMap<>();
        userCredentials.add("email", "john.doe@gmail.com");
        userCredentials.add("password", "12345678");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(userCredentials, headers);

        ResponseEntity<String> loginResponse = restTemplate.postForEntity("/login", request, String.class);
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
