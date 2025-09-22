package com.tripplan.backend.repository;

import com.tripplan.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // We'll need this method to find a user by their email during login
    Optional<User> findByEmail(String email);
}