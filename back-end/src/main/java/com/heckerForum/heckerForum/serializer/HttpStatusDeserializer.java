package com.heckerForum.heckerForum.serializer;

import java.io.IOException;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

public class HttpStatusDeserializer extends JsonDeserializer<HttpStatus> {

  @Override
  public HttpStatus deserialize(JsonParser parser, DeserializationContext arg1)
      throws IOException, JsonProcessingException {
    return HttpStatus.valueOf(parser.getValueAsString());
  }

}
