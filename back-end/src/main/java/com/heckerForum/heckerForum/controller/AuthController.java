package com.heckerForum.heckerForum.controller;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.heckerForum.heckerForum.constant.ErrorMessageConstant;
import com.heckerForum.heckerForum.dto.LoginRequest;
import com.heckerForum.heckerForum.dto.PasswordResetRequest;
import com.heckerForum.heckerForum.dto.RegisterRequest;
import com.heckerForum.heckerForum.dto.TokenDto;
import com.heckerForum.heckerForum.dto.UserDto;
import com.heckerForum.heckerForum.dto.UserInfoResponse;
import com.heckerForum.heckerForum.dto.VerificationRequest;
import com.heckerForum.heckerForum.exception.LoginInvalidException;
import com.heckerForum.heckerForum.exception.UserNotVerifiedException;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.service.EmailService;
import com.heckerForum.heckerForum.service.UserDetailsServiceImpl;
import com.heckerForum.heckerForum.util.JwtUtil;
import com.heckerForum.heckerForum.util.TokenGenerator;

@RestController
@RequestMapping("/api/auth")
public class AuthController extends BaseController {

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private HmacUtils emailHash;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  @Autowired
  private EmailService emailService;

  @Autowired
  private TokenGenerator tokenGenerator;

  @Autowired
  @Qualifier("jwtRefreshTokenAuthProvider")
  private JwtAuthenticationProvider refreshTokenAuthProvider;

  @GetMapping("/loggedin")
  public ResponseEntity<?> getIsLoggedIn(Principal principal) {
    if (principal != null) {
      return generateResponseEntity(SecurityContextHolder.getContext().getAuthentication().isAuthenticated());
    }

    return generateResponseEntity(false);
  }

  @PostMapping("/signin")
  public ResponseEntity<?> signIn(@Valid @RequestBody LoginRequest req) throws Exception {
    try {
      Authentication authentication = authenticationManager
          .authenticate(new UsernamePasswordAuthenticationToken(emailHash.hmacHex(req.getEmail()), req.getPassword()));

      SecurityContextHolder.getContext().setAuthentication(authentication);

      User user = (User) authentication.getPrincipal();

      List<String> roles = user.getAuthorities().stream()
                            .map(item -> item.getAuthority())
                            .collect(Collectors.toList());

      TokenDto tokens = tokenGenerator.createToken(authentication);
      HttpHeaders headers = new HttpHeaders();
      headers.add(HttpHeaders.SET_COOKIE, jwtUtil.generateAccessJwtCookie(tokens.getAccessToken()).toString());
      headers.add(HttpHeaders.SET_COOKIE, jwtUtil.generateRefreshJwtCookie(tokens.getRefreshToken()).toString());

      return ResponseEntity.ok()
                  .headers(headers)
                  .body(new UserInfoResponse(user.getId(), user.getUsername(), roles));
    } catch (BadCredentialsException e) {
      throw new LoginInvalidException(ErrorMessageConstant.LOGIN_INVALID);
    } catch (DisabledException e) {
      throw new UserNotVerifiedException(ErrorMessageConstant.USER_NOT_VERIFIED_EXCEPTION);
    }
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest req) throws Exception {

    // Save verification code to cache (username, code)
    // Save register data into user cache (username, data)
    req.setPassword(passwordEncoder.encode(req.getPassword()));
    String email = req.getEmail();
    req.setEmail(emailHash.hmacHex(req.getEmail()));
    String code = userDetailsService.saveRegisterCache(req);

    // Send code via email
    emailService.sendVerificationEmail(req.getUsername(), email, code);

    UserDto user = new UserDto();
    user.setUsername(req.getUsername());

//	    Set<String> strRoles = signUpRequest.getRole();
//	    Set<Role> roles = new HashSet<>();
//
//	    if (strRoles == null) {
//	      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
//	          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//	      roles.add(userRole);
//	    } else {
//	      strRoles.forEach(role -> {
//	        switch (role) {
//	        case "admin":
//	          Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
//	              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//	          roles.add(adminRole);
//
//	          break;
//	        case "mod":
//	          Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
//	              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//	          roles.add(modRole);
//
//	          break;
//	        default:
//	          Role userRole = roleRepository.findByName(ERole.ROLE_USER)
//	              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//	          roles.add(userRole);
//	        }
//	      });
//	    }
//	    user.setRoles(roles);

//	    User registeredUser = userRepository.save(user);

//	    return ResponseEntity.ok(registeredUser);
    return ResponseEntity.ok(user);
  }

  @PostMapping("/token")
  public ResponseEntity<?> token(@RequestBody TokenDto tokenDto) {
    Authentication authentication = refreshTokenAuthProvider
        .authenticate(new BearerTokenAuthenticationToken(tokenDto.getRefreshToken()));
    Jwt jwt = (Jwt) authentication.getCredentials();
    // check if present in db and not revoked, etc

    return ResponseEntity.ok(tokenGenerator.createToken(authentication));
  }

  @PostMapping("/verification")
  public ResponseEntity<?> verifyUser(@Valid @RequestBody VerificationRequest req) throws Exception {
    // Create user if verified
    User user = userDetailsService.signUpUser(req.getUsername(), req.getCode());
    return generateResponseEntity(new UserDto(user));
  }

  @PostMapping("/reset-password/send")
  public ResponseEntity<?> sendResetPassword(@RequestBody PasswordResetRequest req) throws Exception {
    String code = userDetailsService.saveResetPasswordCache(req.getEmail(), emailHash.hmacHex(req.getEmail()));
    if (!code.isEmpty()) {
      emailService.sendPasswordResetEmail(req.getEmail(), code);
    }
    return generateResponseEntity(req.getEmail());
  }

  @PostMapping("/reset-password/verify")
  public ResponseEntity<?> verifyResetPassword(@RequestBody PasswordResetRequest req) throws Exception {
    return generateResponseEntity(userDetailsService.verifyResetPassword(req.getEmail(), req.getCode()));
  }

  @PostMapping("/reset-password/set")
  public ResponseEntity<?> setResetPassword(@RequestBody PasswordResetRequest req) throws Exception {
    UserDto user = new UserDto();
    if (!userDetailsService.verifyResetPassword(req.getEmail(), req.getCode()).isEmpty()) {
      user = new UserDto(userDetailsService.setResetPassword(emailHash.hmacHex(req.getEmail()),
          passwordEncoder.encode(req.getPassword())));
    }
    return generateResponseEntity(user);
  }

  @PostMapping("/signout")
  public ResponseEntity<?> logoutUser() {
    HttpHeaders headers = new HttpHeaders();
    headers.add(HttpHeaders.SET_COOKIE, jwtUtil.getCleanJwtAccessCookie().toString());
    headers.add(HttpHeaders.SET_COOKIE, jwtUtil.getCleanJwtRefreshCookie().toString());
    // TODO: Perhaps revoke the tokens
    return ResponseEntity.ok().headers(headers).body("You've been signed out!");
  }
}
