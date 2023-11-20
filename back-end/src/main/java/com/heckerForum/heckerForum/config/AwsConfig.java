package com.heckerForum.heckerForum.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

@Configuration
@Profile({ "local", "dev", "prod" })
public class AwsConfig {
  
  @Value("${AWS_S3_ACCESS_KEY}")
  private String s3AccessKey;
  
  @Value("${AWS_S3_SECRET_KEY}")
  private String s3SecretKey;
  
  @Value("${AWS_S3_REGION}")
  private String s3Region;
  
  @Bean
  public AmazonS3 s3() {
    AWSCredentials awsCredentials = new BasicAWSCredentials(
        s3AccessKey,
        s3SecretKey
    );
    
    return AmazonS3ClientBuilder
              .standard()
              .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
              .withRegion(s3Region)
              .build();
  }
}
