package com.heckerForum.heckerForum.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.heckerForum.heckerForum.dto.CurrentUserDto;
import com.heckerForum.heckerForum.dto.ExceptionMessage;
import com.heckerForum.heckerForum.dto.GenericWrapper;
import com.heckerForum.heckerForum.dto.ResponseData;
import com.heckerForum.heckerForum.dto.ResponseWrapper;
import com.heckerForum.heckerForum.exception.EmailNotFoundException;
import com.heckerForum.heckerForum.exception.LoginInvalidException;
import com.heckerForum.heckerForum.exception.OtpIncorrectException;
import com.heckerForum.heckerForum.exception.RegisterInvalidException;
import com.heckerForum.heckerForum.exception.UserNotFoundException;
import com.heckerForum.heckerForum.exception.UserNotVerifiedException;
import com.heckerForum.heckerForum.models.User;

public class BaseController {
  @ExceptionHandler({ LoginInvalidException.class, EmailNotFoundException.class, OtpIncorrectException.class,
      UserNotFoundException.class })
  protected ResponseEntity<?> handleCustomException(Exception e) {
    e.printStackTrace();
    ExceptionMessage message = new ExceptionMessage(HttpStatus.UNAUTHORIZED, e.getMessage());
    return new ResponseEntity<>(message, message.getStatus());
  }

  @ExceptionHandler(RegisterInvalidException.class)
  protected ResponseEntity<?> handleException(RegisterInvalidException e) {
    e.printStackTrace();
    ExceptionMessage message = new ExceptionMessage(HttpStatus.CONFLICT, e.getMessage());
    return new ResponseEntity<>(message, message.getStatus());
  }

  @ExceptionHandler(UserNotVerifiedException.class)
  protected ResponseEntity<?> handleException(UserNotVerifiedException e) {
    e.printStackTrace();
    ExceptionMessage message = new ExceptionMessage(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    return new ResponseEntity<>(message, message.getStatus());

  }

  @ExceptionHandler(Exception.class)
  protected ResponseEntity<?> handleException(Exception e) {
    e.printStackTrace();
    ExceptionMessage message = new ExceptionMessage(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    return new ResponseEntity<>(message, message.getStatus());
  }

  protected ResponseEntity<?> generateResponseEntity(Object data) {
    if (SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof User user) {
      CurrentUserDto userDto = new CurrentUserDto(user);
      userDto.setUnreadNotification(user.getUnreadNotification());
      userDto.setEnabled(user.isEnabled());
      userDto.setLocked(user.isLocked());
      userDto.setAuthenticated(SecurityContextHolder.getContext().getAuthentication().isAuthenticated());
      if (!(data instanceof ResponseData)) {
        return ResponseEntity.ok(new GenericWrapper(userDto, data));
      }

      return ResponseEntity.ok(new ResponseWrapper(userDto, (ResponseData) data));
    } else {
      if (!(data instanceof ResponseData)) {
        return ResponseEntity.ok(new GenericWrapper(null, data));
      }
      return ResponseEntity.ok(new ResponseWrapper(null, (ResponseData) data));
    }
  }

}
