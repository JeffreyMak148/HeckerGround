package com.heckerForum.heckerForum.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.heckerForum.heckerForum.models.Notification;
import com.heckerForum.heckerForum.models.User;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
  List<Notification> findByUser(User user);

  Page<Notification> findByUser(User user, Pageable pageable);
  
  void deleteByUser(User user);
  
  @Modifying
  @Query(value = "DELETE FROM notification n WHERE n.user_id = ?1 AND n.id = ?2",
      nativeQuery = true)
  void deleteByUserAndId(Long userId, Long notificationId);
  
  @Modifying
  @Query(value = "UPDATE notification n SET n.is_read = 1 WHERE n.user_id = ?1",
      nativeQuery = true)
  void updateNotificationReadByUserId(Long userId);

}
