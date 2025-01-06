package com.triolingo.controller;

import com.triolingo.dto.user.UserChangePasswordDTO;
import com.triolingo.entity.user.User;
import com.triolingo.exception.ChangePasswordException;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/change-password")
    @Secured({"ROLE_USER", "ROLE_VERIFIED"})
    @Operation(description = "Changes password of the user the current principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> changePassword(@RequestBody UserChangePasswordDTO userChangePasswordDTO,
                                            @AuthenticationPrincipal DatabaseUser principal) {
        try {
            User user = principal.getStoredUser();
            userService.changePassword(user, userChangePasswordDTO);
            return ResponseEntity.ok("Password changed successfully");
        } catch(ChangePasswordException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
