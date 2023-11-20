package com.heckerForum.heckerForum.serializer;

import java.io.IOException;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class HttpStatusSerializer extends JsonSerializer<HttpStatus> {

  @Override
  public void serialize(HttpStatus value, JsonGenerator gen, SerializerProvider provider) throws IOException {
    gen.writeString(value.name());
  }

}
