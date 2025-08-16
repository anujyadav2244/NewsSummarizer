package com.news.summarizer.NewsSummarizer.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.news.summarizer.NewsSummarizer.model.SummaryResponse;
import com.news.summarizer.NewsSummarizer.model.UrlRequest;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Service
public class SummarizerServiceImpl implements SummarizerService {

    @Value("${rapidapi.key}")
    private String rapidApiKey;

    @Value("${rapidapi.host}")
    private String rapidApiHost;

    @Value("${rapidapi.url}")
    private String rapidApiUrl;

    private final OkHttpClient client = new OkHttpClient();

    @Override
    public SummaryResponse summarizeFromUrl(UrlRequest urlRequest) {
        try {
            if (rapidApiKey == null || rapidApiKey.isBlank()) {
                return new SummaryResponse(null, "RapidAPI key not configured.");
            }

            String requestUrl = rapidApiUrl
                    + "?url=" + java.net.URLEncoder.encode(urlRequest.getUrl(), java.nio.charset.StandardCharsets.UTF_8)
                    + "&length=3";

            Request request = new Request.Builder()
                    .url(requestUrl)
                    .get()
                    .addHeader("X-RapidAPI-Key", rapidApiKey)
                    .addHeader("X-RapidAPI-Host", rapidApiHost)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String responseBody = (response.body() != null) ? response.body().string() : "No response body";

                if (response.code() == 403) {
                    return new SummaryResponse(null, "Access denied: You are not subscribed to this API or API key is invalid.");
                }
                if (!response.isSuccessful()) {
                    return new SummaryResponse(null, "RapidAPI error: " + response.code() + " - " + responseBody);
                }

                JSONObject jsonResponse = new JSONObject(responseBody);
                String summary = jsonResponse.optString("summary");

                if (summary.isBlank() && jsonResponse.has("result")) {
                    summary = jsonResponse.optString("result");
                }
                if (summary.isBlank() && jsonResponse.has("sm_api_content")) {
                    summary = jsonResponse.optString("sm_api_content");
                }

                if (summary.isBlank()) {
                    return new SummaryResponse(null, "RapidAPI returned no summary text.");
                }

                // ✅ Clean up summary before returning
                String cleanedSummary = summary
                        .replaceAll("^\"|\"$", "")   // remove leading/trailing quotes if present
                        .replace("\\n", "\n")        // convert escaped \n to actual newlines
                        .replaceAll("\\s+", " ")     // collapse multiple spaces
                        .trim();

                return new SummaryResponse(null, cleanedSummary);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new SummaryResponse(null, "Error: " + e.getMessage());
        }
    }
}
