package com.triolingo.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.triolingo.entity.User;
import com.triolingo.repository.UserRepository;
import com.triolingo.security.DatabaseUser;

@Service("userDetailsService")
public class DatabaseUserService implements UserDetailsService {

    private final UserRepository userRepository;

    public DatabaseUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty())
            throw new UsernameNotFoundException("No user with that email address was found.");

        User user = optionalUser.get();
        return new DatabaseUser(user.getEmail(), user.getPassword(), user.getAuthorities(), user);
    }
}