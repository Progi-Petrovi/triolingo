package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.user.UserChangePasswordDTO;
import com.triolingo.entity.user.User;
import com.triolingo.repository.UserRepository;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.TeacherService;
import com.triolingo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
        User user = principal.getStoredUser();
        userService.changePassword(user, userChangePasswordDTO);
        return ResponseEntity.ok("Password changed successfully");
    }

    @GetMapping("/role")
    @Secured("ROLE_USER")
    @Operation(description = "Gets current user the principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public ResponseEntity<?> getUserRoles(
            @AuthenticationPrincipal DatabaseUser principal) {
        User user = principal.getStoredUser();
        return ResponseEntity.ok(user.getAuthorities());
    }

}
