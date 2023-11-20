package com.heckerForum.heckerForum.util;

import java.text.MessageFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import com.heckerForum.heckerForum.dto.TokenDto;
import com.heckerForum.heckerForum.models.User;

@Component
public class TokenGenerator {
  @Autowired
  private JwtEncoder accessTokenEncoder;

  @Autowired
  @Qualifier("jwtRefreshTokenEncoder")
  private JwtEncoder refreshTokenEncoder;

  private String createAccessToken(Authentication authentication) {
    User user = (User) authentication.getPrincipal();
    return createAccessToken(user);
  }

  private String createAccessToken(User user) {
    Instant now = Instant.now();

    JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                                .issuer("HeckerGround")
                                .issuedAt(now)
                                .expiresAt(now.plus(5, ChronoUnit.MINUTES))
                                .subject(user.getId().toString())
                                .build();

    return accessTokenEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
  }

  private String createRefreshToken(Authentication authentication) {
    User user = (User) authentication.getPrincipal();
    return createRefreshToken(user);
  }

  private String createRefreshToken(User user) {
    Instant now = Instant.now();

    JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                                .issuer("HeckerGround")
                                .issuedAt(now)
                                .expiresAt(now.plus(14, ChronoUnit.DAYS))
                                .subject(user.getId().toString())
                                .build();

    return refreshTokenEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
  }

  public TokenDto createToken(Authentication authentication) {
    if (!(authentication.getPrincipal() instanceof User user)) {
      throw new BadCredentialsException(
          MessageFormat.format("principal {0} is not of User type", authentication.getPrincipal().getClass()));
    }

    TokenDto tokenDTO = new TokenDto();
    tokenDTO.setUserId(user.getId());
    tokenDTO.setAccessToken(createAccessToken(authentication));

    String refreshToken;
    if (authentication.getCredentials() instanceof Jwt jwt) {
      Instant now = Instant.now();
      Instant expiresAt = jwt.getExpiresAt();
      Duration duration = Duration.between(now, expiresAt);
      long daysUntilExpired = duration.toDays();
      if (daysUntilExpired < 7) {
        refreshToken = createRefreshToken(authentication);
      } else {
        refreshToken = jwt.getTokenValue();
      }
    } else {
      refreshToken = createRefreshToken(authentication);
    }
    tokenDTO.setRefreshToken(refreshToken);

    return tokenDTO;
  }
}