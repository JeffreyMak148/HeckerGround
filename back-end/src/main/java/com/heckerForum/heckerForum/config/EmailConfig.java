package com.heckerForum.heckerForum.config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
@Profile({ "local", "dev", "prod" })
public class EmailConfig {

  @Value("${MAIL_HOST}")
  private String mailHost;

  @Value("${MAIL_PORT}")
  private Integer mailPort;

  @Value("${MAIL_USERNAME}")
  private String mailUsername;

  @Value("${MAIL_PASSWORD}")
  private String mailPassword;

  @Primary
  @Bean
  public JavaMailSender mailSender() {

    JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
    javaMailSender.setHost(mailHost);
    javaMailSender.setPort(mailPort);

    javaMailSender.setUsername(mailUsername);
    javaMailSender.setPassword(mailPassword);

    Properties properties = javaMailSender.getJavaMailProperties();
    properties.put("mail.transport.protocol", "smtp");
    properties.put("mail.smtp.auth", "true");
    properties.put("mail.smtp.starttls.enable", "true");

    return javaMailSender;
  }
}
