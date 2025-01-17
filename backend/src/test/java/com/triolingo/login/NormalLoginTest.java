package com.triolingo.login;

import com.triolingo.service.EmailService;
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
public class NormalLoginTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void ShouldLogin() {

        Map<String, Object> registerPayload = Map.of(
                "email", "jane.doe@gmail.com",
                "password", "12345678",
                "fullName", "Jane Doe",
                "learningLanguages", Map.of("Spanish", "BEGINNER"),
                "preferredTeachingStyle", "FLEXIBLE",
                "learningGoals", "Learn Espanol"
        );

        ResponseEntity<String> response = restTemplate.postForEntity("/student/register", registerPayload, String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        Map<String, Object> loginPayload = Map.of(
                "email", "jane.doe@gmail.com",
                "password", "12345678"
        );

        ResponseEntity<String> loginResponse = restTemplate.postForEntity("/login", loginPayload, String.class);
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
