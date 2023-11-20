package com.heckerForum.heckerForum.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.constant.ErrorMessageConstant;
import com.heckerForum.heckerForum.dto.RegisterRequest;
import com.heckerForum.heckerForum.exception.EmailNotFoundException;
import com.heckerForum.heckerForum.exception.RegisterInvalidException;
import com.heckerForum.heckerForum.exception.UserNotFoundException;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  private static final String VERIFICATION_CACHE = "verificationCache";

  private static final String PASSWORD_RESET_CACHE = "passwordResetCache";

  private static final String USER_CACHE = "userCache";

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private OtpService otpService;

  @Autowired
  private CacheManager cacheManager;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//		User user = userRepository.findByUsername(username)
//				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));

    return user;
  }

  @Transactional
  public User signUpUser(String username, String code) throws Exception {
    if (username.isEmpty()) {
      throw new RegisterInvalidException("Empty username");
    }
    String regUsername = otpService.verifyOtp(VERIFICATION_CACHE, code, username);
    // Get register user data from cache
    RegisterRequest req = (RegisterRequest) cacheManager.getCache("userCache").get(regUsername).get();
    if (userRepository.existsByUsername(req.getUsername())) {
      throw new RegisterInvalidException("Username is already taken");
    }
    if (userRepository.existsByEmail(req.getEmail())) {
      throw new RegisterInvalidException("Email is already in use");
    }
    // Create user account
    User user = new User(req.getUsername(), req.getPassword(), req.getEmail());
    user.setEnabled(true);

    User registeredUser = userRepository.save(user);

    return registeredUser;
  }

  public String saveRegisterCache(RegisterRequest req) throws Exception {
    if (userRepository.existsByUsername(req.getUsername())) {
      throw new RegisterInvalidException(ErrorMessageConstant.REGISTER_INVALID_USERNAME);
    }
    if (userRepository.existsByEmail(req.getEmail())) {
      throw new RegisterInvalidException(ErrorMessageConstant.REGISTER_INVALID_EMAIL);
    }

    // Should I check cache as well, or overwrite in cache
    Cache userCache = cacheManager.getCache(USER_CACHE);

    // Save user in userCache
    userCache.put(req.getUsername(), req);
    // generate and save verification code in verificationCache
    String code = otpService.generateAndSaveOtp(VERIFICATION_CACHE, req.getUsername());

    return code;
  }

  public User enableUser(User user) {
    user.setEnabled(true);
    return userRepository.save(user);
  }

  public String verifyResetPassword(String email, String code) throws Exception {
    String resetEmail = otpService.verifyOtp(PASSWORD_RESET_CACHE, code, email);

    return resetEmail;

  }

  public String saveResetPasswordCache(String email, String hashedEmail) throws Exception {
    if (email.isEmpty()) {
      throw new EmailNotFoundException(ErrorMessageConstant.EMAIL_NOT_FOUND);
    }

    if (!userRepository.existsByEmail(hashedEmail)) {
      return "";
//			throw new EmailNotFoundException("Email not found");
    }

    String code = otpService.generateAndSaveOtp(PASSWORD_RESET_CACHE, email);

    return code;
  }

  @Transactional
  public User setResetPassword(String email, String password) throws Exception {
    if (email.isEmpty()) {
      throw new EmailNotFoundException(ErrorMessageConstant.EMAIL_NOT_FOUND);
    }

    User user = userRepository.findByEmail(email).orElse(null);
    if (user == null) {
      throw new UserNotFoundException(ErrorMessageConstant.USER_NOT_FOUND_EXCEPTION);
    }

    user.setPassword(password);
    User updatedUser = userRepository.save(user);
    return updatedUser;
  }

}
