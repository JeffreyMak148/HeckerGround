package com.heckerForum.heckerForum.serializer;

import java.io.IOException;

import org.hashids.Hashids;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class PostIdSerializer extends JsonSerializer<Long> {

  @Autowired
  private Hashids hashIds;

  @Override
  public void serialize(Long postId, JsonGenerator gen, SerializerProvider provider) throws IOException {
    gen.writeString(hashIds.encode(postId));
  }

}
