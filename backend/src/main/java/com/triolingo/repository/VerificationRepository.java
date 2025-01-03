package com.triolingo.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.triolingo.entity.VerificationToken;
import com.triolingo.entity.user.User;

@Repository
public interface VerificationRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByUser(User user);

    Optional<VerificationToken> findByToken(String token);

    void deleteAllByExpirationDateGreaterThan(Instant expirationDate);
}
