package com.heckerForum.heckerForum.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import lombok.extern.log4j.Log4j2;

@Configuration
@Log4j2
@Profile({ "local", "dev", "prod" })
public class DbConfig {

  @Value("${DB_URL}")
  private String dbUrl;

  @Value("${DB_USERNAME}")
  private String dbUsername;

  @Value("${DB_PASSWORD}")
  private String dbPassword;

  @Primary
  @Bean
  public DataSource getDataSource() {
    log.info(dbUrl);
    log.info(dbUsername);
    return DataSourceBuilder.create()
        .driverClassName("com.mysql.cj.jdbc.Driver")
        .url(dbUrl)
        .username(dbUsername)
        .password(dbPassword)
        .build();
  }
}
