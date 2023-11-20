package com.heckerForum.heckerForum.serializer;

import java.io.IOException;

import org.springframework.security.core.context.SecurityContextHolder;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.heckerForum.heckerForum.dto.PostDto;
import com.heckerForum.heckerForum.models.User;

public class PostDtoSerializer extends JsonSerializer<PostDto> {

  @Override
  public void serialize(PostDto post, JsonGenerator gen, SerializerProvider provider) throws IOException {
    if (post == null) {
      gen.writeObject(post);
      return;
    }

    if (SecurityContextHolder.getContext().getAuthentication().getPrincipal().getClass() != User.class) {
      gen.writeObject(post);
      return;
    }

    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    post.setBookmarked(user.getBookmarkedPosts()
                           .stream()
                           .anyMatch(b -> b.getPost().getId().equals(post.getId())));
    gen.writeObject(post);
  }

}
