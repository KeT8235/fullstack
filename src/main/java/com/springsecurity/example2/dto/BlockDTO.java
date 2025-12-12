package com.springsecurity.example2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockDTO {
    private String type; // 예: text, image, todo 등
    private String content; // 텍스트 내용 또는 이미지 URL 등
    private Boolean checked; // todo 블록일 때만 사용
}
