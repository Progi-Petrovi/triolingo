package com.triolingo.security;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;
import org.springframework.web.util.UriComponentsBuilder;

import com.triolingo.entity.*;
import com.triolingo.service.DatabaseUserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfiguration {

    private final DatabaseUserService databaseUserService;
    private final Environment env;

    public SecurityConfiguration(DatabaseUserService databaseUserService,
            Environment env) {
        this.databaseUserService = databaseUserService;
        this.env = env;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(this.corsConfiguration()))
                .authorizeHttpRequests((auth) -> auth.anyRequest().permitAll())
                .exceptionHandling((e) -> e.accessDeniedHandler(this::authenticationFailureHandler))
                .formLogin(config -> config
                        .loginProcessingUrl("/login")
                        .usernameParameter("email")
                        .successHandler(this::authenticationSuccessHandler)
                        .failureHandler(this::authenticationFailureHandler)
                        .permitAll())
                .oauth2Login(oauth -> oauth
                        .successHandler(this::authenticationSuccessHandler)
                        .failureHandler(this::authenticationFailureHandler)
                        .userInfoEndpoint(
                                userInfo -> userInfo.userService(databaseUserService)))
                .userDetailsService(databaseUserService);
        return http.build();
    }

    @Bean
    @Primary
    public CorsConfigurationSource corsConfiguration() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOriginPatterns(List.of(env.getProperty("cors.allowedOrigin")));
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        corsConfig.setAllowedHeaders(List.of("Content-Type"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private void authenticationSuccessHandler(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        User user = ((DatabaseUser) authentication.getPrincipal()).getStoredUser();

        // TODO: add other user types
        if (user.getClass().isAssignableFrom(Teacher.class))
            frontendRedirect(response, env.getProperty("path.frontend.teacher.home"));
        else if (user.getClass().isAssignableFrom(Student.class))
            frontendRedirect(response, env.getProperty("path.frontend.student.home"));
        else
            frontendRedirect(response, env.getProperty("path.frontend.home"));

    }

    private void authenticationFailureHandler(HttpServletRequest request, HttpServletResponse response,
            RuntimeException exception) throws IOException, ServletException {
        exception.printStackTrace(System.err);

        if (exception instanceof BadCredentialsException)
            frontendRedirect(response, env.getProperty("path.frontend.login"), Map.of("badCredentials", ""));

        else if (exception instanceof OAuth2PrincipalAuthenticationException
                && exception.getCause() instanceof UsernameNotFoundException)
            frontendRedirect(response, env.getProperty("path.frontend.student.register"), Map.of("oAuth2Failed", "",
                    "email", ((OAuth2PrincipalAuthenticationException) exception).getPrincipalName()));

        else if (exception instanceof OAuth2AuthenticationException)
            frontendRedirect(response, env.getProperty("path.frontend.login"), Map.of("oAuth2Failed", ""));

        else
            frontendRedirect(response, env.getProperty("path.frontend.login"), Map.of("internalError", ""));

    }

    private void encodeUriAndSendRedirect(HttpServletResponse response, String base, String path,
            Map<String, String> params)
            throws IOException {
        String uri = generateURI(base, path, params);
        response.sendRedirect(response.encodeRedirectURL(uri.toString()));
    }

    private void frontendRedirect(HttpServletResponse response, String path, Map<String, String> params)
            throws IOException {
        encodeUriAndSendRedirect(response, env.getProperty("path.frontend.base"), path, params);
    }

    private void frontendRedirect(HttpServletResponse response, String path)
            throws IOException {
        encodeUriAndSendRedirect(response, env.getProperty("path.frontend.base"), path, Map.of());
    }

    private String generateURI(String base, String path,
            Map<String, String> params) {
        UriComponentsBuilder uri = UriComponentsBuilder.fromUriString(base);
        uri = uri.path(path);
        for (Map.Entry<String, String> param : params.entrySet())
            uri = uri.queryParam(param.getKey(), param.getValue());
        return uri.build().encode().toUriString();
    }
}