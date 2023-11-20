package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.heckerForum.heckerForum.models.Notification;
import com.heckerForum.heckerForum.models.NotificationType;
import com.heckerForum.heckerForum.serializer.CommentDtoSerializer;
import com.heckerForum.heckerForum.serializer.PostDtoSerializer;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NotificationDto extends ResponseData implements Serializable {
  private static final long serialVersionUID = 639960835443608529L;
  private Long id;
  private CurrentUserDto user;
  @JsonSerialize(using = PostDtoSerializer.class)
  private PostDto post;
  @JsonSerialize(using = CommentDtoSerializer.class)
  private CommentDto comment;
  private Integer voteCount;
  private LocalDateTime createDateTime;
  private NotificationType type;
  private String title;
  private String message;
  private boolean isRead;

  public NotificationDto(Notification notification) {
    this.id = notification.getId();
    this.user = notification.getUser() != null ? new CurrentUserDto(notification.getUser()) : null;
    this.post = notification.getPost() != null ? new PostDto(notification.getPost()) : null;
    this.comment = notification.getComment() != null ? new CommentDto(notification.getComment()) : null;
    this.voteCount = notification.getVoteCount();
    this.createDateTime = notification.getCreateDateTime();
    this.type = notification.getType();
    this.title = notification.getTitle();
    this.message = notification.getMessage();
    this.isRead = notification.isRead();
  }

}
