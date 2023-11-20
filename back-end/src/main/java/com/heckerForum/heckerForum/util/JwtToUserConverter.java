package com.heckerForum.heckerForum.util;

import java.util.Collections;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import com.heckerForum.heckerForum.models.User;

@Component
public class JwtToUserConverter implements Converter<Jwt, UsernamePasswordAuthenticationToken> {

  @Override
  public UsernamePasswordAuthenticationToken convert(Jwt jwt) {
    User user = new User();
    user.setId(Long.valueOf(jwt.getSubject()));
    return new UsernamePasswordAuthenticationToken(user, jwt, Collections.emptyList());
  }
}