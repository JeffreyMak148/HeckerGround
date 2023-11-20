package com.heckerForum.heckerForum.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.apache.http.entity.ContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;

@Service
@Profile({ "local", "dev", "prod" })
public class FileService {

  @Value("${AWS_S3_IMAGE_BUCKET_NAME}")
  private String imageBucketName;

  @Value("${AWS_CLOUDFRONT_URL_SRC}")
  private String cloudfrontUrlSrc;

  @Autowired
  private AmazonS3 s3;

  public void save(String bucketName, 
                   String fileName, 
                   InputStream inputStream,
                   Optional<Map<String, String>> optionalMetadata) {
    ObjectMetadata metadata = new ObjectMetadata();
    optionalMetadata.ifPresent(map -> {
      if (!map.isEmpty()) {
        map.forEach(metadata::addUserMetadata);
      }
    });

    try {
      s3.putObject(bucketName, fileName, inputStream, metadata);
    } catch (AmazonServiceException e) {
      throw new IllegalStateException("Failed to upload file to s3", e);
    }
  }

  public String uploadImage(MultipartFile file) {
    if (file.isEmpty()) {
      throw new IllegalArgumentException("Cannot upload empty file");
    }

    if (!Arrays.asList(ContentType.IMAGE_JPEG.getMimeType(), ContentType.IMAGE_PNG.getMimeType(),
        ContentType.IMAGE_GIF.getMimeType()).contains(file.getContentType())) {
      throw new IllegalArgumentException("File must be an image");
    }

    Map<String, String> metadata = new HashMap<>();
    metadata.put("Content-Type", file.getContentType());
    metadata.put("Content-Length", String.valueOf(file.getSize()));

    String filename = String.format("%s.%s", UUID.randomUUID().toString(),
        StringUtils.getFilenameExtension(file.getOriginalFilename()));
    String fileSrc = String.format("%s/%s", cloudfrontUrlSrc, filename);

    try {
      save(imageBucketName, filename, file.getInputStream(), Optional.of(metadata));
      return fileSrc;
    } catch (IOException e) {
      throw new IllegalStateException(e);
    }

  }

}
