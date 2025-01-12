package com.triolingo.security;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.web.cors.*;
import org.springframework.web.util.UriComponentsBuilder;

import com.triolingo.entity.user.*;
import com.triolingo.service.DatabaseUserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true)
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
                .exceptionHandling((e) -> e.accessDeniedHandler(this::authenticationFailureHandler)
                        .authenticationEntryPoint(new Http403ForbiddenEntryPoint()))
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
        corsConfig.setAllowedOrigins(List.of(env.getProperty("cors.allowedOrigin")));
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
                                              Authentication authentication) throws IOException {
        User user = ((DatabaseUser) authentication.getPrincipal()).getStoredUser();
        String redirectUrl;

        if (!user.getVerified())
            redirectUrl = env.getProperty("path.frontend.verify");
        else if (user.getClass().isAssignableFrom(Teacher.class))
            redirectUrl = env.getProperty("path.frontend.teacher.home");
        else if (user.getClass().isAssignableFrom(Student.class))
            redirectUrl = env.getProperty("path.frontend.student.home");
        else if (user.getClass().isAssignableFrom(Admin.class))
            redirectUrl = env.getProperty("path.frontend.admin.home");
        else
            redirectUrl = env.getProperty("path.frontend.home");

        response.setContentType("application/json");
        response.getWriter().write("{\"redirectUrl\": \"" + redirectUrl + "\"}");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void authenticationFailureHandler(HttpServletRequest request, HttpServletResponse response,
                                              RuntimeException exception) throws IOException {
        exception.printStackTrace(System.err);
        String redirectUrl;

        if (exception instanceof BadCredentialsException)
            redirectUrl = env.getProperty("path.frontend.login") + "?badCredentials=";
        else if (exception instanceof OAuth2PrincipalAuthenticationException
                && exception.getCause() instanceof UsernameNotFoundException) {
            OAuth2PrincipalAuthenticationException ex = (OAuth2PrincipalAuthenticationException) exception;
            redirectUrl = env.getProperty("path.frontend.student.register") + "?oAuth2Failed=&email=" + ex.getPrincipalName();
        } else if (exception instanceof OAuth2AuthenticationException)
            redirectUrl = env.getProperty("path.frontend.login") + "?oAuth2Failed=";
        else
            redirectUrl = env.getProperty("path.frontend.login") + "?internalError=";

        response.setContentType("application/json");
        response.getWriter().write("{\"redirectUrl\": \"" + redirectUrl + "\"}");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
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