package com.heckerForum.heckerForum.serializer;

import java.io.IOException;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.heckerForum.heckerForum.dto.PostDto;
import com.heckerForum.heckerForum.models.User;

public class PostDtoListSerializer extends JsonSerializer<List<PostDto>> {

  @Override
  public void serialize(List<PostDto> posts, JsonGenerator gen, SerializerProvider provider) throws IOException {
    if (posts == null) {
      gen.writeObject(posts);
      return;
    }

    if (SecurityContextHolder.getContext().getAuthentication().getPrincipal().getClass() != User.class) {
      gen.writeObject(posts);
      return;
    }
    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    posts.stream()
         .forEach(p -> 
           p.setBookmarked(user.getBookmarkedPosts()
                               .stream()
                               .anyMatch(b -> b.getPost().getId().equals(p.getId()))));
    gen.writeObject(posts);
  }

}
