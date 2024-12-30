package com.triolingo.controller;

import com.triolingo.entity.VerificationToken;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.VerificationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.mail.MessagingException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/verification")
public class VerificationController {
    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @GetMapping("/request")
    @Secured("ROLE_USER")
    @Operation(description = "Requests the verification code to be sent to the users email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "This user is already verified", content = @Content(schema = @Schema()))
    })
    @Transactional
    public ResponseEntity<?> request(@AuthenticationPrincipal DatabaseUser principal) throws MessagingException {
        if (principal.getStoredUser().getVerified())
            return new ResponseEntity<>("This user is already verified", HttpStatus.BAD_REQUEST);

        VerificationToken token = verificationService.createVerification(principal.getStoredUser());

        verificationService.sendVerification(token);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/verify/{token}")
    @Operation(description = "Receives the verification code in the params and verifies the user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "400", description = "Failed to find verification token", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> verify(@PathVariable String token) {
        try {
            verificationService.verify(token);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
