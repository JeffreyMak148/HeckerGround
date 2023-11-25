package com.heckerForum.heckerForum.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.heckerForum.heckerForum.dto.ProfileResponse;
import com.heckerForum.heckerForum.service.UserService;

@RestController
@RequestMapping("/api/profile")
public class UserController extends BaseController {

  @Autowired
  private UserService userService;

  @GetMapping("/me")
  public Principal getUser(Principal principal) {
    return principal;
  }

  @GetMapping("{userId}")
  public ResponseEntity<?> getProfileByIdAndPagination(@PathVariable Long userId,
      @RequestParam(name = "page", defaultValue = "0") Integer page,
      @RequestParam(name = "size", defaultValue = "10") Integer size) throws Exception {
    return generateResponseEntity(userService.findPostsByUserIdAndPagination(userId, page, size, "id"));
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<?> getUserById(@PathVariable Long userId) throws Exception {
    ProfileResponse response = new ProfileResponse();
    response.setUser(userService.findUserById(userId));
    return generateResponseEntity(response);
  }
}
