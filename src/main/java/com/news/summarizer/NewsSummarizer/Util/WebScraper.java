package com.news.summarizer.NewsSummarizer.Util;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

@Service
public class WebScraper {

    public String extractTextFromUrl(String url) {
        try {
            if (url == null || url.isBlank()) {
                return "Error: URL is missing.";
            }

            // Fetch the HTML page
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(10000)
                    .get();

            // Extract title
            String title = doc.title();

            // Extract article paragraphs
            Elements paragraphs = doc.select("p");
            StringBuilder contentBuilder = new StringBuilder();

            for (Element paragraph : paragraphs) {
                String text = paragraph.text().trim();
                if (!text.isEmpty()) {
                    contentBuilder.append(text).append("\n\n");
                }
            }

            if (contentBuilder.isEmpty()) {
                return "Error: Could not extract article content.";
            }

            return "**" + title + "**\n\n" + contentBuilder.toString().trim();

        } catch (IOException e) {
            return "Error fetching URL: " + e.getMessage();
        }
    }
}
