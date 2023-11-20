package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.heckerForum.heckerForum.serializer.HttpStatusDeserializer;
import com.heckerForum.heckerForum.serializer.HttpStatusSerializer;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExceptionMessage implements Serializable {
  private static final long serialVersionUID = -1111184298320825410L;

  @JsonSerialize(using = HttpStatusSerializer.class)
  @JsonDeserialize(using = HttpStatusDeserializer.class)
  private HttpStatus status;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-mm-yyyy hh:mm:ss")
  private LocalDateTime timestamp;
  private String errorMessage;

  public ExceptionMessage(HttpStatus status, String errorMessage) {
    this.timestamp = LocalDateTime.now();
    this.status = status;
    this.errorMessage = errorMessage;
  }
}
