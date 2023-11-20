package com.heckerForum.heckerForum.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.heckerForum.heckerForum.models.Notification;
import com.heckerForum.heckerForum.models.User;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
  List<Notification> findByUser(User user);

  Page<Notification> findByUser(User user, Pageable pageable);
}
