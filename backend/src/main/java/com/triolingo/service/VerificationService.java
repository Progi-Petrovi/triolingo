package com.triolingo.service;

import java.net.URI;
import java.time.Instant;

import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.DefaultUriBuilderFactory;

import com.triolingo.entity.VerificationToken;
import com.triolingo.entity.user.User;
import com.triolingo.repository.UserRepository;
import com.triolingo.repository.VerificationRepository;

import jakarta.mail.MessagingException;

@Service
@Transactional
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final UserRepository userRepository;

    private final EmailService emailService;
    private final Environment env;

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
            if (verificationToken.getExpirationDate().isBefore(Instant.now()))
                verificationRepository.delete(verificationToken);
            else
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
        userRepository.save(verificationToken.getUser());
        verificationRepository.delete(verificationToken);
    }

    public void sendVerification(VerificationToken verificationToken) throws MessagingException {
        @SuppressWarnings("null")
        DefaultUriBuilderFactory uriBuilderFactory = new DefaultUriBuilderFactory(env.getProperty("path.backend.base"));
        URI uri = uriBuilderFactory.uriString("/verification/verify/{token}")
                .build(verificationToken.getToken());
        emailService.sendMessage(verificationToken.getUser().getEmail(), "Verify your Triolingo account",
                uri.toString());
    }

    @Scheduled(cron = "0 */5 * ? * *")
    public void clearExpiredVerification() {
        verificationRepository.deleteAllByExpirationDateGreaterThan(Instant.now());
    }
}
