package com.heckerForum.heckerForum.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import com.heckerForum.heckerForum.constant.ErrorMessageConstant;
import com.heckerForum.heckerForum.models.User;

@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@AutoConfigureMockMvc
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
@TestInstance(Lifecycle.PER_CLASS)
@ActiveProfiles({ "test" })
public class AuthControllerIntegrationTest extends IntegrationBaseTest {

  private static final String ACCESS_TOKEN_COOKIE = "ACCESS_TOKEN";

  private static final String REFRESH_TOKEN_COOKIE = "REFRESH_TOKEN";

  @BeforeAll
  public void setup() {
    User user = createUser("testUsername", "testPw", "testEmail");
  }

  @AfterAll
  public void tearDown() {
    deleteDatasFromAllTables();
  }

  @Test
  public void testLoginUserFail() throws Exception {
    Map<String, Object> requestBody = Map.of("email", "failedEmail", "password", "failedPw");
    MockHttpServletResponse response = postUrl("/api/auth/signin", requestBody);
    assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatus());
    assertTrue(response.getContentAsString().contains(ErrorMessageConstant.LOGIN_INVALID));
    assertTrue(response.getCookies().length == 0);
  }

  @Test
  public void testLoginUserSuccess() throws Exception {
    Map<String, Object> requestBody = Map.of("email", "testEmail", "password", "testPw");
    MockHttpServletResponse response = postUrl("/api/auth/signin", requestBody);
    assertEquals(HttpStatus.OK.value(), response.getStatus());
    assertTrue(response.getContentAsString().contains("testUsername"));
    assertNotNull(response.getCookie(ACCESS_TOKEN_COOKIE).getValue());
    assertNotNull(response.getCookie(REFRESH_TOKEN_COOKIE).getValue());
  }
}
