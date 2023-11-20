package com.heckerForum.heckerForum.serializer;

import java.io.IOException;

import org.springframework.security.core.context.SecurityContextHolder;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.heckerForum.heckerForum.dto.CommentDto;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.models.Vote;
import com.heckerForum.heckerForum.models.VoteType;

public class CommentDtoSerializer extends JsonSerializer<CommentDto> {

  @Override
  public void serialize(CommentDto comment, JsonGenerator gen, SerializerProvider provider) throws IOException {
    if (comment == null) {
      gen.writeObject(comment);
      return;
    }

    if (SecurityContextHolder.getContext().getAuthentication().getPrincipal().getClass() != User.class) {
      gen.writeObject(comment);
      return;
    }

    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Vote vote = user.getVotedComments()
                    .stream()
                    .filter(v -> v.getComment().getId().equals(comment.getId()))
                    .findFirst()
                    .orElse(null);
    if (vote == null) {
      gen.writeObject(comment);
      return;
    }

    comment.setUpvoted(VoteType.UPVOTE.equals(vote.getType()));
    comment.setDownvoted(VoteType.DOWNVOTE.equals(vote.getType()));
    gen.writeObject(comment);
  }

}
