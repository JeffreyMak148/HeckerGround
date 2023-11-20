package com.heckerForum.heckerForum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.extern.log4j.Log4j2;

@SpringBootApplication
@Log4j2
public class HeckerForumApplication {

  public static void main(String[] args) {
    log.debug("Starting main");
    SpringApplication.run(HeckerForumApplication.class, args);
  }

}
