package com.triolingo.service;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.oauth2.client.http.OAuth2ErrorResponseErrorHandler;
import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.triolingo.entity.User;
import com.triolingo.repository.UserRepository;
import com.triolingo.security.DatabaseUser;
import com.triolingo.security.OAuth2PrincipalAuthenticationException;

@Service("UserDetailsService")
public class DatabaseUserService implements UserDetailsService, OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final Environment env;
    private final RestTemplate restTemplate = new RestTemplate();

    public DatabaseUserService(UserRepository userRepository, Environment env) {
        this.userRepository = userRepository;
        this.env = env;
        this.restTemplate.setErrorHandler(new OAuth2ErrorResponseErrorHandler());
    }

    @Override
    public DatabaseUser loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty())
            throw new UsernameNotFoundException("No user with that email address was found.");

        User user = optionalUser.get();
        return new DatabaseUser(user.getEmail(), user.getPassword(), user.getAuthorities(), user);
    }

    @Override
    public DatabaseUser loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        DefaultOAuth2UserService defaultOAuth2UserService = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = defaultOAuth2UserService.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        if (email == null)
            email = requestEmail(userRequest);

        if (email == null)
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("user_not_found", "Email property missing from OAuth2User.", null),
                    "Email property missing from OAuth2User.");
        try {
            return this.loadUserByUsername(email);
        } catch (UsernameNotFoundException e) {
            throw new OAuth2PrincipalAuthenticationException(
                    new OAuth2Error("user_not_found", "Could not find user with that email.", null), email,
                    "\"Could not find user with that email.\"", e);
        }
    }

    private String requestEmail(OAuth2UserRequest userRequest) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(userRequest.getAccessToken().getTokenValue());

        URI uri = URI.create(env.getProperty("spring.security.oauth2.client.provider."
                + userRequest.getClientRegistration().getRegistrationId() + ".emailEndpoint"));
        RequestEntity<MultiValueMap<String, String>> request = new RequestEntity<>(headers, HttpMethod.GET, uri);

        ResponseEntity<List<Map<String, Object>>> response;
        try {
            response = this.restTemplate.exchange(request,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {
                    });
        } catch (RestClientException ex) {
            OAuth2Error oauth2Error = new OAuth2Error("invalid_user_type",
                    "An error occurred while attempting to retrieve the UserInfo Resource: " + ex.getMessage(), null);
            throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString(), ex);
        }

        List<Map<String, Object>> emailsInfo = response.getBody();
        if (emailsInfo == null) {
            OAuth2Error oauth2Error = new OAuth2Error("response_empty",
                    "Response at the email endpoint is empty.", null);
            throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
        }

        for (Map<String, Object> emailInfo : emailsInfo) {
            if ((Boolean) emailInfo.get("primary"))
                return (String) emailInfo.get("email");
        }
        return (String) emailsInfo.get(0).get("email");
    }
}