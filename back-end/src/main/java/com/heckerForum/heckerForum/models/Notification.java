package com.heckerForum.heckerForum.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Notification {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false)
  private User user;
  @ManyToOne(optional = true)
  private Post post;
  @ManyToOne(optional = true)
  private Comment comment;
  private Integer voteCount;
  private LocalDateTime createDateTime;
  @Enumerated(EnumType.STRING)
  private NotificationType type;
  private String title;
  @Column(columnDefinition = "TEXT")
  private String message;
  private boolean isRead = false;
}
