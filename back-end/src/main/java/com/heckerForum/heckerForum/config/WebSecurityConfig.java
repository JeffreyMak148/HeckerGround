package com.heckerForum.heckerForum.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.heckerForum.heckerForum.filter.JwtFilter;
import com.heckerForum.heckerForum.service.UserDetailsServiceImpl;
import com.heckerForum.heckerForum.util.JwtToUserConverter;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

  @Autowired
  private UserDetailsServiceImpl userDetailService;

  @Autowired
  private JwtFilter jwtFilter;

  @Autowired
  private JwtToUserConverter jwtToUserConverter;

  private static final String[] WHITE_LIST_ALL_URL = { 
      "/api/auth/**" 
  };

  private static final String[] WHITE_LIST_GET_URL = { 
      "/api/posts/**", 
      "/api/comments/**", 
      "/api/profile/**",
      "/api/auth/loggedin" 
  };

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .cors((cors) -> cors.disable())
      .csrf((csrf) -> csrf.disable())
      .httpBasic((httpBasic) -> httpBasic.disable())
      .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests((req) -> 
        req
          .requestMatchers(WHITE_LIST_ALL_URL).permitAll()
          .requestMatchers(HttpMethod.GET, WHITE_LIST_GET_URL).permitAll()
          .anyRequest().authenticated()
      )
      .authenticationProvider(authenticationProvider())
      .oauth2ResourceServer((oauth2) -> 
        oauth2.jwt((jwt) -> jwt.jwtAuthenticationConverter(jwtToUserConverter))
      )
      .exceptionHandling((exceptions) -> 
        exceptions
          .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
          .accessDeniedHandler(new BearerTokenAccessDeniedHandler())
      )
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

    authProvider.setUserDetailsService(userDetailService);
    authProvider.setPasswordEncoder(passwordEncoder());

    return authProvider;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }
}
