    package com.tripplan.backend.service;

    import com.tripplan.backend.dto.SignUpRequest;
    import com.tripplan.backend.model.User;
    import com.tripplan.backend.repository.UserRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;

    @Service
    public class AuthService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        public User signup(SignUpRequest signUpRequest) {
            User user = new User();
            user.setFullName(signUpRequest.getFullName());
            user.setEmail(signUpRequest.getEmail());
            // It's crucial to encode the password before saving
            user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

            return userRepository.save(user);
        }
    }
    
