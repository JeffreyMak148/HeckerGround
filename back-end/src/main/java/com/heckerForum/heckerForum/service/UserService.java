package com.heckerForum.heckerForum.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.constant.ErrorMessageConstant;
import com.heckerForum.heckerForum.dto.ProfileResponse;
import com.heckerForum.heckerForum.dto.UserDto;
import com.heckerForum.heckerForum.exception.UserNotFoundException;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.repository.UserRepository;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PostService postService;

  public ProfileResponse findPostsByUserIdAndPagination(Long userId, Integer pageNo, Integer pageSize, String sortBy)
      throws Exception {
    User user = userRepository.findById(userId).orElse(null);
    if (user == null) {
      throw new UserNotFoundException(ErrorMessageConstant.USER_NOT_FOUND_EXCEPTION);
    }
    Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));
    UserDto userDto = new UserDto(user);
    return new ProfileResponse(userDto, postService.findByUserAndPagination(user, paging));
  }

  public UserDto findUserById(Long userId) throws Exception {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(ErrorMessageConstant.USER_NOT_FOUND_EXCEPTION));
    UserDto userDto = new UserDto(user);
    return userDto;
  }

  public User retrieveUserById(Long userId) throws Exception {
    return userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(ErrorMessageConstant.USER_NOT_FOUND_EXCEPTION));
  }

  public User saveUser(User user) throws Exception {
    return userRepository.save(user);
  }

}
