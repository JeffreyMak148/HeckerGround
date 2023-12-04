package com.heckerForum.heckerForum.enums;

import org.springframework.data.domain.Sort;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;

@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum SortByOrderEnum {
  ID("id", Sort.by(Sort.Order.asc("id"))),
  UPVOTE("upvote", Sort.by(Sort.Order.desc("upvote"))),
  DOWNVOTE("downvote", Sort.by(Sort.Order.desc("downvote"))),
  REPLYCOUNT("numberOfReply", Sort.by(Sort.Order.desc("numberOfReply")));

  private String sortByProperty;
  private Sort sortByOrder;

  SortByOrderEnum(String sortByProperty, Sort sortByOrder) {
    this.sortByProperty = sortByProperty;
    this.sortByOrder = sortByOrder;
  }
}
