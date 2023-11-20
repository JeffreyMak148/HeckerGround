package com.heckerForum.heckerForum.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;

import com.heckerForum.heckerForum.util.JwtToUserConverter;
import com.heckerForum.heckerForum.util.KeyUtil;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

@Configuration
public class JwtConfig {
  
  @Autowired
  private KeyUtil keyUtil;
  
  @Autowired
  private JwtToUserConverter jwtToUserConverter;
  
  @Bean
  @Primary
  public JwtDecoder jwtAccessTokenDecoder() {
    return NimbusJwtDecoder.withPublicKey(keyUtil.getAccessTokenPublicKey()).build();
  }
  
  @Bean
  @Primary
  public JwtEncoder jwtAccessTokenEncoder() {
      JWK jwk = new RSAKey
              .Builder(keyUtil.getAccessTokenPublicKey())
              .privateKey(keyUtil.getAccessTokenPrivateKey())
              .build();
      JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
      return new NimbusJwtEncoder(jwks);
  }
  
  @Bean
  @Primary
  public JwtAuthenticationProvider jwtAccessTokenAuthProvider() {
      JwtAuthenticationProvider provider = new JwtAuthenticationProvider(jwtAccessTokenDecoder());
      provider.setJwtAuthenticationConverter(jwtToUserConverter);
      return provider;
  }
  
  @Bean
  @Qualifier("jwtRefreshTokenDecoder")
  public JwtDecoder jwtRefreshTokenDecoder() {
      return NimbusJwtDecoder.withPublicKey(keyUtil.getRefreshTokenPublicKey()).build();
  }

  @Bean
  @Qualifier("jwtRefreshTokenEncoder")
  public JwtEncoder jwtRefreshTokenEncoder() {
      JWK jwk = new RSAKey
              .Builder(keyUtil.getRefreshTokenPublicKey())
              .privateKey(keyUtil.getRefreshTokenPrivateKey())
              .build();
      JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
      return new NimbusJwtEncoder(jwks);
  }

  @Bean
  @Qualifier("jwtRefreshTokenAuthProvider")
  public JwtAuthenticationProvider jwtRefreshTokenAuthProvider() {
      JwtAuthenticationProvider provider = new JwtAuthenticationProvider(jwtRefreshTokenDecoder());
      provider.setJwtAuthenticationConverter(jwtToUserConverter);
      return provider;
  }
}
