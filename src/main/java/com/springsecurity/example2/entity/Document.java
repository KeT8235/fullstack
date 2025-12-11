package com.springsecurity.example2.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter // Document는 수정 가능하므로 Setter 추가
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name="Documents") // 테이블명 충돌 방지를 위해 명시적 지정
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob // Large Object (긴 문자열) 저장을 위해 사용
    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩
    @JoinColumn(name = "author_id", nullable = false) // FK 컬럼명 지정
    private User author;
}
