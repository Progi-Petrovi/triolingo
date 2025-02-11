package com.triolingo.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.core.env.Environment;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.DefaultUriBuilderFactory;

import com.triolingo.entity.VerificationToken;
import com.triolingo.entity.user.User;
import com.triolingo.repository.UserRepository;
import com.triolingo.repository.VerificationRepository;

import jakarta.mail.MessagingException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@Transactional
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final UserRepository userRepository;

    private final EmailService emailService;
    private final Environment env;

    @PersistenceContext
    private EntityManager entityManager;

    public VerificationService(VerificationRepository verificationRepository, UserRepository userRepository,
            EmailService emailService, Environment env) {
        this.verificationRepository = verificationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.env = env;
    }

    public VerificationToken createVerification(User user) {
        VerificationToken verificationToken = verificationRepository.findByUser(user).orElse(null);
        if (verificationToken != null) {
            if (verificationToken.getExpirationDate().isBefore(Instant.now())) {
                verificationRepository.delete(verificationToken);
                entityManager.flush();
            } else
                return verificationToken;
        }

        verificationToken = new VerificationToken(user);
        verificationRepository.save(verificationToken);

        return verificationToken;
    }

    public void verify(String token) {
        VerificationToken verificationToken = verificationRepository.findByToken(token).orElse(null);
        if (verificationToken == null)
            throw new IllegalArgumentException("Failed to find verification token");

        verificationToken.getUser().setVerified(true);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<GrantedAuthority> authorities = Stream.concat(
                auth.getAuthorities().stream(), Stream.of(new SimpleGrantedAuthority("ROLE_VERIFIED"))).toList();

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(auth.getPrincipal(), auth.getCredentials(), authorities));

        userRepository.save(verificationToken.getUser());
        verificationRepository.delete(verificationToken);
    }

    public void sendVerification(VerificationToken verificationToken) throws MessagingException, IOException {
        @SuppressWarnings("null")
        DefaultUriBuilderFactory uriBuilderFactory = new DefaultUriBuilderFactory(env.getProperty("path.backend.base"));
        URI uri = uriBuilderFactory.uriString("/verification/verify/{token}")
                .build(verificationToken.getToken());

        String content = "";

        ClassPathResource resource = new ClassPathResource("templates/email-verification.html");
        try (InputStream inputStream = resource.getInputStream()) {
            content = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        }

        content = content.replace("{{verification_link}}", uri.toString());

        emailService.sendMessage(verificationToken.getUser().getEmail(), "Verify your Triolingo account", content);
    }

    @Scheduled(cron = "0 */5 * ? * *")
    public void clearExpiredVerification() {
        verificationRepository.deleteAllByExpirationDateGreaterThan(Instant.now());
    }
}
