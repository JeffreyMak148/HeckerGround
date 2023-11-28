package com.heckerForum.heckerForum.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.heckerForum.heckerForum.dto.NotificationDto;
import com.heckerForum.heckerForum.dto.NotificationResponse;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController extends BaseController {

  @Autowired
  private NotificationService notificationService;

  @GetMapping("")
  public ResponseEntity<?> getNotificationByPagination(@RequestParam(name = "page", defaultValue = "0") Integer page,
      @RequestParam(name = "size", defaultValue = "20") Integer size, @AuthenticationPrincipal User loggedInUser)
      throws Exception {
    if (loggedInUser == null) {
      return generateResponseEntity(null);
    }
    List<NotificationDto> notifications = notificationService.findByUserAndPagination(loggedInUser, page, size, "id");
    NotificationResponse response = new NotificationResponse();
    response.setNotifications(notifications);
    return generateResponseEntity(response);
  }

  @PostMapping("/read/{notificationId}")
  public ResponseEntity<?> setNotificationRead(@PathVariable Long notificationId,
      @AuthenticationPrincipal User loggedInUser) throws Exception {
    if (loggedInUser == null || notificationId == null) {
      return generateResponseEntity(null);
    }

    return generateResponseEntity(notificationService.saveRead(notificationId));
  }
  
  @PostMapping("/delete/all")
  public ResponseEntity<?> deleteAllNotification(@AuthenticationPrincipal User loggedInUser) throws Exception {
    if (loggedInUser == null) {
      return generateResponseEntity(null);
    }
    
    notificationService.deleteByUser(loggedInUser);

    return generateResponseEntity(null);
  }
  
  @PostMapping("/delete/{notificationId}")
  public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId,
      @AuthenticationPrincipal User loggedInUser) throws Exception {
    if (loggedInUser == null || notificationId == null) {
      return generateResponseEntity(null);
    }
    
    notificationService.delete(notificationId, loggedInUser);

    return generateResponseEntity(null);
  }

}
