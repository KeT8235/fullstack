package com.springsecurity.example2.dto;

import lombok.Data;
import java.util.List;

@Data
public class BlockArticleRequestDTO {
    private String title;
    private List<BlockDTO> blocks;
}
