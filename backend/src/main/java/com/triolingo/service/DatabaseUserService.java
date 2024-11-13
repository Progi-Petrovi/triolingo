package com.triolingo.service;

import java.util.Optional;

import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.triolingo.entity.User;
import com.triolingo.repository.UserRepository;
import com.triolingo.security.DatabaseUser;
import com.triolingo.security.OAuth2PrincipalAuthenticationException;

@Service("UserDetailsService")
public class DatabaseUserService implements UserDetailsService, OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    public DatabaseUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
            throw new OAuth2AuthenticationException("Email could not be found in OAuth2User attributes.");
        try {
            return this.loadUserByUsername(email);
        } catch (UsernameNotFoundException e) {
            throw new OAuth2PrincipalAuthenticationException(
                    new OAuth2Error("email_not_found", "Could not find user with that email.", null), email);
        }
    }
}