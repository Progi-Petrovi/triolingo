package com.triolingo.controller;

import com.dtoMapper.DtoMapper;
import com.triolingo.dto.admin.AdminFullDTO;
import com.triolingo.entity.user.Admin;
import com.triolingo.repository.UserRepository;
import com.triolingo.security.DatabaseUser;
import com.triolingo.service.AdminService;
import com.triolingo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    private final DtoMapper dtoMapper;

    public AdminController(AdminService adminService, DtoMapper dtoMapper) {
        this.adminService = adminService;
        this.dtoMapper = dtoMapper;
    }

    @GetMapping
    @Secured("ROLE_ADMIN")
    @Operation(description = "Returns information regarding admin the current principal is logged in as.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", content = @Content(schema = @Schema()))
    })
    public AdminFullDTO getAdmin(@AuthenticationPrincipal DatabaseUser principal) {
        Admin admin = adminService.fetch(principal.getStoredUser().getId());
        return dtoMapper.createDto(admin, AdminFullDTO.class);
    }
}
