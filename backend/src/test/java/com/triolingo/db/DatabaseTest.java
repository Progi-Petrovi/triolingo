package com.triolingo.db;

import com.triolingo.entity.Teacher;
import com.triolingo.repository.TeacherRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class DatabaseTest {

    @Autowired
    private TeacherRepository teacherRepository;

    @Test
    public void ShouldSaveTeacher() {
        Teacher teacher = new Teacher();
        teacher.setName("John Doe");

        Teacher savedTeacher = teacherRepository.save(teacher);

        assertThat(savedTeacher.getId()).isNotNull();
        assertThat(savedTeacher.getName()).isEqualTo("John Doe");
    }
}
