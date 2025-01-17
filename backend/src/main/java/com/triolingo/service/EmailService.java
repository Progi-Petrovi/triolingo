package com.triolingo.service;

import java.io.FileNotFoundException;

import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service("EmailService")
public class EmailService {
    private final JavaMailSender mailSender;
    private final Environment env;

    public EmailService(JavaMailSender mailSender, Environment env) {
        this.mailSender = mailSender;
        this.env = env;
    }

    public void sendMessage(String recepient, String subject, String content)
            throws MessagingException, FileNotFoundException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        helper.setText(content, true);
        helper.setTo(recepient);
        helper.setSubject(subject);

        String user = env.getProperty("email.user");
        if (user != null)
            helper.setFrom(user);

        mailSender.send(mimeMessage);
    }

}
