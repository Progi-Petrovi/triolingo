package com.triolingo.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.triolingo.entity.Teacher;
import com.triolingo.entity.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class UserTypeAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        User user = ((DatabaseUser) authentication.getPrincipal()).storedUser;

        // TODO: add other user types
        if (user.getClass().isAssignableFrom(Teacher.class))
            response.encodeRedirectURL(frontendUrl + "/teacher");
        else
            response.encodeRedirectURL(frontendUrl);

    }
}
