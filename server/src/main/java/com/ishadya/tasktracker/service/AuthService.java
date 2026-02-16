package com.ishadya.tasktracker.service;

import com.ishadya.tasktracker.dto.AuthRequestDTO;
import com.ishadya.tasktracker.dto.AuthResponseDTO;
import com.ishadya.tasktracker.dto.RegisterRequestDTO;
import com.ishadya.tasktracker.model.User;
import com.ishadya.tasktracker.repository.UserRepository;
import com.ishadya.tasktracker.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user);

        return new AuthResponseDTO(token, user.getUsername(), user.getFullName());
    }

    public AuthResponseDTO login(AuthRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtUtil.generateToken(user);

        return new AuthResponseDTO(token, user.getUsername(), user.getFullName());
    }
}
