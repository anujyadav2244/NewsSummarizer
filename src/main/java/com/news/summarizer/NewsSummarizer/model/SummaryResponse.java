package com.news.summarizer.NewsSummarizer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "summaries")
public class SummaryResponse {
    @Id
    private String id;
    private String summary;
}
