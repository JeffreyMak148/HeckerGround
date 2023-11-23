package com.heckerForum.heckerForum.config;

import java.security.NoSuchAlgorithmException;

import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.hashids.Hashids;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HashConfig {

  @Value("${EMAIL_HASH_SECRETKEY}")
  private String secretKey;

  @Value("${MASK_ID_HASH_SALT}")
  private String salt;

  @Bean
  public HmacUtils emailHash() {
    // TODO: Switch to BCrypt if possible
    // Override authentication manager to use BCrypt.match(rawPassword, encodedPassword) for authentication
    return new HmacUtils(HmacAlgorithms.HMAC_SHA_256, secretKey);
  }

  @Bean
  public Hashids hashIds() throws NoSuchAlgorithmException {
    return new Hashids(salt, 8);
  }
}
