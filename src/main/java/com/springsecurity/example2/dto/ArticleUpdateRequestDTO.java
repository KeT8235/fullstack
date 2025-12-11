package com.springsecurity.example2.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArticleUpdateRequestDTO {
    private String title;
    private String content;
}
