package com.heckerForum.heckerForum.util;

import java.io.Serializable;
import java.time.Duration;
import java.util.Date;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
public class JwtUtil implements Serializable {

  private static final long serialVersionUID = 1L;

  public static final long JWT_ACCESS_TOKEN_VALIDITY_MINUTES = 5;

  public static final long JWT_REFRESH_TOKEN_VALIDITY_DAYS = 14;

  @Value("${ACCESS_TOKEN_COOKIE_NAME}")
  private String jwtAccessCookie;

  @Value("${REFRESH_TOKEN_COOKIE_NAME}")
  private String jwtRefreshCookie;

  @Autowired
  private KeyUtil keyUtil;

  public String getJwtAccessFromCookies(HttpServletRequest request) {
    Cookie cookie = WebUtils.getCookie(request, jwtAccessCookie);
    if (cookie != null) {
      return cookie.getValue();
    } else {
      return null;
    }
  }

  public String getJwtRefreshFromCookies(HttpServletRequest request) {
    Cookie cookie = WebUtils.getCookie(request, jwtRefreshCookie);
    if (cookie != null) {
      return cookie.getValue();
    } else {
      return null;
    }
  }

  public ResponseCookie generateAccessJwtCookie(String tokenValue) {
    ResponseCookie cookie = ResponseCookie
                              .from(jwtAccessCookie, tokenValue)
                              .path("/api")
                              .maxAge(Duration.ofMinutes(JWT_ACCESS_TOKEN_VALIDITY_MINUTES))
                              .httpOnly(true)
                              .build();
    return cookie;
  }

  public ResponseCookie generateRefreshJwtCookie(String tokenValue) {
    ResponseCookie cookie = ResponseCookie
                              .from(jwtRefreshCookie, tokenValue)
                              .path("/api")
                              .maxAge(Duration.ofDays(JWT_REFRESH_TOKEN_VALIDITY_DAYS))
                              .httpOnly(true)
                              .build();
    return cookie;
  }

  public ResponseCookie getCleanJwtAccessCookie() {
    ResponseCookie cookie = ResponseCookie.from(jwtAccessCookie, null).path("/api").build();
    return cookie;
  }

  public ResponseCookie getCleanJwtRefreshCookie() {
    ResponseCookie cookie = ResponseCookie.from(jwtRefreshCookie, null).path("/api").build();
    return cookie;
  }

  public Long getIdFromAccessJwtToken(String token) {
    return Long.valueOf(getClaimFromAccessJwtToken(token, Claims::getSubject));
  };

  public Date getIssuedAtDateFromAccessJwtToken(String token) {
    return getClaimFromAccessJwtToken(token, Claims::getIssuedAt);
  }

  public Date getExpirationDateFromAccessJwtToken(String token) {
    return getClaimFromAccessJwtToken(token, Claims::getExpiration);
  }

  public <T> T getClaimFromAccessJwtToken(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = getAllClaimsFromAccessJwtToken(token);
    return claimsResolver.apply(claims);
  }

  private Claims getAllClaimsFromAccessJwtToken(String token) {
    try {
      return Jwts.parser().setSigningKey(keyUtil.getAccessTokenPublicKey()).parseClaimsJws(token).getBody();
    } catch (Exception e) {
      log.error(e.getMessage());
      return null;
    }
  }

  private Boolean isAccessJwtTokenExpired(String token) {
    final Date expiration = getExpirationDateFromAccessJwtToken(token);
    return expiration.before(new Date());
  }

  private Boolean ignoreAccessJwtTokenExpiration(String token) {
    // here you specify tokens, for that the expiration is ignored
    return false;
  }

  public Boolean canAccessJwtTokenBeRefreshed(String token) {
    return (!isAccessJwtTokenExpired(token) || ignoreAccessJwtTokenExpiration(token));
  }

  public boolean validateAccessJwtToken(String authToken) {
    try {
      Jwts.parser().setSigningKey(keyUtil.getAccessTokenPublicKey()).parseClaimsJws(authToken);
      return true;
    } catch (Exception e) {
      log.error(e.getMessage());
    }

    return false;
  }

  public Long getIdFromRefreshJwtToken(String token) {
    return Long.valueOf(getClaimFromRefreshJwtToken(token, Claims::getSubject));
  };

  public Date getIssuedAtDateFromRefreshJwtToken(String token) {
    return getClaimFromRefreshJwtToken(token, Claims::getIssuedAt);
  }

  public Date getExpirationDateFromRefreshJwtToken(String token) {
    return getClaimFromRefreshJwtToken(token, Claims::getExpiration);
  }

  public <T> T getClaimFromRefreshJwtToken(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = getAllClaimsFromRefreshJwtToken(token);
    return claimsResolver.apply(claims);
  }

  private Claims getAllClaimsFromRefreshJwtToken(String token) {
    try {
      return Jwts.parser().setSigningKey(keyUtil.getRefreshTokenPublicKey()).parseClaimsJws(token).getBody();
    } catch (Exception e) {
      log.error(e.getMessage());
      return null;
    }
  }

  private Boolean isRefreshJwtTokenExpired(String token) {
    final Date expiration = getExpirationDateFromRefreshJwtToken(token);
    return expiration.before(new Date());
  }

  private Boolean ignoreRefreshJwtTokenExpiration(String token) {
    // here you specify tokens, for that the expiration is ignored
    return false;
  }

  public Boolean canRefreshJwtTokenBeRefreshed(String token) {
    return (!isRefreshJwtTokenExpired(token) || ignoreRefreshJwtTokenExpiration(token));
  }

  public boolean validateRefreshJwtToken(String authToken) {
    try {
      Jwts.parser().setSigningKey(keyUtil.getRefreshTokenPublicKey()).parseClaimsJws(authToken);
      return true;
    } catch (Exception e) {
      log.error(e.getMessage());
    }

    return false;
  }

}
