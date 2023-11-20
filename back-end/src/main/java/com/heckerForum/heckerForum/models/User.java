package com.heckerForum.heckerForum.models;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users", 
      uniqueConstraints = { 
          @UniqueConstraint(columnNames = "username"),
          @UniqueConstraint(columnNames = "email") 
      })
@Getter
@Setter
public class User implements UserDetails {
  private static final long serialVersionUID = -3105214377881966566L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private LocalDateTime createDateTime;
  private String username;
  @JsonIgnore
  private String password;
  @JsonIgnore
  private String email;
  @JsonIgnore
  private boolean enabled = false;
  @JsonIgnore
  private boolean locked = false;
  @JsonIgnore
  @OneToMany(fetch = FetchType.EAGER, mappedBy = "user")
  @Column(name = "voted_comments")
  private Set<Vote> votedComments = new HashSet<Vote>();
  @JsonIgnore
  @OneToMany(fetch = FetchType.EAGER, mappedBy = "user")
  @Column(name = "bookmarked_posts")
  private Set<Bookmark> bookmarkedPosts = new HashSet<Bookmark>();
  @JsonIgnore
  private Long unreadNotification = Long.valueOf(0);

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "user")
  private Set<Authority> authorities = new HashSet<>();

  public User() {

  }

  public User(String username, String password, String email) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.createDateTime = LocalDateTime.now();
  }

  @Override
  public Set<Authority> getAuthorities() {
    // TODO Auto-generated method stub
    return authorities;
  }

  @Override
  public boolean isAccountNonExpired() {
    // TODO Auto-generated method stub
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    // TODO Auto-generated method stub
    return !this.locked;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    // TODO Auto-generated method stub
    return true;
  }

  @Override
  public boolean isEnabled() {
    // TODO Auto-generated method stub
    return this.enabled;
  }
}
