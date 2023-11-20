package com.heckerForum.heckerForum.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.heckerForum.heckerForum.models.Bookmark;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BookmarkDto extends ResponseData implements Serializable {
  private static final long serialVersionUID = 9194592085273648936L;
  private Long postId;
  private LocalDateTime createDateTime;

  public BookmarkDto(Bookmark bookmark) {
    this.postId = bookmark.getPost().getId();
    this.createDateTime = bookmark.getCreateDateTime();
  }

}
