package com.heckerForum.heckerForum.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.heckerForum.heckerForum.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String email);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);
  
  @Modifying
  @Query(value = "UPDATE users u SET u.unread_notification = 0 WHERE u.id = ?1",
      nativeQuery = true)
  void resetUnreadNotificationByUserId(Long userId);
}