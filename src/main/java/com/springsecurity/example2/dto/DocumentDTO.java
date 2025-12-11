package com.springsecurity.example2.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDTO {
    private Long id;
    private String title;
    private String content;
    private String authorLoginId; // 문서를 생성한 사용자 ID
}
