package com.heckerForum.heckerForum.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;

@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum PostCategoryEnum {
  CHATTING("Chatting", 1), 
  NEWS("News", 2), 
  ENTERTAINMENT("Entertainment", 3), 
  LIFESTYLE("Lifestyle", 4),
  SPORTS("Sports", 5), 
  EDUCATION("Education", 6), 
  JOBS("Jobs", 7), 
  FINANCE("Finance", 8), 
  HARDWARE("Hardware", 9),
  SOFTWARE("Software", 10), 
  REALESTATE("Real Estate", 11), 
  WORLD("World", 12);

  private String category;
  private Integer catId;

  PostCategoryEnum(String category, Integer catId) {
    this.category = category;
    this.catId = catId;
  }
}
