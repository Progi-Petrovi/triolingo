package com.triolingo.db;

import com.triolingo.entity.Student;
import com.triolingo.entity.Teacher;
import com.triolingo.repository.StudentRepository;
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

    @Autowired
    private StudentRepository studentRepository;

    @Test
    public void ShouldSaveTeacher() {
        Teacher teacher = new Teacher();
        teacher.setFullName("John Doe");

        Teacher savedTeacher = teacherRepository.save(teacher);

        assertThat(savedTeacher.getId()).isNotNull();
        assertThat(savedTeacher.getFullName()).isEqualTo("John Doe");
    }

    @Test
    public void ShouldSaveStudent() {
        Student student = new Student();
        student.setFullName("Igor");

        Student savedStudent = studentRepository.save(student);

        assertThat(savedStudent.getId()).isNotNull();
        assertThat(savedStudent.getFullName()).isEqualTo("Igor");
    }
}
