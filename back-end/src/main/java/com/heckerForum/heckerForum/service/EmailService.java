package com.heckerForum.heckerForum.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.dto.EmailDto;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

  @Autowired
  private JavaMailSender emailSender;

  public boolean sendEmail(EmailDto emailDto) {
    MimeMessage mail = emailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mail);

    try {
      helper.setTo(emailDto.getRecipient());
      helper.setSubject(emailDto.getSubject());
      helper.setText(emailDto.getBody(), true);
      emailSender.send(mail);
      return true;
    } catch (Exception e) {
      e.printStackTrace();
    }

    return false;
  }

  public boolean sendVerificationEmail(String username, String email, String code) {

    String subject = "Heckerground verification code: " + code;

    String content = "<p>Hello " + username + ",</p>"
        + "<p>Please enter the verification code to complete your account registration.</p>"
        + "<p>You verification code is <b>" + code + "</b></p>"
        + "<p>Note: this code is set to expire in 30 minutes.</p>";

    EmailDto emailDto = new EmailDto();
    emailDto.setRecipient(email);
    emailDto.setSubject(subject);
    emailDto.setBody(content);
    try {
      sendEmail(emailDto);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean sendPasswordResetEmail(String email, String code) {
    String subject = "Heckerground reset password code: " + code;

    String content = "<p> Please enter the reset password code in order to reset your account password.</p>"
        + "<p>Your reset password code is <b>" + code + "</b></p>"
        + "<p>Note: this code is set to expire in 30 minutes.</p>";

    EmailDto emailDto = new EmailDto();
    emailDto.setRecipient(email);
    emailDto.setSubject(subject);
    emailDto.setBody(content);
    try {
      sendEmail(emailDto);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return false;
  }

}
