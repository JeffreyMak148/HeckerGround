package com.heckerForum.heckerForum.serializer;

import java.io.IOException;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.heckerForum.heckerForum.dto.CommentDto;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.models.VoteType;

public class CommentDtoListSerializer extends JsonSerializer<List<CommentDto>> {

  @Override
  public void serialize(List<CommentDto> comments, JsonGenerator gen, SerializerProvider provider) throws IOException {
    if (comments == null) {
      gen.writeObject(comments);
      return;
    }

    if (SecurityContextHolder.getContext().getAuthentication().getPrincipal().getClass() != User.class) {
      gen.writeObject(comments);
      return;
    }

    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    user.getVotedComments()
        .stream()
        .forEach(v -> 
          comments
          .stream()
          .forEach(c -> {
            if (c.getId().equals(v.getComment().getId())) {
              c.setUpvoted(VoteType.UPVOTE.equals(v.getType()));
              c.setDownvoted(VoteType.DOWNVOTE.equals(v.getType()));
            }
        }));

    gen.writeObject(comments);
  }

}
