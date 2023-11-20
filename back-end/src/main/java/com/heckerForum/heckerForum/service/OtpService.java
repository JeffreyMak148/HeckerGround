package com.heckerForum.heckerForum.service;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache.ValueWrapper;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.constant.ErrorMessageConstant;
import com.heckerForum.heckerForum.exception.OtpIncorrectException;

@Service
public class OtpService {
  @Autowired
  private CacheManager cacheManager;

  public static final int CODE_NUM_DIGIT = 8;

  public String generateAndSaveOtp(String cacheName, String key) {
    StringBuilder generatedCode = new StringBuilder();

    try {
      SecureRandom number = SecureRandom.getInstance("SHA1PRNG");
      number.ints(CODE_NUM_DIGIT, 0, 9).forEach(i -> generatedCode.append(i));
    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
    }

    if (generatedCode.isEmpty()) {
      return null;
    }

    String code = generatedCode.toString();

//	    cacheManager.getCache("passwordResetCache").put(email, code);
    cacheManager.getCache(cacheName).put(key, code);

    return code;

  }

  public String verifyOtp(String cacheName, String code, String key) throws Exception {

//		String cachedCode = (String) cacheManager.getCache("passwordResetCache").get(email).get();
    ValueWrapper wrapper = cacheManager.getCache(cacheName).get(key);
    if (wrapper == null) {
      throw new OtpIncorrectException(ErrorMessageConstant.OTP_INCORRECT);
    }
    String cachedCode = (String) wrapper.get();
    if (cachedCode.isEmpty()) {
      throw new OtpIncorrectException(ErrorMessageConstant.OTP_INCORRECT);
    }
    if (!cachedCode.equals(code)) {
      throw new OtpIncorrectException(ErrorMessageConstant.OTP_INCORRECT);
    }
    // TODO: Remove (key, code) pair?
    return key;
  }
}
