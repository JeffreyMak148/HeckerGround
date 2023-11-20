package com.heckerForum.heckerForum.filter;

import java.io.IOException;
import java.util.stream.Stream;

import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import com.heckerForum.heckerForum.dto.TokenDto;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.service.UserService;
import com.heckerForum.heckerForum.util.JwtUtil;
import com.heckerForum.heckerForum.util.TokenGenerator;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
public class JwtFilter extends OncePerRequestFilter {

  private static final String[] excluded_urls = { 
      "/api/auth/signin", 
      "/api/auth/signup", 
      "/api/auth/verification",
      "/api/auth/reset-password/send", 
      "/api/auth/reset-password/verify", 
      "/api/auth/reset-password/reset", 
  };

  @Autowired
  private UserService userService;

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private JwtDecoder jwtAccessTokenDecoder;

  @Autowired
  @Qualifier("jwtRefreshTokenDecoder")
  private JwtDecoder jwtRefreshTokenDecoder;

  @Autowired
  private TokenGenerator tokenGenerator;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      String jwtAccess = jwtUtil.getJwtAccessFromCookies(request);
      String jwtRefresh = jwtUtil.getJwtRefreshFromCookies(request);
      if (Strings.isNotEmpty(jwtAccess) || Strings.isNotEmpty(jwtRefresh)) {
        if (jwtUtil.validateAccessJwtToken(jwtAccess)) {
          // Valid access token
          Long idAccess = jwtUtil.getIdFromAccessJwtToken(jwtAccess);
          User user = userService.retrieveUserById(idAccess);
          UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user,
              jwtAccessTokenDecoder.decode(jwtAccess), user.getAuthorities());

          authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
          if (jwtUtil.validateRefreshJwtToken(jwtRefresh)) {
            // Valid refresh token
            // TODO: Maybe store refresh token in db along with a revoke field
            // Check if token is revoked before authenticate the token
            // Main difference: No need to check access token against db (No need to store
            // access token)
            // while check refresh token against db (additional revoked field)
            Long idRefresh = jwtUtil.getIdFromRefreshJwtToken(jwtRefresh);
            User user = userService.retrieveUserById(idRefresh);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user,
                jwtRefreshTokenDecoder.decode(jwtRefresh), user.getAuthorities());

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            TokenDto tokens = tokenGenerator.createToken(authentication);
            response.addHeader(HttpHeaders.SET_COOKIE,
                jwtUtil.generateAccessJwtCookie(tokens.getAccessToken()).toString());
            response.addHeader(HttpHeaders.SET_COOKIE,
                jwtUtil.generateRefreshJwtCookie(tokens.getRefreshToken()).toString());
          } else {
            // Invalid access token and invalid refresh token
            // Do nothing
          }
        }
      }
    } catch (Exception e) {
      log.debug(e.getMessage());
    }

    filterChain.doFilter(request, response);
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    String url = request.getRequestURI();
    return Stream.of(excluded_urls).anyMatch(x -> new AntPathMatcher().match(x, url));
  }

}
