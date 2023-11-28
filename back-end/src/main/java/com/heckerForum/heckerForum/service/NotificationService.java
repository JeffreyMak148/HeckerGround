package com.heckerForum.heckerForum.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.dto.NotificationDto;
import com.heckerForum.heckerForum.exception.NotificationNotFoundException;
import com.heckerForum.heckerForum.exception.UserNotFoundException;
import com.heckerForum.heckerForum.models.Comment;
import com.heckerForum.heckerForum.models.Notification;
import com.heckerForum.heckerForum.models.NotificationType;
import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.repository.NotificationRepository;
import com.heckerForum.heckerForum.repository.UserRepository;

import jakarta.transaction.Transactional;

/* 
 * Notify when
 * 1. Users received comments on their post
 * 2. Users received reply on their comment
 * 3. Users received votes on their post
 * 4. Users received votes on their comment
 * 
 */
@Service
public class NotificationService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NotificationRepository notificationRepository;

  public NotificationDto save(Notification notification) throws Exception {
    return new NotificationDto(notificationRepository.save(notification));
  }

  public NotificationDto saveRead(Long notificationId) throws Exception {
    Notification notification = notificationRepository.findById(notificationId)
        .orElseThrow(() -> new NotificationNotFoundException());
    notification.setRead(true);
    notification = notificationRepository.save(notification);
    notification.getUser().setUnreadNotification(notification.getUser().getUnreadNotification() - 1);
    userRepository.save(notification.getUser());
    return new NotificationDto(notification);
  }
  
  @Transactional
  public void deleteByUser(User user) throws Exception {
    notificationRepository.deleteByUser(user);
    user.setUnreadNotification(user.getUnreadNotification()-1);
    userRepository.save(user);
  }
  
  @Transactional
  public void delete(Long notificationId, User user) throws Exception {
    notificationRepository.deleteByUserAndId(user.getId(), notificationId);
    user.setUnreadNotification(Long.valueOf(0));
    userRepository.save(user);
  }

  public List<NotificationDto> findByUserId(Long userId) throws Exception {
    User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException());
    List<Notification> notifications = notificationRepository.findByUser(user);
    return notifications.stream().map(notification -> new NotificationDto(notification)).toList();
  }

  public List<NotificationDto> findByUser(User user) throws Exception {
    List<Notification> notifications = notificationRepository.findByUser(user);
    return notifications.stream().map(notification -> new NotificationDto(notification)).toList();
  }

  public List<NotificationDto> findByUserIdAndPagination(Long userId, Integer pageNo, Integer pageSize, String sortBy)
      throws Exception {
    User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException());
    Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Order.desc(sortBy)));
    Page<Notification> result = notificationRepository.findByUser(user, paging);
    return result.hasContent()
        ? result.getContent().stream().map(notification -> new NotificationDto(notification)).toList()
        : new ArrayList<NotificationDto>();
  }

  public List<NotificationDto> findByUserAndPagination(User user, Integer pageNo, Integer pageSize, String sortBy)
      throws Exception {
    Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Order.desc(sortBy)));
    Page<Notification> result = notificationRepository.findByUser(user, paging);
    return result.hasContent()
        ? result.getContent().stream().map(notification -> new NotificationDto(notification)).toList()
        : new ArrayList<NotificationDto>();
  }

  public void deleteNotification(Long notificationId) {
    notificationRepository.deleteById(notificationId);
  }

  public NotificationDto createAndSaveReplyPostNotification(User user, Post post, Comment comment) {
    String title = "Post received reply";
    String message = post.getTitle();
    Notification notification = new Notification();
    user.setUnreadNotification(user.getUnreadNotification() + 1);
    user = userRepository.save(user);
    notification.setUser(user);
    notification.setPost(post);
    notification.setComment(comment);
    notification.setCreateDateTime(LocalDateTime.now());
    notification.setType(NotificationType.REPLY_POST);
    notification.setTitle(title);
    notification.setMessage(message);
    return new NotificationDto(notificationRepository.save(notification));
  }

  public NotificationDto createAndSaveReplyCommentNotification(User user, Post post, Comment comment) {
    String title = "Comment received reply";
    String message = comment.getPlainText();
    Notification notification = new Notification();
    user.setUnreadNotification(user.getUnreadNotification() + 1);
    user = userRepository.save(user);
    notification.setUser(user);
    notification.setPost(post);
    notification.setComment(comment);
    notification.setCreateDateTime(LocalDateTime.now());
    notification.setType(NotificationType.REPLY_COMMENT);
    notification.setTitle(title);
    notification.setMessage(message);
    return new NotificationDto(notificationRepository.save(notification));
  }

  public NotificationDto createAndSaveUpvotePostNotification(User user, Post post) {
    String title = "Post received upvote";
    String message = post.getTitle();
    Notification notification = new Notification();
    user.setUnreadNotification(user.getUnreadNotification() + 1);
    user = userRepository.save(user);
    notification.setUser(user);
    notification.setPost(post);
    notification.setCreateDateTime(LocalDateTime.now());
    notification.setType(NotificationType.UPVOTE_POST);
    notification.setTitle(title);
    notification.setMessage(message);
    return new NotificationDto(notificationRepository.save(notification));
  }

  public NotificationDto createAndSaveUpvoteCommentNotification(User user, Comment comment) {
    String title = "Comment received upvote";
    String message = comment.getPlainText();
    Notification notification = new Notification();
    user.setUnreadNotification(user.getUnreadNotification() + 1);
    user = userRepository.save(user);
    notification.setUser(user);
    notification.setPost(comment.getPost());
    notification.setComment(comment);
    notification.setCreateDateTime(LocalDateTime.now());
    notification.setType(NotificationType.UPVOTE_COMMENT);
    notification.setTitle(title);
    notification.setMessage(message);
    return new NotificationDto(notificationRepository.save(notification));
  }

  public NotificationDto createAndSaveDownvotePostNotification(User user, Post post) {
    String title = "Post received downvote";
    String message = post.getTitle();
    Notification notification = new Notification();
    user.setUnreadNotification(user.getUnreadNotification() + 1);
    user = userRepository.save(user);
    notification.setUser(user);
    notification.setPost(post);
    notification.setCreateDateTime(LocalDateTime.now());
    notification.setType(NotificationType.DOWNVOTE_POST);
    notification.setTitle(title);
    notification.setMessage(message);
    return new NotificationDto(notificationRepository.save(notification));
  }

  public NotificationDto createAndSaveDownvoteCommentNotification(User user, Comment comment) {
    String title = "Comment received downvote";
    String message = comment.getPlainText();
    Notification notification = new Notification();
    user.setUnreadNotification(user.getUnreadNotification() + 1);
    user = userRepository.save(user);
    notification.setUser(user);
    notification.setPost(comment.getPost());
    notification.setComment(comment);
    notification.setCreateDateTime(LocalDateTime.now());
    notification.setType(NotificationType.DOWNVOTE_COMMENT);
    notification.setTitle(title);
    notification.setMessage(message);
    return new NotificationDto(notificationRepository.save(notification));
  }

  // TODO: Automatically delete notification after certain period?
  // TODO: Use cache to queue notifications, then send notifications after certain period?

}
