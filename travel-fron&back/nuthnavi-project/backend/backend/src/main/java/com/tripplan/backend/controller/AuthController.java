    package com.tripplan.backend.controller;

    import com.tripplan.backend.dto.LoginRequest;
    import com.tripplan.backend.dto.SignUpRequest;
    import com.tripplan.backend.model.User;
    import com.tripplan.backend.repository.UserRepository;
    import com.tripplan.backend.service.AuthService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.web.bind.annotation.*;

    import java.util.Optional;

    @RestController
    @RequestMapping("/api/auth")
    public class AuthController {

        @Autowired
        private AuthService authService;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @PostMapping("/signup")
        public ResponseEntity<?> signupUser(@RequestBody SignUpRequest signUpRequest) {
            try {
                User savedUser = authService.signup(signUpRequest);
                // Return a simple success message or the user object (without password)
                return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
            } catch (Exception e) {
                // Basic error handling
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Email is already in use!");
            }
        }

        @PostMapping("/login")
        public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
            Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            User user = userOptional.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                // In a real app, you would return a JWT (JSON Web Token) here
                return ResponseEntity.ok("Login successful!");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        }
    }
    
