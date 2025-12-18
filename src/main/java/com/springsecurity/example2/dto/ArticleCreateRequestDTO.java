package com.springsecurity.example2.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArticleCreateRequestDTO {
    private String title;
    private String content;
}
